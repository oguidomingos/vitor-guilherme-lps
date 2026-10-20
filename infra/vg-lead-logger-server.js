#!/usr/bin/env node
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = Number(process.env.PORT || 3021);
const LOG = process.env.LEAD_LOG || path.join(__dirname, "leads.jsonl");
// Cliques em WhatsApp e visitas das LPs (sem telefone): arquivo separado, sem auto-reply nem sync.
const CLICKS_LOG = process.env.CLICKS_LOG || path.join(__dirname, "clicks.jsonl");
const CLICK_TYPES = new Set(["wa_click", "pageview"]);
const seenClickIds = new Set();
const SYNC_DIR = process.env.THUMDRA_SYNC_DIR || path.join(__dirname, "..", "thumdra-sync");
const SYNC_SCRIPT = path.join(SYNC_DIR, "sync.js");
const THUMDRA_TOKEN = (process.env.THUMDRA_TOKEN || "").trim();
const SYNC_DEBOUNCE_MS = Number(process.env.THUMDRA_SYNC_DEBOUNCE_MS || 45000);

const ALLOW_SUFFIXES = [".github.io"];
const ALLOW_HOST_EXACT = new Set([
  "vitorguilhermeimoveis.com.br",
  "www.vitorguilhermeimoveis.com.br",
  "vitorguilherme.com.br",
  "www.vitorguilherme.com.br",
  "localhost",
  "127.0.0.1"
]);
const ALLOW_EXACT = new Set([
  "https://oguidomingos.github.io",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:8080",
  "null"
]);

function cors(origin) {
  if (!origin) return "*";
  if (ALLOW_EXACT.has(origin)) return origin;
  try {
    const u = new URL(origin);
    if (ALLOW_SUFFIXES.some((s) => u.hostname.endsWith(s))) return origin;
    if (ALLOW_HOST_EXACT.has(u.hostname)) return origin;
  } catch (_) {}
  return "null";
}


// ---- Resposta automática por WhatsApp (Evolution, instância vitor-guilherme) ----
const EVO_BASE = process.env.EVO_BASE || "http://127.0.0.1:8080";
const EVO_INSTANCE = process.env.EVO_INSTANCE || "vitor-guilherme";
const AUTO_REPLY = process.env.AUTO_REPLY !== "0";
const SITE_BASE = "https://vitorguilhermeimoveis.com.br";

function evoKey() {
  if (process.env.EVO_APIKEY) return process.env.EVO_APIKEY.trim();
  if (process.env.EVOLUTION_API_KEY) return process.env.EVOLUTION_API_KEY.trim();
  try {
    const m = fs.readFileSync("/root/bin/.env", "utf8").match(/^EVOLUTION_API_KEY=(.*)$/m);
    return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
  } catch (_) { return ""; }
}

const EMPREENDIMENTOS = {
  eleva: {
    nome: "Eleva 25",
    link: SITE_BASE + "/eleva-25/",
    corpo: "O Eleva 25 tem apartamentos de 2 quartos a partir de R$ 654.311,14 e de 3 quartos a partir de R$ 996.885,30."
  },
  versat: {
    nome: "Versat Home Resort",
    link: SITE_BASE + "/versat/",
    corpo: "O Versat Home Resort tem apartamentos com 3 suítes a partir de R$ 1.146.759,73."
  }
};

// Identifica o empreendimento: campo `emp` (data-lead-emp do form) e, se ausente, path de `pagina`.
function detectEmp(data) {
  const emp = String(data.emp || "").toLowerCase();
  if (emp.includes("eleva")) return "eleva";
  if (emp.includes("versat")) return "versat";
  try {
    const p = new URL(String(data.pagina || "")).pathname.toLowerCase();
    if (p.startsWith("/eleva-25")) return "eleva";
    if (p.startsWith("/versat")) return "versat";
  } catch (_) {}
  return null;
}

function normalizePhone(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10 || d.length === 11) d = "55" + d;
  return d.length >= 12 && d.length <= 13 && d.startsWith("55") ? d : null;
}

function buildMessage(key, nome) {
  const e = EMPREENDIMENTOS[key];
  return "Olá, " + nome + "! Estou retornando o seu contato sobre o " + e.nome + " - " + e.link + "! 😀\n\n" +
    e.corpo + "\n\nPoderia me informar quando podemos agendar uma visita?";
}

// Dedup em memória (retry da fila do front reenvia o mesmo lead): 1 msg por telefone+empreendimento / 24h.
const recentReplies = new Map();
function alreadyReplied(k) {
  const now = Date.now();
  for (const [kk, ts] of recentReplies) if (now - ts > 86400000) recentReplies.delete(kk);
  if (recentReplies.has(k)) return true;
  recentReplies.set(k, now);
  return false;
}

