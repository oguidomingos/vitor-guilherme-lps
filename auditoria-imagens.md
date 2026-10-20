# Auditoria de imagens: Versat e Eleva 25 (20/10/2026)

Escopo: todas as imagens usadas em `versat/` e `eleva-25/` na versão **no ar** (a que o cliente viu: publicada em 12/10, igual ao `main` do GitHub) e na versão local de 20/10 (commit 5b13615, que **nunca foi publicada**), mais os assets compartilhados.

## Como cada imagem foi conferida

Comparação visual lado a lado (folhas de contato geradas com Pillow) contra quatro fontes de referência baixadas nesta sessão:

1. **Versat, hotsite oficial** `versathomeresort.com.br`: 37 arquivos em `wp-content/uploads/2026/01/` (perspectivas de lazer, fachada, apartamento, mapa aéreo).
2. **Versat, anúncios oficiais** da página "Versat Home Resort" na Meta Ad Library (Drive do cliente, pasta `1Uf7XcrjjqQi590e-WjFHzmlOXPp5tof_/Versat`): 3 estáticos e 1 vídeo de 40 s gravado **dentro do decorado do Versat**. Extraí 20 quadros do vídeo (1 a cada 2 s).
3. **Eleva 25, página oficial da Terral** `terralincorporadora.com.br/lancamento/eleva25/71`: 43 perspectivas (`terral.inforcedata.com.br/image/11242` a `11285`).
4. **Eleva 25, anúncio oficial da Terral** (vídeo 1:21, Drive, pastas `Eleva 25` e `1TdJHuHmmJvF-EYacLnOrctuCk-QxbUUz`): obra, áreas comuns e **decorado do Eleva** (marca "T" da Terral no canto). Extraí 27 quadros.

Pasta de criativos do Drive: 4 vídeos e 4 estáticos reais; os 3 vídeos da Terral são o **mesmo arquivo** (md5 `843b8bcd…`), e os 2 do Versat também (md5 `d9f03aa6…`). Os 80+ `kw_*.png` da pasta de briefing são prints da busca na Ad Library e **não foram usados**.

## Achado principal: o decorado estava no empreendimento errado

**As fotos `eleva-25/img/d0` a `d7`, usadas como "decorado do Eleva 25" na LP do Eleva, são do decorado do Versat.**

Evidência (folha `cmp2`, quadros do vídeo oficial do Versat):

| Foto na LP do Eleva | Quadro do anúncio oficial **Versat Home Resort** | Elemento idêntico |
|---|---|---|
| `d0.jpg` (sala com TV) | 0:10 | painel de TV em madeira quadriculada 3D, quadros quadrados ao lado, planta pendente |
| `d1.jpg` (jantar) | 0:06 | mesa oval de madeira, espelho redondo iluminado, 3 pendentes pretos |
| `d4.jpg` (suíte) | 0:36 | armário espelhado, painel ripado, manta cinza-verde |
| `d3.jpg` (cozinha) | 0:14 | armários brancos com vidro superior iluminado |

O decorado do Eleva, no vídeo da Terral, é outro: toalha de mesa verde-esmeralda, estante de madeira com nichos iluminados, cabeceira ripada escura e almofadas verdes estampadas.

Consequência: as fotos `d*` voltaram para o lugar certo (LP do Versat, com nome `dec-*`), e **a LP do Eleva ficou sem foto de decorado**: não existe foto do decorado do Eleva em resolução usável (o vídeo da Terral tem 360×640). O bloco do apartamento do Eleva usa as perspectivas oficiais do apartamento (Terral). Pendência registrada.

## Inventário completo das imagens antigas

Legenda do veredito: **CERTA** (empreendimento certo e origem legítima) · **ERRADA** (outro empreendimento) · **FORA DE LUGAR** (não é imagem de produto) · **BAIXA** (resolução ou corte ruins).

### `versat/`

