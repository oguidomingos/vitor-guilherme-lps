# Benchmarking: páginas que vendem lançamento (20/10/2026)

## Método

- **Data:** 20/10/2026. **Ferramenta:** Google Chrome real (Playwright, headless), desktop 1280×800 e celular 390×844 com user-agent de iPhone. Para cada página: screenshot da primeira dobra (desktop e celular) e página inteira, mais extração automática de títulos (h1–h3 em ordem), botões e links de WhatsApp (e se são fixos na tela), formulários visíveis (nº de campos, posição), vídeos/iframes, altura da página e texto. Dados brutos: `benchmarking/raw.json` (13 páginas DF) e o lote completo de 45 páginas consolidado nesta análise. Screenshots: `benchmarking/shots/<slug>-{desktop,mobile}-fold.jpg` e `-desktop-full.jpg`.
- **Buscas feitas:** "lançamento Águas Claras corretor tabela", "Eleva 25 corretor", "Eleva 25 Águas Claras", "Versat Home Resort Águas Claras", "lançamento Noroeste corretor", "Identidade Comfort Home Águas Claras", "Viva Águas Claras resort", "lançamento Setor Marista / Jardim Goiás corretor", "lançamento Balneário Camboriú tabela corretor", "pré-lançamento Lourdes BH", "lançamento Cambuí Campinas corretor", "lançamento alto padrão Ribeirão Preto", "lançamento Curitiba Vanguard", "lançamento Barra da Tijuca book tabela".
- **Critério A × B.** **A = vitrine** (site de incorporadora ou hotsite oficial: fala do produto, não vende). **B = página de corretor/imobiliária focada em fechar a venda de UM lançamento.** Dentro de B, separei **B-forte** (página dedicada, CTA com contrapartida explícita) de **B-fraco** (ficha de portal genérica: "imóveis similares", formulário de contato padrão).
- **Abertas:** 45 URLs; **37 com conteúdo**. 8 não renderizaram: `construtoravillela.com.br/versat`, `dfimoveis.com.br`, `seuimovelgoiania.com.br`, `larimoveis.com.br` (bloqueio Cloudflare), `brhouseimoveis` e `pilotis` (404 na página do Versat), `eleva25sul.com`, `momentnoroeste.com.br` (sem resposta).
- **Limite honesto:** nenhuma página publica taxa de conversão. "Converte" aqui = página dedicada de corretor, com CTA de contrapartida, mantida no ar para um lançamento e alinhada ao que os anúncios de maior longevidade fazem (ver `BRIEFING-CLONE-FUNIL` no Drive: Versat e Terral anunciam com **formulário + contrapartida**, há semanas no ar). Em Águas Claras achei poucas páginas B-forte (2: Imóveis Pronto DF e Kandango); por isso ampliei para BC, Rio, Goiânia, BH, Curitiba e Campinas/Ribeirão.

## Referências

Altura em px (desktop / celular). "WA fixo" = botão de WhatsApp que acompanha a rolagem. "Campos" = campos do primeiro formulário visível e posição (y) em que ele aparece no desktop.

