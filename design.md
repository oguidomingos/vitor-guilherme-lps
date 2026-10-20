# Vitor Guilherme · Imóveis: identidade visual (SSOT)

Fonte única de verdade da camada visual das LPs do Vitor. Consolidado em 20/10/2026 a partir do design system já usado no site (`assets/styles.css`: "Ink + cream + bronze · Playfair Display + Inter"). Implementação das LPs de lançamento: **`assets/lp3.css`**. Nenhuma LP define CSS próprio além de duas variáveis (ver "Acento do empreendimento").

## Princípios

1. **A marca é do Vitor, não do empreendimento.** Todas as LPs usam a mesma base ink/cream/bronze, as mesmas fontes e os mesmos componentes. O cliente reconhece o corretor de página para página.
2. **Editorial, alto padrão, sem enfeite.** Serifa nos títulos, sans no texto, muito respiro, foto grande.
3. **O empreendimento entra só como acento pontual** (um detalhe de cor), nunca como fundo, seção ou botão principal.
4. **WhatsApp é verde WhatsApp** (reconhecimento imediato); é a única cor fora da paleta permitida em botão.

## Tipografia

| Papel | Fonte | Peso | Uso |
|---|---|---|---|
| Display | **Playfair Display** (`--f-disp`) | 600 (itálico 500/600 para ênfase `<em>`) | H1, H2, títulos de card, preço, números de destaque, marca |
| Texto | **Inter** (`--f-body`) | 400 texto · 600 rótulos · 700 botões, kickers | todo o resto |

Escala (mobile → desktop, `clamp`): H1 2,4 → 5 rem, line-height .98, letter-spacing -.02em · H2 1,9 → 3,2 rem, 1.05 · card 1,6 rem · preço hero 2 → 3 rem · texto 16,5 → 17 px, line-height 1.6 · kicker .72 rem, caixa-alta, tracking .28em.
Carregamento: Google Fonts, `Playfair+Display:ital,wght@0,500;0,600;1,500;1,600` + `Inter:wght@400;600;700`, `display=swap`.

## Cores (tokens)

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#14110d` | texto principal, hero, blocos de captura, rodapé |
| `--ink-2` | `#221d16` | hover de superfícies ink |
| `--cream` | `#f6f2e9` | fundo da página, texto sobre ink |
| `--cream-2` | `#efe7d7` | caixas suaves (`--soft`) |
| `--sand` | `#e7dcc6` | placeholders de imagem, bordas quentes |
| `--bronze` | `#b0834b` | botão primário (não-WhatsApp), linhas, marcadores, ícones |
| `--bronze-2` | `#caa46a` | ênfase sobre ink: `<em>` do H1, preço do hero, kickers on-dark |
| `--bronze-ink` | `#6b4e26` | kickers e tags sobre cream (contraste AA) |
| `--muted` | `#5a5245` | texto secundário |
| `--line` | `rgba(20,17,13,.12)` | bordas e divisórias |
| `--wa` | `#25d366` (texto `#06231a`) | só botões de WhatsApp |
| `--card` | `#ffffff` | cards de planta, cartão do corretor, formulários |

### Acento do empreendimento (`--emp`)

Uma única variável por página, definida no `<style>` da LP junto com `--hero-pos` (enquadramento da foto do hero):

| LP | `--emp` | Origem |
|---|---|---|
| Versat Home Resort | `#3f6b55` (verde-floresta) | identidade do empreendimento |
| Eleva 25 | `#d9622b` (laranja) | identidade do empreendimento |

**Onde pode aparecer:** ponto do badge do hero, traço do kicker, tag do card de planta em destaque (fio superior), ponto das legendas da galeria, fio superior dos números de destaque, foco de campo de formulário não (usa bronze), marcador ativo do FAQ ao abrir. **Onde não pode:** fundo de seção, fundo do hero, botão, texto corrido, preço, título.

## Espaçamento, forma e sombra

- Grade: `--maxw 1200px`; padding lateral 20 px (mobile) / 40 px (≥900 px).
- Seções: 64 px (mobile) / 104 px (desktop) de padding vertical.
- Raios: `--r-card 18px` (cards, imagens, mapa), `--r-cap 24px` (bloco de captura), `--r-field 12px` (campos), botões e chips em pílula (`999px`).
- Sombra: `--shadow 0 24px 60px -28px rgba(20,17,13,.45)` só no card de planta em destaque e no cartão do corretor.
- Breakpoints: 760 px (grades de cards) e 900 px (hero lado a lado, galeria em grade, barra fixa vira botão flutuante).

## Componentes (todos em `assets/lp3.css`)

| Componente | Classe | Regras |
|---|---|---|
| Topo | `.topbar`, `.brand`, `.top-cta` | transparente sobre o hero; cream translúcido ao rolar |
| Hero | `.hero`, `.hero__media`, `.hero__body`, `.badge`, `.chips`, `.price`, `.actions` | fundo ink; foto em cima no celular, à direita no desktop (cantos `--r-card`); H1 cream com `<em>` bronze-2; um botão WhatsApp + link de texto |
| Faixa de números | `.strip` | fundo ink-2, números em Playfair bronze-2, fio `--emp` |
| Título de seção | `.split`, `.kicker`, `.h2`, `.lead` | kicker bronze-ink com traço `--emp` |
| Card de planta | `.plans`, `.plan`, `.plan.is-main` | branco, borda `--line`; destaque com borda bronze e sombra |
| Caixas informativas | `.knows` | fundo cream-2 |
| Captura | `.cap`, `.capform`, `.gives`, `.cap-done` | bloco ink, formulário branco, botão bronze |
| Galeria | `.rail` (`.wide`, `.tall`, `.land`) | carrossel com snap no celular, grade de 4 colunas no desktop; legenda em pílula ink |
| Números | `.facts` | Playfair bronze, fio superior `--emp` |
| Localização | `.loc`, `.pins`, `.map` | |
| FAQ + corretor | `.duo`, `details`, `.broker` | |
| Rodapé | `footer`, `.legal`, `.pendente` | ink; placeholder amarelo visível para dados pendentes |
| WhatsApp fixo | `.mbar` (celular), `.fab` (desktop) | |
| Botões | `.btn--wa`, `.btn--primary` (bronze), `.btn--line` | |

## O que não fazer

- Não criar CSS de componente dentro da página. Se algo novo for preciso, entra no `lp3.css` e neste documento.
- Não trocar fonte, fundo ou cor de botão por empreendimento.
- Não usar a cor do empreendimento em mais do que detalhes.
