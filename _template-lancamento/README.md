# Template · Landing page de LANÇAMENTO (empreendimento)

Diferente das LPs de imóvel avulso (galpão, terreno, casa…), este template é para **lançamentos
com múltiplas unidades**: hero com metadados, ficha, sobre, diferenciais + chips de lazer, galeria,
**plantas/tipologias com preço "a partir de"**, localização com mapa real + **cronograma da obra**,
corretor responsável (foto real do Vitor), **formulário de interesse** (abre o WhatsApp com a mensagem
pronta, sem backend) e CTA final. Mesma identidade visual das outras LPs (`assets/styles.css`,
Playfair Display + Inter, ink/cream/bronze).

Exemplos publicados a partir dele: [`/eleva-25/`](../eleva-25/) e [`/versat/`](../versat/).

## Como criar uma nova LP de lançamento (10 min)

1. `cp -r _template-lancamento <slug>` (slug em kebab-case, ex.: `royal-botanic`, `nexus-residence`).
2. Abra `<slug>/index.html` e troque **todos** os `{{PLACEHOLDERS}}` (busque por `{{`). Os principais:
   - `{{NOME}}`, `{{SLUG}}`, `{{BAIRRO}}`, `{{ENDERECO}}`, `{{ENDERECO_URLENCODED}}` (vai no embed do Google Maps),
   - `{{TIPOLOGIA}}`, `{{METRAGENS}}`, `{{ENTREGA}}`, `{{PRECO_DESDE}}`, `{{INCORPORADORA}}`, `{{CONSTRUTORA}}`,
   - textos: `{{HEADLINE}}`, `{{SUBHEADLINE}}`, `{{FRASE_CONCEITO}}`, `{{PARAGRAFO_1/2}}`, `{{DIF1..3_*}}`, `{{LAZER_ITEM_1..8}}`,
   - plantas: `{{P1..3_*}}` (apague/duplique `.plan` conforme o nº de tipologias; `.featured` = mais procurada),
   - cronograma: `{{TL1..3_*}}` (`.tl.done` marca etapa concluída), `{{TRUST1..3_*}}`, `{{CTA_*}}`, `{{DISCLAIMER}}`.
3. Imagens em `<slug>/img/`: `hero.jpg` (paisagem, ≥1600 px), `g1..gN.jpg` (galeria; `.shot.wide` = 16:10, demais 4:5),
   opcional `p1..pN.jpg` nas plantas (`.pimg` com `background-image`; se não houver, mantenha `.pimg.ph`).
   Otimize (JPEG q≈85, lado maior ≤1920). Comprima HEIC do iPhone com `pillow_heif` + `ImageOps.exif_transpose`.
4. Seções sem dado: **apague** (ex.: plantas sem tabela, cronograma sem prazo). Nunca publique placeholder.
5. Adicione o link em `index.html` da raiz, commite e faça push — GitHub Pages publica em
   `https://oguidomingos.github.io/vitor-guilherme-lps/<slug>/` em 1–3 min.

## O que é compartilhado (não duplique)
- `assets/styles.css` — seção "v2 (ago/2026)" tem as classes novas: `.hero .meta`, `.amen`, `.plans/.plan`,
  `.timeline`, `.loc .map.has-iframe`, `.lead` (form), `.devs`, `.broker .avatar--img`, `footer .ft-broker`.
- `assets/app.js` — `data-wa` (links WhatsApp), lightbox, reveal e `form[data-lead-form]` (monta a mensagem com
  nome/interesse/WhatsApp e abre `wa.me/556191223005`). Número do Vitor em um único lugar: `VITOR_WA`.
- `assets/img/vitor.jpg` (640) e `vitor-320.jpg` — foto real do Vitor (perfil do WhatsApp, ago/2026).

## Fontes de conteúdo por empreendimento (onde buscar)
- Tabela de rua/vendas (PDF) → preços "a partir de", fluxo (sinal/mensais/semestrais/conclusão), prazo de entrega.
- Book / filme institucional → renders de fachada e áreas comuns (extrair frames limpos com `ffmpeg -ss T -i … -frames:v 1`
  usando seek preciso e cortar legendas com PIL).
- Fotos do decorado gravadas pelo Vitor (pastas do Drive) → galeria. **Confirmar de qual empreendimento é cada pasta**
  (há mistura Eleva/Versat nas pastas de 05–06/08).
- `10_FICHA_DOS_PRODUTOS.md` e `NOVOS-LANCAMENTOS-DRIVE.md` (repo pai) → ficha resumida e o que falta de material.
