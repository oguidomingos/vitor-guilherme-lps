# Auditoria do fluxo de leads: Vitor Guilherme (Versat e Eleva 25)

Data: 20/10/2026, 17:20 a 17:25 UTC. Tudo foi verificado ao vivo (navegador real, logs, Evolution, Meta). Nada foi corrigido nem alterado em produção.

## 1. Diagrama do fluxo (como está hoje)

```
Anúncio Meta (campanha "[VG] Eleva 25 + Versat — Leads LP — out/26", objetivo OUTCOME_LEADS, ativa)
   │
   ▼
LP pública  https://vitorguilhermeimoveis.com.br/versat/  e  /eleva-25/    (Hostinger; fonte: src/*.html + assets/lp.js)
   │  form[data-capture] (2 por página: captura-1 e captura-2) → assets/lp.js
   │  POST text/plain (sendBeacon/fetch keepalive + fila localStorage) → https://leads.expoente.marketing/vg-lead
   ▼
nginx leads.expoente.marketing (/etc/nginx/sites-enabled/leads.expoente.marketing) → 127.0.0.1:3021
   ▼
pm2 "vg-lead-logger" (id 38)  /root/projects/vitor-guilherme/lead-logger/server.js  (igual a infra/vg-lead-logger-server.js)
   ├─► leads.jsonl  (tipo "lead")                 ← registro de verdade
   ├─► clicks.jsonl (tipo "pageview" / "wa_click")
   ├─► Auto-resposta WhatsApp: Evolution 127.0.0.1:8080, instância "vitor-guilherme" (número do Vitor, 556191223005) → número do lead
   │      (pulada se nome começa com "teste" ou ?vg_test=1)
   └─► thumdra-sync: cron 0 */6 * * * → CSV em thumdra-sync/out/ (SEM push: THUMDRA_TOKEN ausente → importação manual)
Rastreamento no navegador: GTM-543P3VS8 → Pixel Meta 1376646820713079 + Google Ads AW-18410246781 (conversão WhatsApp/lead)
```

Não existe: planilha, n8n, DeskComm, e-mail. O destino final dos leads é o `leads.jsonl` + WhatsApp do Vitor (auto-resposta) + CSV para importação manual no Thumdra.

## 2. Status por etapa

| # | Etapa | Status | Evidência |
|---|---|---|---|
| 1 | LP Versat no ar | OK | `curl` 200 em 0,31 s; HTML idêntico a `versat/index.html` (diff vazio) |
| 2 | LP Eleva 25 no ar | OK | 200 em 0,28 s; idêntico a `eleva-25/index.html` |
| 3 | Versão reconstruída hoje, sem modal na entrada | OK | 2 `form[data-capture]` no meio e no fim; nenhum modal/dialog no DOM; barra `.mbar` presente |
| 4 | Endpoint `leads.expoente.marketing` | OK | `/health` 200; pm2 online (15 h, 0 restarts); porta 3021 escutando |
| 5 | Envio do formulário → `leads.jsonl` | OK | 17:21:45.824Z (Versat) e 17:22:01.090Z (Eleva): 24 ms a 90 ms após o clique (SUBMIT 17:21:45.658 / 17:22:01.044); fila do navegador esvaziada (`[]`) |
| 6 | UTMs/fbclid no destino | OK | `utm_source=meta, utm_medium=paid, utm_campaign=auditoria_jarvis, utm_content=<emp>, fbclid=AUDITJARVIS_<emp>`, seção `captura-1`, interesse e telefone gravados |
| 7 | Tela de confirmação | OK | `relatorio/auditoria/versat-2-confirmacao.png`, `eleva-2-confirmacao.png` ("Combinado, TESTE. Recebi seu pedido…") |
| 8 | Auto-resposta WhatsApp (código + Evolution) | OK, com ressalva | ver seção 4 |
| 9 | Pixel Meta | PARCIAL / QUEBRADO para Lead | carrega e dispara, mas só eventos **custom** (seção 5) |
| 10 | Google Ads/GTM | OK | `googleadservices.com/pagead/conversion/18410246781` disparou no envio do form; dataLayer: `vg_lead_form`, `gtm.formSubmit` |
| 11 | Destino CRM (Thumdra) | QUEBRADO (manual) | `THUMDRA_TOKEN ausente — pulando push`; só CSV a cada 6 h (último: 20/10 12:00, 6 pendentes, `last_push: null`) |
| 12 | Leads reais recentes | ZERADO desde 15/10 | seção 6 |

## 3. Teste ao vivo (browser-harness, Chrome real, desktop 1280x900)

Leads de teste: `TESTE JARVIS 17:21`, telefone 61936180578 (o do próprio Guilherme), com `?vg_test=1` para não sujar o relatório do Vitor. Screenshots em `relatorio/auditoria/`:
- `versat-1-formulario-preenchido.png`, `versat-2-confirmacao.png`
- `eleva-1-formulario-preenchido.png`, `eleva-2-confirmacao.png`

Achado de UX no 1º teste (viewport pequeno, 778x437): a barra fixa de WhatsApp do mobile (`.mbar`) ficou **por cima do botão "Quero a tabela"** do formulário. O clique caiu na barra (abre `wa.me`) e o lead não foi enviado. Em 1280x900 funciona. Em celular real a barra cobre o rodapé da tela; se o formulário ficar na parte de baixo da tela, o botão de enviar fica escondido atrás dela. Precisa de teste em celular real.

## 4. WhatsApp: chegou? Em quanto tempo?