// Nunca lança: falha de envio não pode afetar a gravação do lead.
async function autoReply(data) {
  try {
    if (!AUTO_REPLY) return;
    const key = detectEmp(data);
    if (!key) {
      console.error("[vg-lead-logger] auto-reply ignorado: empreendimento não identificado emp=" + JSON.stringify(data.emp) + " pagina=" + JSON.stringify(data.pagina));
      return;
    }
    const number = normalizePhone(data.telefone || data.phone);
    if (!number) {
      console.error("[vg-lead-logger] auto-reply ignorado: telefone inválido " + JSON.stringify(data.telefone || data.phone));
      return;
    }
    const apikey = evoKey();
    if (!apikey) { console.error("[vg-lead-logger] auto-reply ignorado: sem chave Evolution"); return; }
    if (alreadyReplied(number + ":" + key)) {
      console.log("[vg-lead-logger] auto-reply duplicado ignorado emp=" + key + " to=" + number);
      return;
    }
    const nome = String(data.nome || "").trim().replace(/\s+/g, " ") || "tudo bem";
    const text = buildMessage(key, nome);
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 20000);
    const r = await fetch(EVO_BASE + "/message/sendText/" + EVO_INSTANCE, {
      method: "POST",
      headers: { apikey, "Content-Type": "application/json" },
      body: JSON.stringify({ number, text }),
      signal: ctl.signal
    }).finally(() => clearTimeout(t));
    const body = await r.text();
    if (!r.ok) {
      console.error("[vg-lead-logger] auto-reply FALHOU http=" + r.status + " emp=" + key + " to=" + number + " resp=" + body.slice(0, 300));
      return;
    }
    let id = "", status = "";
    try { const j = JSON.parse(body); id = j.key && j.key.id; status = j.status; } catch (_) {}
    console.log("[vg-lead-logger] auto-reply OK http=" + r.status + " emp=" + key + " to=" + number + " msgId=" + id + " status=" + status);
  } catch (e) {
    console.error("[vg-lead-logger] auto-reply ERRO:", e && e.message || e);
  }
}

let syncTimer = null;
function queueSyncOnce() {
  // Sem token: só enfileira mentalmente — o cron de 6h faz o export CSV.
  if (!THUMDRA_TOKEN) return;
  if (!fs.existsSync(SYNC_SCRIPT)) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    try {
      const child = spawn(process.execPath, [SYNC_SCRIPT, "--once"], {
        cwd: SYNC_DIR,
        env: process.env,
        detached: true,
        stdio: "ignore"
      });
      child.unref();
      console.log("[vg-lead-logger] thumdra-sync --once disparado (debounce)");
    } catch (e) {
      console.error("[vg-lead-logger] falha ao disparar sync:", e.message || e);
    }
  }, SYNC_DEBOUNCE_MS);
}

const server = http.createServer((req, res) => {
  const origin = req.headers.origin || "";
  const allow = cors(origin);
  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = (req.url || "").split("?")[0];
  if (req.method === "POST" && (url === "/vg-lead" || url === "/")) {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > 1e6) req.destroy();
    });
    req.on("end", () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const row = {
          ts: new Date().toISOString(),
          ip: req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          ua: req.headers["user-agent"] || "",
          ...data
        };
        if (CLICK_TYPES.has(String(data.tipo || ""))) {
          const cid = String(data.click_id || "");
          if (cid && seenClickIds.has(cid)) { res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify({ ok: true, dup: true })); }
          if (cid) { seenClickIds.add(cid); if (seenClickIds.size > 50000) seenClickIds.clear(); }
          const crow = Object.assign({}, row, { client_ts: data.ts || "", ts: new Date().toISOString() });
          const fd = fs.openSync(CLICKS_LOG, "a", 0o600);
          try { fs.writeSync(fd, JSON.stringify(crow) + "\n"); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ ok: true }));
        }
        const isTest = data.is_test === true || /^\s*teste\b/i.test(String(data.nome || ""));
        if (isTest) row.is_test = true;
        fs.appendFileSync(LOG, JSON.stringify(row) + "\n");
        if (isTest) console.log("[vg-lead-logger] lead de TESTE: sem auto-reply/sync");
        else { queueSyncOnce(); autoReply(data); }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    });
    return;
  }

  if (req.method === "GET" && url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true }));
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("[vg-lead-logger] listening on 127.0.0.1:" + PORT + " log=" + LOG);
});
