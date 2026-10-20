# Feedback BRM — checklist auditado (Versat e Eleva 25)

Auditoria: 20/10/2026, sobre o código atual (`HEAD` = 5d70adb).
Fonte única: `/root/projects/transcricao-vitor-fabiane-15out.md`. É um áudio do
Vitor (15/10, 19h02) relatando a conversa com o gestor de tráfego da BRM. Não existe
documento do cliente. A transcrição é automática (Groq), sem revisão humana.

**Contagem honesta:** o áudio traz 5 pedidos distintos sobre as LPs e os criativos
(copy do Versat, informações principais + fotos, fotos do Eleva, CTA de tabela +
consultor, criativos com fluxo de pagamento). A seção 4 da transcrição os desdobra
em 12 itens acionáveis (1–12). O item 13 dela é infraestrutura (zap-bridge) e está
fora do escopo.

Legenda: FEITO · PARCIAL · NÃO FEITO · BLOQUEADO (depende do Guilherme/Vitor).

## Checklist

| Nº | Palavras do áudio / tarefa | Versat | Eleva 25 |
| --- | --- | --- | --- |
| 1 | "ao invés de falar poucos minutos do plano piloto colocar resort Águas Claras" | **FEITO** — `versat/index.html:43` `<h1>Seu resort em Águas Claras.</h1>`. "Plano Piloto" só resta em texto corrido de localização (linhas 74, 207, 210: acesso pela EPTG), fora da primeira dobra. | n/a (pedido só do Versat). Eleva mantém "Uma skypool no 11º andar." (`eleva-25/index.html:37`). |
| 2 | "deixa as informações principais" / "a gente tem que simplificar ali" | **FEITO** — hero com título, 1 linha de apoio, 2 dados (metragem, preço "a partir de") e 1 CTA (`versat/index.html:41-60`). Entrega, tipologia e incorporadoras saíram do hero e seguem na ficha (seção 2). | **FEITO** — mesma estrutura (`eleva-25/index.html:34-55`). |
| 3 | "e já colocar fotos" (primeira dobra) | **FEITO** — `<figure class="hero-photo">` com `img/g1.jpg`, `fetchpriority="high"` (`versat/index.html:58`); lado a lado no desktop, abaixo do texto no celular (`assets/brm-lps.css`). | **FEITO** — `img/d0-hero.jpg` (decorado), mesmo bloco (`eleva-25/index.html:51`). Otimizada nesta sessão (ver abaixo). |
| 4 | "também tá com as fotos do eleva" | n/a | **FEITO** — foto do decorado do Eleva na primeira dobra. Galeria com `d0`–`d7` e renders segue mais abaixo. |
| 5 | "quero receber tabela, conversar com o corretor/consultor" | **FEITO** — botão do hero e CTA final: "Receber tabela e falar com corretor"; botão e primeira opção do formulário idem; mensagem do WhatsApp pré-preenchida pede tabela + conversa (`versat/index.html:52-55, 252-262`). | **FEITO** — mesmos pontos (`eleva-25/index.html`). |
| 6 | Pós-formulário: entregar a tabela e acionar o corretor | **BLOQUEADO** — o formulário abre o WhatsApp do Vitor com a mensagem pronta; é solicitação, não entrega. Não há tabela oficial no repositório nem envio automático. | **BLOQUEADO** — idem. |
| 7 | "fazer criativos já com fluxo de pagamento. Sinal de tanto, mensais de tanto, tantas mensais e mais semestrais" | **BLOQUEADO** — falta o fluxo contratual (sinal, nº e valor das mensais e semestrais, saldo, correção). A LP tem a seção `#pagamento` ("Preço e pagamento, com clareza", linha 187) dizendo que o detalhamento é por proposta, com botão "Solicitar proposta de pagamento". Fluxos antigos inventados foram removidos em 19/10. Criativos não existem no repositório. | **BLOQUEADO** — idem (`eleva-25/index.html:169`). |
| 8 | "vou passar pra ele todos os criativos" (para a análise da BRM) | **NÃO FEITO** — ação fora do código; faltam os arquivos/lista dos criativos e autorização de envio. Nada foi enviado. | idem |
| 9 | "para dar resultado… seria dois meses" | **NÃO FEITO** — alinhamento de expectativa entre pessoas; não é copy de LP. | idem |
| 10 | Valor investido (R$ 1.500 na transcrição; "500" em outra) | **FEITO (registro)** — Guilherme confirmou ≈ R$ 1.000 em 19/10 (ver `PRECOS-FONTES.md`). Não vai nas LPs. O áudio traz R$ 1.500; o número ainda diverge. | idem |
| 11 | "tem mais alguma coisa que eu não tô lembrando" | **NÃO FEITO** — depende de perguntar ao Vitor. | idem |
| 12 | Dono e data da revisão das LPs | **NÃO FEITO** — sem responsável nem data definidos. | idem |