- Leads de teste **não disparam** auto-resposta por design (`isTest`: `?vg_test=1` ou nome começando por "teste"). Os dois leads do passo 3 ficaram sem mensagem (log: `lead de TESTE: sem auto-reply/sync`).
- Para provar o trecho final sem enviar nada do número do Vitor, subi uma **cópia temporária** do mesmo `server.js` (porta 3099, logs em /tmp, instância `guilherme-domingos`, já derrubada) e mandei um lead sem prefixo "teste" com o telefone do Guilherme.
  - Envio 17:23:40.244 UTC → resposta do servidor em 0,12 s → `auto-reply OK http=201 msgId=3EB027C05B3FE8515BE938`.
  - Mensagem confirmada na conversa do Guilherme consigo mesmo (instância guilherme-domingos) às 17:23: "Olá, Jarvis Auditoria! Estou retornando o seu contato sobre o Versat Home Resort…" Tempo envio → chegada: **menos de 1 minuto** (a API respondeu em 0,12 s; o banco de mensagens só marca minuto).
- Limite honesto: o caminho de produção usa a instância `vitor-guilherme`, que não usei. Prova indireta de que ela funciona: leads reais de 14/10 (Suellen) e 15/10 (Ruth) receberam a mensagem no horário do envio do lead (00:24 e 16:43); instância `vitor-guilherme` está `open`.
- Fragilidades do código: a dedupe é só em memória (reinício do pm2 zera) e não há alerta se o envio falhar (só log).

## 5. Rastreamento

- Pixel Meta `1376646820713079` carrega via GTM. Eventos capturados no envio do formulário (todos via `trackSingleCustom`): `conversion`, `vg_lead_form`, `form_start`, `form_submit`. **Nenhum `Lead` padrão.**
- Regressão: a LP antiga (`assets/app.js:390`) fazia `fbq("track","Lead")`; o novo `assets/lp.js` não. O GTM só converte `generate_lead` em `Lead`, e o `lp.js` nunca envia `generate_lead`. A campanha é de objetivo Leads: sem `Lead` padrão, o algoritmo não otimiza pelo evento certo. Os 2 leads do pixel (7 dias, R$ 45,75 cada) são de 14 e 15/10, antes do rebuild.
- UTMs: chegam ao destino (seção 3). `fbc`/`fbp` não são enviados ao logger (sem como cruzar com a API de Conversões).
- Clique no WhatsApp: dispara a conversão Google Ads `AW-18410246781/wWJDCJ32-PUcEP2k2MpE`; o envio do form também dispara essa conversão de WhatsApp (mistura "falou no WhatsApp" com "deixou lead").

## 6. Leads reais: estão caindo?

- Último lead real: **15/10 16:43** (Ruth Rodrigues, Meta, Versat). Antes: Suellen (14/10). Total real em `leads.jsonl`: 4 anteriores (23/09 a 05/10, LPs antigas) + 2 de Meta. **Zero real desde 15/10.**
- Logger **fora do ar de 15/10 a 20/10** (502; README documenta; reiniciado em 20/10, 15 h atrás). Leads dessa janela podem ter sido perdidos; a fila do navegador só reenvia se a pessoa voltar ao site. O Meta mostra 68 visualizações de página e 2 leads em 13–19/10: 66 visitas sem registro conclusivo.
- Desde o reinício: `clicks.jsonl` tem 1 pageview real (20/10 16:09, utm meta, IP externo) e nenhum clique de WhatsApp ou lead real. Os demais ~154 registros são testes nossos. Ou seja, **hoje quase não chega tráfego** à LP ou não registra.
- Meta (conta VITOR GUILHERME, só leitura, 13–19/10): R$ 91,49 gastos, 3.085 impressões, 137 cliques, 95 cliques no link, 68 views de página, 2 leads, CPL R$ 45,75. Campanha ativa, objetivo OUTCOME_LEADS (não bate com a nota de "objetivo errado, R$ 97 e 0 leads": conferir se o objetivo mudou ou se falam de outra campanha). Segmentação (Lago Sul caindo como Itapoã) não foi verificada nesta tarefa.

## 7. Correções priorizadas (nenhuma aplicada)

1. **Pixel: enviar `Lead` padrão no envio do formulário.** Em `assets/lp.js`, dentro do submit, `dataLayer.push({event:"generate_lead", emp: EMP})` (o GTM já mapeia para `Lead`) ou `fbq("track","Lead")`. Trivial e reversível. Sem isso a campanha não otimiza por lead. Reaplicar e publicar `versat/index.html` e `eleva-25/index.html` não é preciso: é só `assets/lp.js`.
2. **Barra fixa do mobile cobrindo o botão de enviar.** Adicionar `padding-bottom` ao bloco do formulário ou esconder `.mbar` quando a captura está visível (IntersectionObserver, como já é feito para o hero). Testar em celular real.
3. **Alerta de queda do logger.** O endpoint ficou 5 dias fora e ninguém viu. Monitor externo no `/health` (cron + aviso no WhatsApp do Guilherme). Hoje o pm2 está `online`, mas sem checagem.
4. **Thumdra:** preencher `THUMDRA_TOKEN` ou aceitar o CSV manual; hoje nenhum lead entra no CRM sozinho.
5. **Reverter a mistura de conversões:** o envio do form não deveria disparar a conversão de WhatsApp do Google Ads (`fireGadsWa()` em `lp.js` no submit); criar conversão própria de lead.
6. **Guardar `_fbp`/`_fbc` no lead** (API de Conversões) e persistir a dedupe da auto-resposta em arquivo.
7. **Meta (só registrar):** campanha com 2.080 de alcance em 7 dias e 1 pageview real hoje: conferir entrega/orçamento, objetivo e segmentação.