| Arquivo | Tamanho | O que é | Origem | Veredito | Destino na nova LP |
|---|---|---|---|---|---|
| `img/hero.jpg` | 900×1600 | sala com varanda, decorado | quadro de vídeo do decorado do Versat | CERTA, BAIXA (quadro de vídeo) | `v3/dec-sala-varanda` |
| `img/g1.jpg` | 900×1600 | sala, decorado | quadro de vídeo, decorado do Versat | CERTA, BAIXA | substituída por `dec-sala` (foto 1400 px do mesmo decorado) |
| `img/g2.jpg` | 900×1600 | sala/TV, decorado | idem | CERTA, BAIXA | não usada (`dec-living-tv` cobre melhor) |
| `img/g3.jpg` | 900×1600 | cozinha, decorado | idem | CERTA, BAIXA | substituída por `dec-cozinha` |
| `img/g4.jpg` | 900×1600 | suíte, decorado | idem | CERTA, BAIXA | substituída por `dec-suite` |
| `img/g5.jpg` | 900×1600 | quarto/escritório, decorado | idem | CERTA, BAIXA | substituída por `dec-quarto` |
| `img/g6.jpg` | 900×1600 | taças sobre bancada | idem | FORA DE LUGAR (detalhe sem informação) | **removida** |
| `img/g7.jpg` | 900×1125 (900×1600 no ar) | o próprio Vitor, selfie no decorado, polegar para cima | quadro de vídeo do Vitor | FORA DE LUGAR: estava na **galeria do produto** como se fosse foto do apartamento | **removida da galeria** |
| `img/renders/r-piscina.jpg` | 1600×1067 | piscina adulto | = `PISCINA-ADULTO.webp` do hotsite oficial | CERTA | `v3/r-piscina` |
| `img/renders/r-panoramica.jpg` | 1600×1067 | complexo aquático, vista aérea | = `COMPLEXO-AQUATICO.webp` | CERTA (estava como "cobertura" no cartão de 210 m²: **legenda errada**) | `v3/r-complexo-aquatico` (hero) |
| `img/renders/r-fachada.jpg` | 2560×2163 | fachada noturna | mesma torre de `COPA_IMG_FACHADAPRIN02` | CERTA | `v3/r-fachada-noite` |
| `img/renders/r-gourmet.jpg` | 1600×1067 | terraço gourmet | = `TERRACO-GOURMET.webp` | CERTA | `v3/r-terraco-gourmet` |
| `img/renders/r-gourmet2.jpg` | 2560×1706 | espaço gourmet | = `GOURMET.webp` | CERTA | `v3/r-gourmet` |
| `img/renders/r-academia.jpg` | 2560×1706 | fitness | mesmo ambiente de `six-img.webp` (Fitness by Six) | CERTA | `v3/r-fitness` |
| `img/renders/r-pet.jpg` | 1600×1408 | pet place | = `PET-PLACE.webp` | CERTA | `v3/r-pet` |
| `img/renders/r-guarita.jpg` | 1600×1408 | acesso/guarita | mesma fachada ripada de `PET-PLACE.webp` | CERTA | `v3/r-acesso` |
| `og.jpg` (só no ar) | 1200×630 | piscina adulto | recorte de `r-piscina` | CERTA | substituída por `og.jpg` novo |
| `img/w/*`, `img/renders/w/*` | ≤1500 px | cópias redimensionadas das acima | — | herdam o veredito | não usadas |

### `eleva-25/`

| Arquivo | Tamanho | O que é | Origem | Veredito | Destino |
|---|---|---|---|---|---|
| `img/d0.jpg`, `d0-hero.jpg` | 1920×2560 / 1000×1333 | sala com TV | **decorado do Versat** | **ERRADA** (era o hero do Eleva) | movida para Versat: `v3/dec-living-tv` |
| `img/d1.jpg` | 1400×1867 | jantar | **decorado do Versat** | **ERRADA** | Versat `v3/dec-jantar` |
| `img/d2.jpg` | 1400×1867 | sala | **decorado do Versat** | **ERRADA** | Versat `v3/dec-sala` |
| `img/d3.jpg` | 1400×1867 | cozinha | **decorado do Versat** | **ERRADA** | Versat `v3/dec-cozinha` |
| `img/d4.jpg` | 1400×1867 | suíte | **decorado do Versat** | **ERRADA** | Versat `v3/dec-suite` |
| `img/d5.jpg` | 1400×1867 | quarto | **decorado do Versat** | **ERRADA** | Versat `v3/dec-quarto` |
| `img/d6.jpg` | 1400×1867 | lavabo | **decorado do Versat** | **ERRADA** | Versat `v3/dec-lavabo` |
| `img/d7.jpg` | 1400×1867 | vista de uma janela para prédios | sem origem comprovável (era "vista da varanda" do Eleva) | **ERRADA/sem prova** | **removida** de tudo |
| `img/hero.jpg` | 1920×760 | fachada na rua | quadro do filme da Terral | CERTA, BAIXA (faixa estreita) | substituída por `v3/r-rua` (Terral 11249, 1600×900) |
| `img/r-skypool.jpg` | 1920×760 | skypool | quadro de filme, = Terral 11265 | CERTA, BAIXA | `v3/r-skypool` (Terral, imagem inteira) |
| `img/r-skygym.jpg` | 1920×760 | skygym | = Terral 11250 | CERTA, BAIXA | `v3/r-skygym` |
| `img/r-beach.jpg` | 1920×760 | beach side | = Terral 11263 | CERTA, BAIXA | `v3/r-beach` |
| `img/r-lobby.jpg` | 1920×760 | lobby | = Terral 11259, recortado | CERTA, BAIXA | `v3/r-lobby` |
| `img/r-salao.jpg` | 1920×760 | salão de festas | = Terral 11268 | CERTA, BAIXA | `v3/r-salao` |
| `img/r-aereo.jpg` | 1920×1080 | vista aérea do lazer | = Terral 11272 | CERTA | `v3/r-aerea` |
| `img/r-rooftop.jpg` | 1920×1080 | rooftop visto de cima | quadro do filme da Terral | CERTA | não usada (sem informação legível) |
| `img/r-torre.jpg` | 800×1080 | torre | = Terral 11245, menor | CERTA, BAIXA | `v3/r-torre` (Terral 1280×1600) |
| `img/r-apto.jpg` | 1920×600 | living 3 quartos | = Terral 11282, faixa estreita | CERTA, BAIXA | `v3/r-living-c` |
| `og.jpg` (só no ar) | 1200×630 | fachada na rua | recorte de `hero.jpg` | CERTA | substituída por `og.jpg` novo |