Resumo: **5 FEITOS no ar** (1–5; item 1 só no Versat e item 4 só no Eleva), 1 registro feito (10),
**2 BLOQUEADOS por dado comercial** (6, 7), **4 NÃO FEITOS por serem ações de gestão** (8, 9, 11, 12).

## O que foi verificado no código (não só na mensagem de commit)

- `59d20c3` entregou: headline do Versat, foto no hero, CTA "Receber tabela e falar
  com corretor", opção do formulário, hero simplificado. Todos confirmados nas linhas acima.
- A mensagem de `59d20c3` fala em "fluxo de pagamento com sinal/parcelas". **Isso não
  está no código.** `eaac045` removeu os fluxos antigos (12 mensais no Eleva; 36 mensais
  + 5 semestrais no Versat) por falta de fonte e os trocou por `#pagamento`, que só
  explica e pede proposta. Fluxo com sinal e parcelas: **não existe nas LPs**.
- Preços do hero ("a partir de") vêm de fontes públicas de 19/10 (`PRECOS-FONTES.md`),
  sem validação comercial da BRM.

## Aplicado nesta sessão

- **Eleva, primeira dobra:** a foto do hero era `d0.jpg` (1920×2560, 677 KB) em
  `fetchpriority="high"`, ou seja, o maior arquivo da primeira dobra para tráfego pago
  no celular. Criada `eleva-25/img/d0-hero.jpg` (1000×1333, 161 KB, −76%) só para o
  hero. A `d0.jpg` original segue na galeria e no cartão de planta. Sem mudança de
  copy, preço ou layout. Foco: velocidade da primeira dobra (gargalo: 66 visualizações → 2 leads).
- Documento renomeado de `FEEDBACK-BRM.md` para `feedback-brm.md` e reescrito.
- Nada mais foi alterado: o restante dos itens depende de dado ou decisão (abaixo).
  Nenhum número de preço, parcela, metragem ou prazo foi criado.

## Pendências que precisam do Guilherme

1. **Fluxo de pagamento real, por empreendimento** (itens 6 e 7): unidade/torre/andar,
   sinal/entrada contratual, FGTS admitido, nº e valor das mensais e semestrais,
   intermediárias, saldo nas chaves, correção, validade. Pedir à BRM/incorporadora.
   Com isso: criativos com fluxo e bloco de condições nas LPs.
2. **Tabela oficial atualizada** de Versat e Eleva (item 6), e decidir como é entregue
   (PDF no WhatsApp pelo Vitor? link?). Hoje a LP só abre a conversa.
3. **Confirmar o preço "a partir de" do Eleva** (R$ 709.796 na Terral x R$ 890.136 no Apto)
   e a oferta de R$ 178.027,20 de entrada (não publicada).
4. **Valor investido** (item 10): R$ 1.000 (confirmado 19/10), R$ 1.500 (áudio) ou 500.
5. **Criativos em veiculação** (item 8): lista/arquivos, destinatário na BRM e autorização
   para enviar. Nada foi enviado.
6. **Decisão de conversão, fora do feedback BRM:** todo CTA (`data-wa`) abre um modal
   obrigatório (nome + WhatsApp, sem "pular") antes do WhatsApp (`assets/app.js`,
   `openModal`). Com 66 visualizações → 2 leads, isso pode ser parte do gargalo. Mexer
   aí mexe em captura de lead e conversão do Ads, então não foi tocado. Decidir: manter,
   reduzir a um campo ou abrir o WhatsApp direto e capturar depois.
7. **Item 11 e 12:** perguntar ao Vitor o que faltou no áudio; definir dono e data da
   revisão comercial das LPs.
8. **Confirmar a transcrição** ouvindo o áudio: "Versace/versátil", "leva" e "peixe" são
   leituras prováveis, não certas.

## Validação

Projeto estático, sem build. Conferido por leitura do código e por tamanho/dimensão
do arquivo novo. Não foi refeito o teste visual em navegador nesta sessão; a troca
de `src` mantém `width/height` e `object-fit`, sem alterar o layout. Nenhum lead,
mensagem, publicação ou alteração em campanha de Meta Ads.