| Slug (screenshot) | Cidade | Tipo | Promessa do hero (literal) | Contrapartida pedida no CTA | Campos (y) | WA fixo | Vídeo | Preço | Altura |
|---|---|---|---|---|---|---|---|---|---|
| `imoveisprontodf-identidade` | Águas Claras/DF | **B-forte** | "Identidade Comfort Home · Lançamento em Águas Claras · entrega Jun/2027 · Garanta a melhor unidade — atendimento personalizado" | "Simular condições", "Falar no WhatsApp · resposta em minutos" | sem form | sim + barra fixa | não | não | 10.935 / 13.304 |
| `kandango-identidade` | Águas Claras/DF | B-forte | "Identidade Comfort Home" | "Fale com Max pelo WhatsApp" | sem form | sim | 1 | não | 10.966 / 5.696 |
| `alvobr-next` | Balneário Camboriú | **B-forte** | "Next Barra Norte em Balneário Camboriú · a partir de R$ 2.903.626 · em obra" | **"Pedir tabela e fluxo no WhatsApp"** (barra fixa no celular) | sem form | sim | não | **sim** | 4.408 / 6.667 |
| `lancbalneario-next` | Balneário Camboriú | B-forte | "Next Barra Norte — Balneário Camboriú · suítes · área · vagas · entrega" | "Receba o material completo", "Agendar visita" | — | não | não | sim ("A construtora não divulga tabela pública… Consultamos os valores vigentes") | 5.426 / 8.518 |
| `kronos-barra` | Rio (Barra) | **B-forte** | "Kronos by Tegra · Um marco de arquitetura contemporânea…" | **"Receber book completo"**, "Solicitar tabela de preços e fluxo", "Solicitar planta" | **3** (228) | sim | não | sob consulta | 13.975 / 20.949 |
| `greenpark-rio` | Rio (Barra) | B-forte | "Green Park Barra · Apartamentos, Garden e Coberturas…" | "Receber book digital", "Receber tabela de preços" | 3 (fim) | sim | não | sob consulta | 15.370 / 21.638 |
| `imovelrio-extra` | Rio (Barra) | **B-forte** | "Lançamento Extra Barra Opportunity · **\* A partir R$ 990.000,00**" + barra "**Poucas unidades!**" | "Receber Book Completo" | **2** (317) | sim | 2 | **sim** | 17.189 / 24.800 |
| `meuapgoiania-bside` | Goiânia (Marista) | **B-forte** | "B.Side by City · Apartamento na planta · Entrega Mar 29" + chips "1 quarto 50 m² · 2 quartos 72 m² · 2 quartos 95 m²" | "Receber book", "**Simular plano de pagamento**", "Avise-me se o preço mudar", "Agende sua visita" | 1 (select) | sim | 1 (meio) | **"A partir de R$ 412 mil / 576 mil / 922 mil"** | 8.308 / 11.201 |
| `walklourdes` | BH (Lourdes) | A/B (hotsite de pré-lançamento) | "PRÉ-LANÇAMENTO · Para morar ou investir, seu próximo passo · Receba informações antecipadas" | "Baixe o book", "Fale com um consultor" | 6 (150) | sim | não | não | 5.773 / 6.451 |
| `markimoveis-eleva25` | Águas Claras/DF | B-fraco (ficha de portal) | "Residencial Eleva 25 - 2 e 3 Quartos Com Lazer Completo" + "R$ 580.083,20" | "Agendar visita" | 5 + reCAPTCHA (840) | sim | 2 | sim | 5.911 / 9.746 |
| `silvio-ilhadosol` | Águas Claras/DF | B-fraco | "Lançamento em Aguas Claras quadra 102 Ilha do Sol 3 quartos 90 m" | "Receber mais informações" | 1 (289) | sim | 5 | sim | 5.333 / 8.422 |
| `quadraimob-identidade` | Águas Claras/DF | B-fraco | "Identidade Comfort Home – Águas Claras · R$ 806.874,00" | "Enviar mensagem" | **6** (1.079) | sim | 1 | sim | 4.524 / 5.498 |
| `jurandyrleal-viva` | Águas Claras/DF | B-fraco (artigo de blog) | "Viva Águas Claras Residencial Resort: Sofisticação e Lazer de Resort" | "Falar pelo WhatsApp" | 4 (6.242) | não | não | não | 7.904 / 14.022 |
| `reservaparque-ac`, `-home` | Águas Claras/DF | B-fraco (blog/SEO) | "LANÇAMENTO TORRE 05 – RESERVA PARQUE CLUBE: Sua Oportunidade de Ouro…" | "Agendar visita" | — | não | não | não | 5.294 / 7.977 |
| `fbc-hox-campinas` | Campinas | B-fraco | "HOX CAMBUI – Apartamento no Cambuí" | "Agendar visita" | 4 (1.303) | sim | 2 | sim | 4.664 / 8.472 |
| `campinasnaplanta-hox` | Campinas | B-fraco | "Hox Cambuí | Breve Lançamento de Studios…" | "Contato" | 2/4 | não | não | não | 3.705 / 7.264 |
| `guilhermenunes-campinas` | Campinas | B (site do corretor) | "Corretor de Imóveis em Campinas: Lançamentos e Apartamentos na Planta · CRECI 315524-F" | "Falar no WhatsApp" | — | sim | não | sim | 7.828 / 14.325 |
| `pradogoncalves-sensia` | Campinas | B-fraco | "Sensia Taquaral" | "Quero saber" | 6 (747) | sim | não | sim | 4.071 / 6.389 |
| `selectpro-ribeirao` | Ribeirão Preto | B-fraco | "LANÇAMENTO DE ALTO PADRÃO 3 SUITES / 3 VAGAS / ILHAS DO SUL" | "Solicitar ligação", "Enviar por e-mail" | **6** (1.159) | não | 2 | sim | 3.802 / 4.309 |
| `porcaro-lourdes` | BH | B-fraco | "PRÉ-LANÇAMENTO NO BAIRRO LOURDES" | "WhatsApp", "Agendar visita" | — | sim | 2 | sim | 4.135 / 5.320 |
| `bergonse-hytte` | Curitiba | B-fraco | "Hytte Vanguard: Apartamento com 120 metros…" | "Simular financiamento" | — | sim | não | sim | 4.684 / 4.966 |
| `plaza-serenite-bc` | Balneário Camboriú | B-fraco | "Sérénité Balneário Camboriú | Lançamento" | "Agendar visita" | — | sim | 2 | não | 4.491 / 5.116 |
| `lancamentopraiabrava` | Itajaí | B (portal de lançamentos) | "Todos os lançamentos da Brava" | "Conversar no WhatsApp" | 4 | sim | 4 | sim | 5.512 / 8.693 |
| `massais-vivio`, `proato-singah`, `maisnovos-autentico`, `setorbueno-verdo` | Campinas / Goiânia | B-fraco | fichas e artigos | contato genérico | 1 a 6 | variável | variável | variável | 4.500 a 10.000 |
| `eleva25aguasclaras` | Águas Claras/DF | **A** (hotsite; "site oficial", titularidade não provada) | "LANÇAMENTO TERRAL · 3 QUARTOS · DF · ÁGUAS CLARAS · Em frente à estação de metrô…" | "Pedir tabela de valores", "Agendar visita" | sem form | sim | 3 (topo, sequência de quadros) | **não** | **16.443** / 15.529 |
| `eleva25-combr` | Águas Claras/DF | A | "Fitwell · Seu Refúgio Particular" | "Enviar" | 4 (7.684) | não | não | não | 17.312 / 21.489 |
| `terral-eleva25` | Águas Claras/DF | **A** (incorporadora) | "Eleva25" + "a partir de R$ 709.796" (sem unidade) | "Enviar formulário" | 4 | sim | 1 | sim, sem unidade | 4.111 / 5.545 |
| `versathomeresort` | Águas Claras/DF | **A** (hotsite oficial) | "Time is Life · QUEBRAMOS A BARREIRA DO ESPAÇO/TEMPO… · Cadastre-se agora e receba condições exclusivas" | "Enviar" | 4 (507) | não | não | não | 7.425 / 7.734 |
| `versataguasclarasresort` | Águas Claras/DF | A (hotsite) | "VERSAT HOME RESORT · 95,54 a 108 m² · 210 m² PENTHOUSE · RI R15-145019" | "Agendar visita", "Receber apresentação exclusiva" | sem form | sim | 2 | não | 10.061 / 12.462 |
| `vivaaguasclarasresort` | Águas Claras/DF | A (Faenge) | "UM RESORT PARA CHAMAR DE LAR 2, 3 E 4 QUARTOS E COBERTURAS" | "Agende sua visita aos decorados", "Baixe aqui o book completo" | 5 (10.402) | não | não | não | 13.351 / 14.624 |
| `identidadecomforthome` | Águas Claras/DF | A | "ÁGUAS CLARAS · COM AMPLOS APTOS de 67 a 88m²" | — (tour 360º) | — | não | não | não | 6.398 / 6.630 |
| `fbr-walk`, `paulooctavio-oceania` | BH / Águas Claras | A | "WALK LOURDES" / "OCEANIA RESIDENCE · PRONTO PARA MORAR" | "Baixe o book" / "Simule seu financiamento" | — / 6 | não | 2 | não | 6.255 / 8.495 |

