/* LPs de lançamento do Vitor Guilherme (Versat, Eleva 25), comportamento compartilhado.

   Diferente de app.js (que ainda serve as outras LPs): aqui NÃO existe modal na porta.
   - Botão de WhatsApp = link direto para a conversa (funciona mesmo sem JavaScript).
   - Todo clique em WhatsApp é registrado (tipo "wa_click") com UTM, seção, sessão e horário.
   - Captura de lead (nome + WhatsApp + metragem) fica em blocos DEPOIS do conteúdo, com contrapartida.
   Registro: POST em LOG_ENDPOINT. Cliques vão para clicks.jsonl, leads para leads.jsonl (ver README). */
(function () {
  "use strict";

  var VITOR_WA = "556191223005";
  var LOG_ENDPOINT = "https://leads.expoente.marketing/vg-lead";
  var TRACK = { GTM_ID: "GTM-543P3VS8", GADS_ID: "AW-18410246781", GADS_WA: "AW-18410246781/wWJDCJ32-PUcEP2k2MpE" };

  var body = document.body;
  var EMP = body.getAttribute("data-emp") || "";
  var EMP_NOME = body.getAttribute("data-emp-nome") || EMP;

  // ---------- Tag Manager + Google Ads ----------
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  (function (w, d, s, l, i) {
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", TRACK.GTM_ID);
  var gads = document.createElement("script");
  gads.async = true; gads.src = "https://www.googletagmanager.com/gtag/js?id=" + TRACK.GADS_ID;
  document.head.appendChild(gads);
  gtag("js", new Date());
  gtag("config", TRACK.GADS_ID);

  function fireGadsWa() {
    try { gtag("event", "conversion", { send_to: TRACK.GADS_WA }); } catch (e) {}
  }
  function push(evt, params) {
    try { window.dataLayer.push(Object.assign({ event: evt, emp: EMP }, params || {})); } catch (e) {}
  }

  // ---------- Sessão e origem (UTM) ----------
  function rid(p) { return p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }

  var sessionId = load("vg_sid");
  if (!sessionId) { sessionId = rid("s"); store("vg_sid", sessionId); }

  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "fbclid"];
  var origin = {};
  try {
    var saved = JSON.parse(load("vg_origin") || "{}");
    var qs = new URLSearchParams(location.search);
    var fresh = false;
    KEYS.forEach(function (k) { if (qs.get(k)) { saved[k] = qs.get(k); fresh = true; } });
    if (fresh) store("vg_origin", JSON.stringify(saved));
    origin = saved;
  } catch (e) {}

  function base(tipo) {
    var o = { tipo: tipo, emp: EMP, session_id: sessionId, pagina: location.href.split("#")[0], referrer: document.referrer || "" };
    KEYS.forEach(function (k) { o[k] = origin[k] || ""; });
    if (/[?&]vg_test=1/.test(location.search)) o.is_test = true; // testes: gravados, mas fora do relatório e sem auto-resposta
    return o;
  }

  // ---------- Envio com fila de segurança (nunca perder um registro) ----------
  var QKEY = "vg_lp_queue_v1";
  function readQ() { try { var q = JSON.parse(localStorage.getItem(QKEY) || "[]"); return Array.isArray(q) ? q : []; } catch (e) { return []; } }
  function writeQ(q) { try { localStorage.setItem(QKEY, JSON.stringify(q.slice(-200))); } catch (e) {} }
  function enqueue(p) { var q = readQ().filter(function (x) { return x.click_id !== p.click_id; }); q.push(p); writeQ(q); }
  function dequeue(id) { writeQ(readQ().filter(function (x) { return x.click_id !== id; })); }

  function postJson(p, unload) {
    var data = JSON.stringify(p);
    if (unload && navigator.sendBeacon) {
      try { if (navigator.sendBeacon(LOG_ENDPOINT, new Blob([data], { type: "text/plain" }))) return Promise.resolve(true); } catch (e) {}
    }
    return fetch(LOG_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain" }, body: data, keepalive: true })
      .then(function (r) { return !!(r && r.ok); }).catch(function () { return false; });
  }
  function send(p, unload) {
    p.click_id = p.click_id || rid("c");
    p.client_ts = new Date().toISOString();
    enqueue(p);
    return postJson(p, unload).then(function (ok) { if (ok) dequeue(p.click_id); return ok; });
  }
  function flush() {
    var q = readQ(), chain = Promise.resolve();
    q.forEach(function (p) { chain = chain.then(function () { return postJson(p, false).then(function (ok) { if (ok) dequeue(p.click_id); }); }); });
  }
  flush();
  window.addEventListener("online", flush);
  setInterval(flush, 30000);

  // ---------- Visita ----------
  send(base("pageview"), false);

  // ---------- Seção de onde o clique partiu ----------
  function sectionOf(el) {
    var s = el.closest("[data-sec]");
    if (s) return s.getAttribute("data-sec");
    s = el.closest("section[id],header,footer");
    return s ? (s.id || s.tagName.toLowerCase()) : "pagina";
  }

  // ---------- WhatsApp direto ----------
  function refTail() {
    var a = [origin.utm_source, origin.utm_campaign, origin.utm_content].filter(Boolean);
    return a.length ? "\n(ref: " + a.join("/") + ")" : "";
  }
  function waUrl(msg) { return "https://wa.me/" + VITOR_WA + "?text=" + encodeURIComponent(msg + refTail()); }

  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var msg = a.getAttribute("data-wa-msg") || ("Olá Vitor! Vi a página do " + EMP_NOME + " e quero conversar.");
    a.setAttribute("href", waUrl(msg));
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
    a.addEventListener("click", function () {
      var p = base("wa_click");
      p.section = sectionOf(a);
      p.botao = (a.getAttribute("data-wa-id") || (a.textContent || "").trim()).slice(0, 80);
      send(p, true);
      fireGadsWa();
      push("vg_wa_click", { section: p.section });
    });
  });

  // ---------- Captura (depois do conteúdo) ----------
  function digits(v) { return String(v || "").replace(/\D/g, ""); }
  document.querySelectorAll("form[data-capture]").forEach(function (form) {
    var err = form.querySelector(".cap-err");
    var done = form.parentNode.querySelector(".cap-done");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = function (n) { var e = form.querySelector('[name="' + n + '"]'); return e ? String(e.value || "").trim() : ""; };
      if (f("website")) return; // honeypot
      var nome = f("nome"), tel = f("telefone"), interesse = f("interesse");
      var d = digits(tel);
      if (nome.length < 2) { err.textContent = "Informe seu nome."; err.hidden = false; return; }
      if (d.length < 10 || d.length > 13) { err.textContent = "Informe um WhatsApp válido, com DDD."; err.hidden = false; return; }
      err.hidden = true;
      var sec = form.closest("[data-sec]");
      var p = base("lead");
      p.nome = nome; p.telefone = tel; p.phone = tel; p.interesse = interesse;
      p.section = sec ? sec.getAttribute("data-sec") : "captura";
      p.botao = "captura";
      var btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      send(p, false);
      fireGadsWa();
      push("vg_lead_form", { section: p.section, interesse: interesse });
      // Evento padrão de Lead (Meta): mesmo event_id nos dois caminhos para o Meta deduplicar.
      var leadId = p.click_id;
      try { if (typeof window.fbq === "function") window.fbq("track", "Lead", {}, { eventID: leadId }); } catch (e) {}
      push("generate_lead", { event_id: leadId, section: p.section });
      form.hidden = true;
      if (done) {
        var nm = done.querySelector("[data-nome]");
        if (nm) nm.textContent = nome.split(" ")[0];
        done.hidden = false;
      }
    });
  });

  // ---------- Topbar, reveal, lightbox ----------
  var topbar = document.querySelector(".topbar");
  if (topbar) {
    var onScroll = function () { topbar.classList.toggle("scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  document.querySelectorAll(".reveal").forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });

  var lb = document.querySelector(".lb");
  if (lb) {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll("[data-full]").forEach(function (s) {
      s.addEventListener("click", function () { lbImg.src = s.getAttribute("data-full"); lb.classList.add("open"); });
    });
    lb.addEventListener("click", function () { lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  // Barra fixa de WhatsApp (celular): some enquanto o botão do hero está visível, para não duplicar.
  var mbar = document.querySelector(".mbar"), heroCta = document.querySelector(".hero .actions");

  // Barra fixa também some enquanto uma captura está na tela: não cobre o botão de enviar.
  if (mbar && "IntersectionObserver" in window) {
    var capsOn = new Set(), heroOn = false;
    var sync = function () { mbar.classList.toggle("is-hidden", heroOn || capsOn.size > 0); };
    if (heroCta) new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting; sync(); }).observe(heroCta);
    var capIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) capsOn.add(e.target); else capsOn.delete(e.target); });
      sync();
    });
    document.querySelectorAll("form[data-capture]").forEach(function (f) { capIo.observe(f); });
  }

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
