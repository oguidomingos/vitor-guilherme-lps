/* Vitor Guilherme LPs — comportamento compartilhado
   - Topbar scroll state
   - Scroll reveal
   - Lightbox de galeria
   - Montagem de link WhatsApp (data-wa em qualquer <a>/<button>)
   - Simulador de financiamento (opcional, só na LP simulador)
*/
(function () {
  "use strict";

  // ---- Config do corretor (ajuste aqui) ----
  var VITOR_WA = "5561985090580"; // (61) 98509-0580

  // ============================================================
  // TRACKING — Meta Pixel + Google Tag Manager (preencha os IDs)
  // Este arquivo é incluído em TODAS as LPs, então basta configurar
  // aqui uma vez e republicar para valer no site inteiro.
  // Deixe "" para manter desativado (nada dispara enquanto vazio).
  // ============================================================
  var TRACK = {
    PIXEL_ID: "",              // Pixel entra pelas tags do GTM (deixar vazio evita disparo em dobro)
    GTM_ID:   "GTM-543P3VS8", // container do Google Tag Manager (Vitor Guilherme)
    GADS_ID:  "AW-18410246781",                    // Google Ads account
    GADS_WA:  "AW-18410246781/wWJDCJ32-PUcEP2k2MpE" // conversão "Nova conversa no WhatsApp"
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Google Tag Manager (GTM carrega o GA4 e demais tags; load primeiro)
  if (TRACK.GTM_ID) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", TRACK.GTM_ID);
  }

  // Google Ads global site tag (carrega junto ao GTM; configura o remarketing/conversão)
  if (TRACK.GADS_ID) {
    var gadsScript = document.createElement("script");
    gadsScript.async = true;
    gadsScript.src = "https://www.googletagmanager.com/gtag/js?id=" + TRACK.GADS_ID;
    document.head.appendChild(gadsScript);
    gtag("js", new Date());
    gtag("config", TRACK.GADS_ID);
  }

  // Meta Pixel (só carrega se PIXEL_ID configurado)
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

  // Dispara um evento no Pixel e no dataLayer (GTM) de uma vez.
  function vgTrack(evt, params) {
    params = params || {};
    try { if (TRACK.PIXEL_ID && window.fbq) fbq("track", evt, params); } catch (e) {}
    try { window.dataLayer.push(Object.assign({ event: "vg_" + String(evt).toLowerCase() }, params)); } catch (e) {}
  }
  window.__vgTrack = vgTrack;

  // ---- Rastreio de origem (UTM → ref na mensagem do WhatsApp) ----
  // O clique pago chega com utm_source/campaign/content na URL. Guardamos na sessão
  // e anexamos um código curto ("ref") a TODA mensagem de WhatsApp gerada na página.
  // O ref identifica canal+campanha+criativo do primeiro clique → nenhum lead órfão.
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
  window.__vgWaRef = waRef; // usado também pelo bloco do formulário (IIFE v2)

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

  // ---- WhatsApp links ----
  // Qualquer elemento com [data-wa] vira link do WhatsApp; a mensagem vem de [data-wa-msg].
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var msg = (el.getAttribute("data-wa-msg") || "Olá Vitor, vi o anúncio e quero mais informações.") + waRef();
    var href = "https://wa.me/" + VITOR_WA + "?text=" + encodeURIComponent(msg);
    if (el.tagName === "A") { el.setAttribute("href", href); el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); }
    else { el.addEventListener("click", function () { window.open(href, "_blank", "noopener"); }); }
    // conversão: clique no WhatsApp = Contact (Pixel/GTM) + Google Ads conversion
    el.addEventListener("click", function () {
      vgTrack("Contact", { method: "whatsapp", page: location.pathname });
      try {
        if (TRACK.GADS_WA && window.gtag) {
          gtag("event", "conversion", { send_to: TRACK.GADS_WA });
        }
      } catch (e) {}
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
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  // ---- Simulador de financiamento ----
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
      // Regras (insumo do próprio Vitor): comprometimento máx 30% da renda;
      // 1ª prestação ≈ 1,1% do valor financiado (média 0,8–1,2%).
      var taxaParcela = 0.011;
      var comprometimento = 0.30;
      var parcelaMax = renda * comprometimento;
      var valorFinanciado = parcelaMax / taxaParcela;
      // Linha econômica = 100% financiado → valor do imóvel ≈ valor financiado.
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
          " (parcela ~" + fmt(parcelaMax) + "). Quero ver as opções disponíveis." + waRef();
        waBtn.setAttribute("data-wa-msg", msg);
        waBtn.setAttribute("href", "https://wa.me/" + VITOR_WA + "?text=" + encodeURIComponent(msg));
        waBtn.setAttribute("target", "_blank");
        waBtn.setAttribute("rel", "noopener");
      }
    };

    inRenda.addEventListener("input", function () {
      var v = parseMoney(inRenda.value);
      inRenda.value = v ? v.toLocaleString("pt-BR") : "";
      calc();
    });
    if (inTipo) inTipo.addEventListener("change", calc);
    calc();
  }

  // ---- Ano no footer ----
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();

/* --- v2 (ago/2026): formulário de interesse → abre WhatsApp com mensagem pronta ---
   <form data-lead-form data-lead-emp="ELEVA 25"> com campos name="nome", name="whats" (opcional), name="interesse" (select/ input).
   Não depende de backend: monta a mensagem e abre o wa.me do Vitor. */
(function () {
  "use strict";
  var VITOR_WA = "5561985090580";
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var emp = form.getAttribute("data-lead-emp") || "o empreendimento";
      var nome = (form.querySelector('[name="nome"]') || {}).value || "";
      var interesse = (form.querySelector('[name="interesse"]') || {}).value || "";
      var whats = (form.querySelector('[name="whats"]') || {}).value || "";
      var msg = "Olá Vitor! " + (nome ? "Me chamo " + nome.trim() + ". " : "") +
        "Vi a página do " + emp + " e quero " + (interesse ? interesse : "a tabela, as plantas e as condições") + "." +
        (whats ? " Meu WhatsApp: " + whats.trim() + "." : "") +
        (window.__vgWaRef ? window.__vgWaRef() : "");
      if (window.__vgTrack) window.__vgTrack("Lead", { form: emp, page: location.pathname });
      window.open("https://wa.me/" + VITOR_WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  });
})();