## Os 7 padrões que se repetem nas páginas que vendem (B-forte)

### 1. O botão diz o que a pessoa ganha, e o ganho é a tabela (com o fluxo)
Nenhuma B-forte usa "Fale conosco" como CTA principal. O CTA nomeia a contrapartida: **"Pedir tabela e fluxo no WhatsApp"** (`alvobr-next`), **"Solicitar tabela de preços e fluxo"** e "Receber book completo" (`kronos-barra`), "Receber tabela de preços" (`greenpark-rio`), "Simular plano de pagamento" (`meuapgoiania-bside`), "Simular condições" (`imoveisprontodf-identidade`). As B-fracas usam "Enviar", "Contato", "Enviar mensagem" (`quadraimob`, `selectpro`, `markimoveis`). Os anúncios oficiais de Versat e Terral fazem o mesmo: "acesse as informações de preços e unidades".
Evidência: `shots/alvobr-next-mobile-fold.jpg`, `shots/kronos-barra-mobile-fold.jpg`, `shots/meuapgoiania-bside-mobile-fold.jpg`.

### 2. Corretor mostra preço; incorporadora esconde
As B-fortes põem um **"a partir de"** no topo: "a partir de R$ 2.903.626" (`alvobr-next`), "\* A partir R$ 990.000,00" (`imovelrio-extra`), "A partir de R$ 412 mil / 576 mil / 922 mil" por tipologia (`meuapgoiania-bside`). Quando não há tabela pública, dizem isso e oferecem a tabela: "A construtora não divulga tabela pública… Consultamos os valores vigentes" (`lancbalneario-next`). Nenhum dos 9 sites tipo A traz preço com unidade (Terral mostra "a partir de R$ 709.796" sem dizer de quê). **É a principal vantagem que um corretor tem sobre a vitrine.**

