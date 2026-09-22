/* Vitor Guilherme LPs — comportamento compartilhado
   CACHEBUST 2026-09-22T17:05-03 expoente-leads+queue
   - Tracking (GTM + Google Ads conversion)
   - Modal lead gate antes de qualquer WhatsApp
   - Topbar / reveal / lightbox / simulador simples
*/
(function () {
  "use strict";

  // ---- Config do corretor (ajuste aqui) ----
  var VITOR_WA = "5561985090580"; // (61) 98509-0580

  // Endpoint de persistência do lead (POST JSON). Logger jsonl na VPS.
  var LEAD_ENDPOINT = "https://leads.expoente.marketing/vg-lead";

  // ============================================================
  // TRACKING — Meta Pixel + Google Tag Manager + Google Ads
  // ============================================================
  var TRACK = {
    PIXEL_ID: "",              // Pixel entra pelas tags do GTM (vazio evita disparo em dobro)
    GTM_ID:   "GTM-543P3VS8", // container do Google Tag Manager (Vitor Guilherme)
    GADS_ID:  "AW-18410246781",                    // Google Ads account
    GADS_WA:  "AW-18410246781/wWJDCJ32-PUcEP2k2MpE" // conversão "Nova conversa no WhatsApp"
  };
  // Alias legado (evita typo GADS_CONV vs GADS_WA em checagens antigas)
  TRACK.GADS_CONV = TRACK.GADS_WA;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  if (TRACK.GTM_ID) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", TRACK.GTM_ID);
  }

  if (TRACK.GADS_ID) {
    var gadsScript = document.createElement("script");
    gadsScript.async = true;
    gadsScript.src = "https://www.googletagmanager.com/gtag/js?id=" + TRACK.GADS_ID;
    document.head.appendChild(gadsScript);
    gtag("js", new Date());
    gtag("config", TRACK.GADS_ID);
  }

  if (TRACK.PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", TRACK.PIXEL_ID);
    fbq("track", "PageView");
  }

  function vgTrack(evt, params) {
    params = params || {};
    try { if (TRACK.PIXEL_ID && window.fbq) fbq("track", evt, params); } catch (e) {}
    try { window.dataLayer.push(Object.assign({ event: "vg_" + String(evt).toLowerCase() }, params)); } catch (e) {}
  }
  window.__vgTrack = vgTrack;

  /** Dispara conversão Google Ads "Nova conversa no WhatsApp" (GADS_WA). */
  function fireGadsWa(cb) {
    var sendTo = TRACK.GADS_WA || TRACK.GADS_CONV;
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      if (typeof cb === "function") cb();
    };
    try {
      if (sendTo && typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: sendTo,
          event_callback: finish
        });
        setTimeout(finish, 1200);
        return;
      }
    } catch (e) {}
    finish();
  }
  window.__vgFireGadsWa = fireGadsWa;

  // ---- UTM → ref na mensagem ----
  try {
    var qs = new URLSearchParams(window.location.search);
    if (qs.get("utm_source")) {
      sessionStorage.setItem("vg_utm", JSON.stringify({
        s: qs.get("utm_source") || "",
        c: qs.get("utm_campaign") || "",
        n: qs.get("utm_content") || ""
      }));
    }
  } catch (e) {}
  function waRef() {
    try {
      var u = JSON.parse(sessionStorage.getItem("vg_utm") || "null");
      if (!u || !u.s) return "";
      return "\nref: " + [u.s, u.c, u.n].filter(Boolean).join("/");
    } catch (e) { return ""; }
  }
  window.__vgWaRef = waRef;

  function digitsPhone(v) {
    return String(v || "").replace(/\D/g, "");
  }
  function validPhone(v) {
    var d = digitsPhone(v);
    return d.length >= 10 && d.length <= 13;
  }

  function readStoredLead() {
    try { return JSON.parse(localStorage.getItem("vg_lead") || "null"); } catch (e) { return null; }
  }
  function storeLead(lead) {
    try { localStorage.setItem("vg_lead", JSON.stringify(lead)); } catch (e) {}
  }

  var LEAD_QUEUE_KEY = "vg_lead_queue_v1";
  function readLeadQueue() {
    try {
      var q = JSON.parse(localStorage.getItem(LEAD_QUEUE_KEY) || "[]");
      return Array.isArray(q) ? q : [];
    } catch (e) { return []; }
  }
  function writeLeadQueue(q) {
    try { localStorage.setItem(LEAD_QUEUE_KEY, JSON.stringify(q || [])); } catch (e) {}
  }
  function enqueueLeadPayload(payload) {
    var q = readLeadQueue();
    var id = payload._qid || ("q_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8));
    payload._qid = id;
    payload._queued_at = payload._queued_at || new Date().toISOString();
    // dedup by qid
    q = q.filter(function (x) { return x && x._qid !== id; });
    q.push(payload);
    // cap queue
    if (q.length > 50) q = q.slice(-50);
    writeLeadQueue(q);
    return id;
  }
  function dequeueLeadPayload(qid) {
    writeLeadQueue(readLeadQueue().filter(function (x) { return !x || x._qid !== qid; }));
  }
  function buildLeadPayload(lead) {
    var payload = {
      nome: lead.nome || "",
      phone: lead.telefone || lead.phone || "",
      telefone: lead.telefone || "",
      interesse: lead.interesse || "",
      pagina: window.location.href,
      botao: lead.source || "modal",
      emp: lead.emp || "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      gclid: "",
      gbraid: "",
      fbclid: ""
    };
    try {
      var u = new URL(window.location.href);
      var q = u.searchParams;
      payload.utm_source = q.get("utm_source") || "";
      payload.utm_medium = q.get("utm_medium") || "";
      payload.utm_campaign = q.get("utm_campaign") || "";
      payload.utm_content = q.get("utm_content") || "";
      payload.utm_term = q.get("utm_term") || "";
      payload.gclid = q.get("gclid") || "";
      payload.gbraid = q.get("gbraid") || "";
      payload.fbclid = q.get("fbclid") || "";
    } catch (e) {}
    return payload;
  }
  function postLeadPayload(payload) {
    if (!LEAD_ENDPOINT) return Promise.resolve(false);
    return fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      mode: "cors"
    }).then(function (res) {
      return !!(res && res.ok);
    }).catch(function () { return false; });
  }
  function flushLeadQueue() {
    var q = readLeadQueue();
    if (!q.length) return;
    // send sequentially to avoid stampede
    var chain = Promise.resolve();
    q.forEach(function (item) {
      chain = chain.then(function () {
        return postLeadPayload(item).then(function (ok) {
          if (ok) dequeueLeadPayload(item._qid);
        });
      });
    });
    return chain;
  }
  function persistLead(lead) {
    // Sempre salva local primeiro — nunca perder lead
    storeLead(lead);
    var payload = buildLeadPayload(lead);
    enqueueLeadPayload(payload);
    postLeadPayload(payload).then(function (ok) {
      if (ok) dequeueLeadPayload(payload._qid);
    });
  }
  // retry queue on load / online / periodic
  try {
    flushLeadQueue();
    window.addEventListener("online", function () { flushLeadQueue(); });
    setInterval(function () { flushLeadQueue(); }, 30000);
  } catch (e) {}

  function buildWaUrl(msg) {
    return "https://wa.me/" + VITOR_WA + "?text=" + encodeURIComponent(msg);
  }

  function openWaUrl(url, opts) {
    opts = opts || {};
    if (opts.redirect) {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  }

  // ---- Modal lead gate (obrigatório) ----
  var modalState = { pendingMsg: "", opts: null, open: false };


  function injectModalCss() {
    if (document.getElementById("vg-lead-modal-css")) return;
    var css = document.createElement("style");
    css.id = "vg-lead-modal-css";
    css.textContent = [
      "html.vg-modal-open{overflow:hidden}",
      ".vg-modal{position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;padding:0;opacity:0;pointer-events:none;transition:opacity .25s cubic-bezier(.22,.61,.36,1)}",
      ".vg-modal.is-open{opacity:1;pointer-events:auto}",
      ".vg-modal__backdrop{position:absolute;inset:0;background:rgba(20,17,13,.55);backdrop-filter:blur(4px)}",
      ".vg-modal__panel{position:relative;z-index:1;width:100%;max-width:440px;background:#fffdf8;border:1px solid rgba(20,17,13,.12);border-radius:22px 22px 0 0;box-shadow:0 24px 60px -28px rgba(20,17,13,.45);padding:22px 20px 28px;transform:translateY(18px);transition:transform .28s cubic-bezier(.22,.61,.36,1);max-height:min(92svh,640px);overflow:auto;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#14110d}",
      ".vg-modal.is-open .vg-modal__panel{transform:none}",
      ".vg-modal__eyebrow{font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;font-weight:700;color:#6b4e26;margin:0 0 8px}",
      ".vg-modal__panel h2{font-family:'Playfair Display',Georgia,serif;font-weight:600;font-size:1.55rem;line-height:1.15;letter-spacing:-.01em;margin:0 0 8px}",
      ".vg-modal__sub{font-size:.92rem;color:#6b6356;margin:0 0 18px;line-height:1.45}",
      ".vg-modal__form{display:flex;flex-direction:column;gap:12px}",
      ".vg-field{display:flex;flex-direction:column;gap:6px;font-size:.82rem;font-weight:600}",
      ".vg-field em{font-style:normal;font-weight:500;opacity:.55}",
      ".vg-field input{width:100%;padding:13px 14px;font-size:16px;font-family:inherit;color:#14110d;background:#fff;border:1px solid rgba(20,17,13,.12);border-radius:12px;box-sizing:border-box}",
      ".vg-field input:focus{outline:none;border-color:#b0834b;box-shadow:0 0 0 3px rgba(176,131,75,.16)}",
      ".vg-modal__err{color:#9c2b2b;font-size:.82rem;font-weight:600;margin:0}",
      ".vg-modal__submit{margin-top:6px;width:100%;padding:15px 18px;border:none;border-radius:100px;background:#25d366;color:#fff;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 12px 28px -12px rgba(37,211,102,.7)}",
      ".vg-modal__submit:hover{background:#128c7e}",
      "@media (min-width:560px){.vg-modal{align-items:center;padding:24px}.vg-modal__panel{border-radius:18px;padding:28px 26px 30px}}"
    ].join("");
    document.head.appendChild(css);
  }

  function ensureModal() {
    injectModalCss();
    var existing = document.getElementById("vg-lead-modal");
    if (existing) return existing;

    var wrap = document.createElement("div");
    wrap.id = "vg-lead-modal";
    wrap.className = "vg-modal";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<div class="vg-modal__backdrop" data-vg-backdrop></div>' +
      '<div class="vg-modal__panel" role="dialog" aria-modal="true" aria-labelledby="vg-lead-title">' +
        '<div class="vg-modal__head">' +
          '<p class="vg-modal__eyebrow">Antes de falar no WhatsApp</p>' +
          '<h2 id="vg-lead-title">Deixe seus dados</h2>' +
          '<p class="vg-modal__sub">Assim o Vitor já te atende com contexto. Campos com * são obrigatórios.</p>' +
        '</div>' +
        '<form class="vg-modal__form" id="vg-lead-form" novalidate>' +
          '<label class="vg-field"><span>Nome *</span>' +
            '<input name="nome" type="text" autocomplete="name" required placeholder="Como prefere ser chamado(a)" /></label>' +
          '<label class="vg-field"><span>WhatsApp / telefone *</span>' +
            '<input name="telefone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(61) 9 0000-0000" /></label>' +
          '<label class="vg-field"><span>Interesse <em>(opcional)</em></span>' +
            '<input name="interesse" type="text" placeholder="Ex.: tabela, visita, 2 quartos…" /></label>' +
          '<p class="vg-modal__err" id="vg-lead-err" hidden></p>' +
          '<button type="submit" class="vg-modal__submit">Continuar no WhatsApp</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);

    wrap.querySelector("#vg-lead-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var form = ev.target;
      var nome = (form.querySelector('[name="nome"]').value || "").trim();
      var telefone = (form.querySelector('[name="telefone"]').value || "").trim();
      var interesse = (form.querySelector('[name="interesse"]').value || "").trim();
      var err = document.getElementById("vg-lead-err");
      if (!nome || nome.length < 2) {
        err.hidden = false;
        err.textContent = "Informe seu nome.";
        return;
      }
      if (!validPhone(telefone)) {
        err.hidden = false;
        err.textContent = "Informe um WhatsApp/telefone válido (DDD + número).";
        return;
      }
      err.hidden = true;
      completeLeadGate({
        nome: nome,
        telefone: telefone,
        interesse: interesse,
        source: (modalState.opts && modalState.opts.source) || "modal"
      });
    });

    // Sem skip: backdrop não fecha; Escape não fecha.
    return wrap;
  }

  function openModal(baseMsg, opts) {
    modalState.pendingMsg = baseMsg || "";
    modalState.opts = opts || {};
    modalState.open = true;
    var el = ensureModal();
    var form = el.querySelector("#vg-lead-form");
    var stored = readStoredLead();
    if (stored) {
      if (stored.nome) form.querySelector('[name="nome"]').value = stored.nome;
      if (stored.telefone) form.querySelector('[name="telefone"]').value = stored.telefone;
      if (stored.interesse) form.querySelector('[name="interesse"]').value = stored.interesse;
    }
    document.getElementById("vg-lead-err").hidden = true;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("vg-modal-open");
    setTimeout(function () {
      var first = form.querySelector('[name="nome"]');
      if (first) first.focus();
    }, 50);
  }

  function closeModal() {
    var el = document.getElementById("vg-lead-modal");
    if (!el) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("vg-modal-open");
    modalState.open = false;
  }

  function composeMsgWithLead(baseMsg, lead) {
    var msg = baseMsg || "Olá Vitor, vi o anúncio e quero mais informações.";
    // Evita duplicar se a msg já veio do formulário data-lead-form
    if (lead && lead.nome && msg.indexOf(lead.nome) === -1) {
      msg = msg.replace(/^(Olá Vitor!?)/i, "$1 Me chamo " + lead.nome + ".");
    }
    if (lead && lead.telefone && msg.indexOf(lead.telefone) === -1) {
      msg += " Meu WhatsApp: " + lead.telefone + ".";
    }
    if (lead && lead.interesse && msg.indexOf(lead.interesse) === -1) {
      msg += " Interesse: " + lead.interesse + ".";
    }
    if (msg.indexOf("\nref:") === -1) msg += waRef();
    return msg;
  }

  function completeLeadGate(lead) {
    var opts = modalState.opts || {};
    var baseMsg = modalState.pendingMsg || opts.msg || "";
    var msg = composeMsgWithLead(baseMsg, lead);
    var url = buildWaUrl(msg);

    // Ordem obrigatória: validar (já feito) → salvar (local+POST/queue)
    // → conversão Ads → dataLayer → SÓ ENTÃO abrir WA.
    // Se POST falhar, fila localStorage + retry; conversão e WA seguem.
    persistLead(lead);

    fireGadsWa(function () {
      try {
        vgTrack("Lead", {
          method: "modal",
          source: lead.source || "modal",
          page: location.pathname,
          emp: lead.emp || ""
        });
      } catch (e) {}
      try {
        window.dataLayer.push({
          event: "vg_lead_modal",
          nome: lead.nome,
          telefone: lead.telefone,
          interesse: lead.interesse || "",
          page: location.pathname,
          source: lead.source || "modal"
        });
      } catch (e) {}
      closeModal();
      openWaUrl(url, opts);
    });
  }

  /**
   * Porta de entrada única: qualquer abertura de WhatsApp passa pelo modal
   * (ou usa lead já coletado no form data-lead-form via opts.lead).
   */
  function gateWhatsApp(baseMsg, opts) {
    opts = opts || {};
    if (opts.lead && opts.lead.nome && validPhone(opts.lead.telefone || opts.lead.whats || opts.lead.phone)) {
      modalState.pendingMsg = baseMsg || "";
      modalState.opts = opts;
      completeLeadGate({
        nome: String(opts.lead.nome).trim(),
        telefone: String(opts.lead.telefone || opts.lead.whats || opts.lead.phone).trim(),
        interesse: String(opts.lead.interesse || "").trim(),
        source: opts.source || "form",
        emp: opts.lead.emp || opts.emp || ""
      });
      return;
    }
    openModal(baseMsg, opts);
  }
  window.__vgGateWa = gateWhatsApp;
  window.__vgOpenWa = gateWhatsApp;

  // ---- Topbar ----
  var topbar = document.querySelector(".topbar");
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- Reveal ----
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" })
    : null;
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("in");
  });

  // ---- WhatsApp links [data-wa] → modal gate ----
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var rawMsg = el.getAttribute("data-wa-msg") || "Olá Vitor, vi o anúncio e quero mais informações.";
    // href seguro (sem abrir WA direto); modal cuida do open
    if (el.tagName === "A") {
      el.setAttribute("href", "#falar-whatsapp");
      el.setAttribute("role", "button");
    }
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      var liveMsg = el.getAttribute("data-wa-msg") || rawMsg;
      gateWhatsApp(liveMsg, { source: "data-wa", redirect: false });
    });
  });

  // ---- Lightbox ----
  var lb = document.querySelector(".lb");
  if (lb) {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll(".gallery .shot[data-full]").forEach(function (shot) {
      shot.addEventListener("click", function () {
        lbImg.src = shot.getAttribute("data-full");
        lb.classList.add("open");
      });
    });
    lb.addEventListener("click", function () { lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("open")) lb.classList.remove("open");
    });
  }

  // ---- Simulador simples (legado data-sim) ----
  var sim = document.querySelector("[data-sim]");
  if (sim) {
    var fmt = function (n) {
      return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
    };
    var inRenda = sim.querySelector("#renda");
    var inTipo  = sim.querySelector("#tipo");
    var outImovel = sim.querySelector("#out-imovel");
    var outParcela = sim.querySelector("#out-parcela");
    var outRendaMin = sim.querySelector("#out-rendamin");
    var waBtn = sim.querySelector("#sim-wa");
    var parseMoney = function (v) { return parseFloat(String(v).replace(/[^\d]/g, "")) || 0; };

    var calc = function () {
      var renda = parseMoney(inRenda.value);
      var taxaParcela = 0.011;
      var comprometimento = 0.30;
      var parcelaMax = renda * comprometimento;
      var valorFinanciado = parcelaMax / taxaParcela;
      var valorImovel = valorFinanciado;

      if (!renda) {
        outImovel.textContent = "R$ —";
        outParcela.textContent = "—";
        outRendaMin.textContent = "—";
        return;
      }
      outImovel.textContent = fmt(valorImovel);
      outParcela.textContent = fmt(parcelaMax);
      outRendaMin.textContent = fmt(renda);

      if (waBtn) {
        var msg = "Olá Vitor! Fiz a simulação no site. Minha renda é " + fmt(renda) +
          " e apareceu que consigo financiar cerca de " + fmt(valorImovel) +
          " (parcela ~" + fmt(parcelaMax) + "). Quero ver as opções disponíveis.";
        waBtn.setAttribute("data-wa-msg", msg);
        waBtn.setAttribute("data-wa", "");
        waBtn.setAttribute("href", "#falar-whatsapp");
      }
    };

    if (inRenda) {
      inRenda.addEventListener("input", function () {
        var v = parseMoney(inRenda.value);
        inRenda.value = v ? v.toLocaleString("pt-BR") : "";
        calc();
      });
    }
    if (inTipo) inTipo.addEventListener("change", calc);
    if (inRenda) calc();
  }

  // ---- Ano no footer ----
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // ---- Página /whatsapp/: se body[data-vg-wa-redirect], gate + redirect ----
  if (document.body && document.body.hasAttribute("data-vg-wa-redirect")) {
    var cfgMsg = document.body.getAttribute("data-vg-wa-msg") ||
      "Olá Vitor! Vim pelo anúncio e quero falar com você.";
    // Cancela auto-redirect legado se presente
    gateWhatsApp(cfgMsg, { source: "whatsapp-redirect", redirect: true });
  }
})();

/* --- Formulário data-lead-form → salva lead + conversão Ads + WA --- */
(function () {
  "use strict";
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var emp = form.getAttribute("data-lead-emp") || "o empreendimento";
      var nome = ((form.querySelector('[name="nome"]') || {}).value || "").trim();
      var interesse = ((form.querySelector('[name="interesse"]') || {}).value || "").trim();
      var whats = ((form.querySelector('[name="whats"]') || {}).value ||
        (form.querySelector('[name="telefone"]') || {}).value || "").trim();

      if (!nome || nome.length < 2) {
        alert("Informe seu nome.");
        return;
      }
      if (!whats || String(whats).replace(/\D/g, "").length < 10) {
        alert("Informe um WhatsApp/telefone válido.");
        return;
      }

      var msg = "Olá Vitor! Me chamo " + nome + ". " +
        "Vi a página do " + emp + " e quero " + (interesse ? interesse : "a tabela, as plantas e as condições") + "." +
        " Meu WhatsApp: " + whats + ".";

      if (window.__vgGateWa) {
        window.__vgGateWa(msg, {
          source: "lead-form",
          emp: emp,
          lead: { nome: nome, telefone: whats, interesse: interesse, emp: emp }
        });
      }
    });
  });
})();