### Compartilhadas (`assets/`)

| Arquivo | O que é | Veredito |
|---|---|---|
| `assets/img/vitor.jpg` (640×640) e `vitor-320.jpg` | retrato do Vitor | CERTA. Mantida no bloco "quem atende". |
| `assets/vitor-320.jpg` | cópia idêntica da anterior | duplicada; a nova LP usa só `assets/img/vitor.jpg` |

**Reaproveitamento entre os dois empreendimentos:** sim, e este era o erro. O mesmo decorado (Versat) aparecia nas duas LPs: em quadros de vídeo na do Versat e em fotos na do Eleva, com legenda "decorado do Eleva". Na versão nova **nenhuma imagem é usada nas duas páginas**, exceto o retrato do Vitor.

**Banco de imagem genérico:** nenhuma das antigas era de banco. O hotsite do Versat tem duas imagens de banco (`familia.webp`, `mulher.webp`, casal e mulher de toalha): **não usadas**.

## Imagens da nova versão (todas em `*/img/v3/`, WebP)

Cada arquivo tem duas larguras: `-sm` (720 px, celular) e `-lg` (até 1440 px, desktop). Peso total por página medido no relatório final.

### Versat: 26 imagens

| Novo arquivo | Fonte |
|---|---|
| `dec-living-tv`, `dec-jantar`, `dec-sala`, `dec-cozinha`, `dec-suite`, `dec-quarto`, `dec-lavabo` | fotos do decorado do **Versat** que estavam em `eleva-25/img/d0`–`d6` (identificação acima) |
| `dec-sala-varanda` | `versat/img/hero.jpg` (quadro de vídeo do decorado do Versat) |
| `r-complexo-aquatico`, `r-piscina`, `r-fachada-noite`, `r-gourmet`, `r-terraco-gourmet`, `r-fitness`, `r-pet`, `r-acesso` | renders já no repo, conferidos com o hotsite oficial |
| `r-fachada-dia`, `r-spa`, `r-praca`, `r-coworking`, `r-brinquedoteca`, `r-piscina-infantil`, `r-suite-varanda`, `r-sala-integrada`, `r-varanda-ofuro`, `r-aerea-local` | baixadas de `versathomeresort.com.br/wp-content/uploads/2026/01/` |

### Eleva 25: 20 imagens

Todas são perspectivas oficiais da **Terral** (`terral.inforcedata.com.br/image/<id>`, publicadas em `terralincorporadora.com.br/lancamento/eleva25/71`):
`r-torre` (11245), `r-torre-noite` (11242), `r-boulevard` (11247), `r-rua` (11249), `r-skypool` (11265), `r-skygym` (11250), `r-beach` (11263), `r-aerea` (11272), `r-lobby` (11259), `r-salao` (11268), `r-coworking` (11273), `r-quadra` (11277), `r-garagem-eletrico` (11278), `r-living-a` (11283), `r-living-b` (11284), `r-living-c` (11282), `r-terraco` (11285), `r-cinema` (11257), `r-playground` (11266), `r-pet` (11261).

## O que falta (pendências de imagem)

1. **Fotos do decorado do Eleva 25** (o Vitor visita: celular na vertical, luz do dia, um ambiente por foto). Hoje a LP do Eleva só tem perspectivas.
2. **Plantas técnicas** por tipologia dos dois empreendimentos (material da incorporadora). Os cartões de planta usam foto/perspectiva, não planta.
3. **Vídeo**: o único vídeo de cada produto em mãos é o do anúncio oficial, em 360×640 e com a marca de outro anunciante (Beiramar/Terral): baixa resolução e não é do Vitor. Falta um vídeo curto do Vitor no decorado (30 a 60 s, vertical).
4. **Autorização** de Villela e Carvalho e Terral para uso das perspectivas em material do corretor.
5. Confirmar que o decorado das fotos `dec-*` é o do Versat **no endereço de visita atual** (a identificação foi visual, contra o anúncio oficial).