### 3. A primeira dobra tem: foto grande do prédio/lazer, nome, 1 linha, metragens em chips e UM botão
`meuapgoiania-bside` (chips "1 quarto 50 m² | 2 quartos 72 m² | 2 quartos 95 m²"), `imoveisprontodf-identidade` (chips "Lançamento · Entrega Jun/2027 · Áreas decoradas" + 1 botão verde), `alvobr-next` (render da torre + linha de preço + 1 botão), `kronos-barra` (1 botão dourado + 1 secundário). Nenhuma B-forte abre com texto institucional longo nem com vídeo.

### 4. WhatsApp sempre à mão: flutuante e, no celular, barra fixa no rodapé
22 das 37 páginas com conteúdo têm WhatsApp fixo na tela; entre as B-fortes, 7 de 8. As duas melhores no celular trocam o círculo por uma **barra larga fixa** com a contrapartida escrita: "Pedir tabela e fluxo no WhatsApp" (`alvobr-next`) e "Falar no WhatsApp · resposta em minutos" (`imoveisprontodf-identidade`).
Evidência: `shots/alvobr-next-mobile-fold.jpg`, `shots/imoveisprontodf-identidade-mobile-fold.jpg`.

### 5. Formulário curto (2 a 3 campos) e cedo, sempre trocando dado por material
`imovelrio-extra`: 2 campos (nome, telefone) a y=317, botão "Receber Book Completo". `kronos-barra`: 3 campos a y=228, "Antecipe-se ao lançamento". `greenpark-rio`: 3 campos. As fracas pedem 5 a 6 campos com e-mail, mensagem e reCAPTCHA (`markimoveis-eleva25`, `quadraimob-identidade`, `selectpro-ribeirao`, `pradogoncalves-sensia`). Nenhuma B-forte bloqueia a leitura com modal.

### 6. Escassez concreta, não adjetivo
"Poucas unidades!" em barra fixa (`imovelrio-extra`), "Na tabela atual há 1 unidade a partir de R$ 2.903.626" (`alvobr-next`), "Unidades disponíveis" como seção (`alvobr-next`), "Antecipe-se ao lançamento" (`kronos-barra`), "Condição sujeita à confirmação de disponibilidade" (`meuapgoiania-bside`). A escassez vem amarrada a um fato da tabela. Sem a tabela do Vitor, a única escassez honesta disponível é "a tabela muda / unidades por andar variam" (não inventar "últimas unidades").

### 7. Fecha com dúvidas de quem compra na planta + quem é o corretor (CRECI à vista)
FAQ objetivo (entrega, FGTS, financiamento, visita, preço) em `alvobr-next`, `lancbalneario-next`, `kronos-barra`, `meuapgoiania-bside`, `guilhermenunes-campinas`. CRECI no topo ou rodapé em `fbc-hox` ("CRECI 54073-J"), `guilhermenunes` ("CRECI 315524-F"), `campinasnaplanta` ("Edson Evangelista - CRECI 148950"), `markimoveis` ("CRECI - 284…"). Uma pessoa com nome atende.

**Vídeo:** não é padrão de B-forte no topo. Aparece no meio, como "Vídeo do imóvel" (`fbc-hox`, `meuapgoiania-bside`, `proato-singah`). Vídeo no topo só nos sites A (`eleva25aguasclaras`, sequência de 91 quadros). **Altura:** B-fortes enxutas ficam entre 4.400 e 8.300 px no desktop; as longas (`kronos`, `greenpark`, `imovelrio`) são páginas de SEO com 13 a 17 mil px. As LPs antigas do Vitor tinham 10.498 (Versat) e 9.618 (Eleva), com 11 seções.

## O que os fracos fazem (evitar)

1. **Ficha de portal**: "Imóveis similares", "Compartilhe", "Favoritar", menu com Alugar/Vender/Financie (`markimoveis-eleva25`, `silvio-ilhadosol`, `quadraimob-identidade`, `porcaro-lourdes`, `selectpro-ribeirao`). Cada link desses é uma saída.
2. **Formulário genérico e longo**: 5 a 6 campos com e-mail e mensagem, botão "Enviar"/"Enviar mensagem", às vezes reCAPTCHA (`markimoveis`, `quadraimob`, `selectpro`, `pradogoncalves`).
3. **Vitrine sem preço** com "cadastre-se e receba condições exclusivas" vago (`versathomeresort`) ou 16 mil px de lazer sem nenhum valor (`eleva25aguasclaras`, `eleva25-combr`).
4. **Artigo de blog no lugar de LP**: título SEO enorme, texto corrido, CTA só no fim (`jurandyrleal-viva`, `reservaparque-ac`, `setorbueno-verdo`).
5. **Preço sem unidade**: "a partir de R$ 709.796" (`terral-eleva25`). Gera desconfiança quando a tabela chega com outro número.
6. **Imagem errada/genérica**: nas LPs antigas do próprio Vitor, decorado do Versat apresentado como Eleva (ver `auditoria-imagens.md`). Hotsite do Versat usa foto de banco (casal, mulher de toalha).

## Estrutura recomendada (aplicada nas duas LPs)

Sete dobras (antes eram 11), na ordem:

1. **Hero** (padrões 2, 3): foto grande do produto, nome, promessa em 1 linha, chips de tipologia, **"a partir de" com fonte e data**, botão único **"Receber tabela e fluxo no WhatsApp"** (link direto `wa.me`) + link secundário "ver plantas".
2. **Plantas e valores** (padrões 2, 6): cartões por tipologia com metragem, quartos, vaga e valor de referência datado; cada cartão abre o WhatsApp pedindo a tabela daquela planta. Aviso honesto do que só a tabela traz (sinal, mensais, semestrais, chaves, correção).
3. **Captura 1** (padrão 5): 3 campos (nome, WhatsApp, planta), botão "Quero a tabela com o fluxo". Sem modal, sem e-mail.
4. **Produto em imagens** (padrão 3): decorado/apartamento e lazer, poucas imagens grandes e certas, com legenda útil.
5. **Localização** com distâncias e mapa.
6. **Dúvidas + quem atende** (padrão 7): FAQ curto e o Vitor com foto, nome e CRECI.
7. **Captura 2** (padrão 5): visita ao decorado/conversa, mesmos 3 campos.

Sempre presente (padrão 4): **barra fixa de WhatsApp no celular** com a contrapartida escrita e botão flutuante no desktop. Sem vídeo no topo (padrão B-forte; e não há vídeo próprio em boa resolução, ver pendências).

- **Versat** (resort, ticket a partir de R$ 1,14 mi, 3q 95 a 210 m²): hero com o **complexo aquático**; promessa de lazer de clube dentro de casa (2.052 m²); chips 95 m² · 108 m² · gardens · penthouse 210 m²; produto em imagens começa pelo **decorado** (é o que o comprador de 3 quartos quer ver) e depois o lazer.
- **Eleva 25** (localização Rua 25 Sul, ticket de entrada): hero com a **torre** e a promessa de endereço (metrô na porta); preço de entrada de 3 quartos em destaque; bloco de localização sobe para logo depois das plantas, porque é o argumento principal.
