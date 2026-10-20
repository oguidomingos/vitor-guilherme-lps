# LPs do corretor Vitor Guilherme

Páginas estáticas. As duas LPs de lançamento foram **reconstruídas em 20/10/2026 (versão 3)** e estão no ar:

| LP | URL | Fonte | Identidade |
|---|---|---|---|
| Versat Home Resort (Villela e Carvalho, Rua Copaíba, Águas Claras Sul) | https://vitorguilhermeimoveis.com.br/versat/ | `src/versat.html` | identidade do Vitor; acento `--emp` verde-floresta |
| Eleva 25 (Terral, Rua 25 Sul, Águas Claras) | https://vitorguilhermeimoveis.com.br/eleva-25/ | `src/eleva-25.html` | identidade do Vitor; acento `--emp` laranja |

**Identidade visual (SSOT): `design.md`.** As duas LPs usam o mesmo sistema (`assets/lp3.css`): Playfair Display + Inter, ink / cream / bronze, mesmos componentes. A página só define `--emp` (acento pontual do empreendimento) e `--hero-pos`.

Leia primeiro: **`relatorio/RELATORIO.md`** (o que mudou, antes/depois, pendências), `benchmarking.md` (de onde saiu a estrutura) e `auditoria-imagens.md` (imagem por imagem).

## Como editar e publicar

1. Editar `src/<lp>.html` (imagem: `<img data-v3="nome" alt="..." sizes="...">`, arquivos em `<lp>/img/v3/nome-{sm,lg}.webp`).
2. `python3 scripts/build_lps.py` gera `versat/index.html` e `eleva-25/index.html`.
3. Publicar na Hostinger (conta `u630398133`, `public_html`): upload por arquivo via API (`/api/hosting/v1/files/upload-urls` + TUS, `override=true`). Subir só os arquivos alterados; um deploy de pasta inteira sobrescreve o site todo.
4. Conferir a URL pública em navegador e commitar (`origin` = `github.com/oguidomingos/vitor-guilherme-lps`, branch `main`).

Compartilhados: `assets/lp3.css` (estrutura), `assets/lp.js` (tracking, registro de cliques, captura, barra fixa). As outras LPs da pasta usam `assets/app.js` e não foram alteradas.

## Estrutura (7 dobras, ver benchmarking.md)

Hero (foto, promessa, chips de metragem, "a partir de" com fonte e data, um botão "Receber tabela e fluxo no WhatsApp") → plantas e valores → captura 1 (3 campos) → produto em imagens → localização → dúvidas + corretor → captura 2 (visita). No Eleva a localização vem logo depois das plantas. Barra fixa de WhatsApp no celular; botão flutuante no desktop. Sem modal: todo botão é `wa.me` direto e todo clique é registrado. Sem a marca da assessoria e sem nomes ligados à antiga sociedade.

## Relatório para o Vitor (cliques e leads)

**O que é gravado.** `assets/lp.js` envia para `https://leads.expoente.marketing/vg-lead`:

- `pageview` ao abrir a página (denominador da conversão);
- `wa_click` a cada clique em qualquer botão de WhatsApp: data/hora (servidor, UTC), `utm_source/medium/campaign/content/term`, `gclid/fbclid`, **seção da página** (`hero`, `plantas`, `captura-1`, `localizacao`, `corretor`, `flutuante`...), botão, `session_id`, página e referrer;
- `lead` ao enviar o formulário (nome, WhatsApp, interesse, seção, mesma origem).

Os envios usam `sendBeacon`/`fetch keepalive` e, se falharem, ficam numa fila no navegador (`localStorage`) reenviada em 30 s ou ao voltar online. Cliques e visitas vão para `clicks.jsonl`; leads para `leads.jsonl` (ambos em `/root/projects/vitor-guilherme/lead-logger/`, com `fsync`). Limite honesto: o clique prova que a pessoa apertou o botão, não que mandou a mensagem no WhatsApp.

**Extrair o relatório (na VPS):**

```bash
cd /root/projects/vitor-guilherme-lps
python3 scripts/relatorio_vitor.py                       # tudo
python3 scripts/relatorio_vitor.py --desde 2026-10-20    # a partir de uma data (UTC)
python3 scripts/relatorio_vitor.py --emp eleva-25        # ou versat
# gera relatorio-vitor/resumo.md, cliques.csv e leads.csv (abrem no Excel)
```

`resumo.md` traz visitas, cliques, sessões que clicaram e leads por empreendimento, cliques por seção e por anúncio (UTM), e a lista de leads. Para testar sem sujar o relatório, abra a LP com `?vg_test=1` (registros marcados `is_test`, ignorados no relatório e sem auto-resposta).

**Servidor.** O `vg-lead-logger` (pm2, porta 3021, nginx `leads.expoente.marketing/vg-lead`) foi alterado para separar `wa_click`/`pageview` em `clicks.jsonl`, sem auto-resposta nem sync. Cópia em `infra/vg-lead-logger-server.js`; backup original `server.js.bak-20261020-clicks`. O nginx não foi tocado.

> **Achado importante:** em 20/10 o logger **não estava rodando** (o domínio devolvia 502; último lead gravado em 15/10; o processo não estava no pm2). Foi reiniciado com `pm2 start` + `pm2 save`. Leads que o navegador guardou na fila de cada visitante são reenviados quando a pessoa abrir o site de novo. **Leads entre 15 e 20/10 podem ter se perdido** nos navegadores que não voltaram; vale cruzar com as mensagens de WhatsApp recebidas.

## Preços por metragem (consulta em 20/10/2026)

"Apto" = apto.vc. Preço/m² calculado (preço ÷ metragem). Dados conferidos por download direto das páginas.

### Eleva 25

| Metragem | Preço | R$/m² | Fonte | Data do dado | Uso na LP |
|---|---|---|---|---|---|
| 71 m² (3q) | R$ 955.553 | 13.459 | [Apto Eleva25](https://apto.vc/br/df/brasilia/aguas-claras/eleva25) | tabela de 05/08/2026 | cartão 71 m² e hero |
| 76,97 m² (3q, 1 suíte) | R$ 1.108.800 | 14.405 | [Acontece Imobiliária, AC3872](https://www.aconteceimobiliaria.com.br/imovel/apartamento-sul-aguas-claras-aguas-claras-df-3-quartos-76.97m2-AC3872) (marcado "lançamento", entrega 05/2027) | anúncio sem data | cartão 77 m² |
| 91 m² (3q) | R$ 1.276.693 | 14.030 | Apto Eleva25 | 05/08/2026 | cartão 91 m² |
| 45 m² | R$ 890.136 | 19.781 | Apto Eleva25 | 05/08/2026 | **não usado**: R$/m² incoerente (acima do 71 m²) |
| 91 m² | R$ 1.300.000 | 14.286 | DF Imóveis (pista do Guilherme) | n/d | **não confirmado** (site bloqueia acesso automático, 403) |
| 46 m²/2q | R$ 595.000 | 12.935 | wimoveis (pista) | n/d | **não confirmado**; se for ágio (R$ 170 mil de entrada) não é preço de tabela |
| 91,45 m² / 83 m² / 72 m² / 45 m² | ~R$ 1.100.000 / 1.070.000 / 866.868 / 686.716 | 12 a 15 mil | DF Imóveis, só trecho de buscador | n/d | **não usados** (não verificados na página) |
| 172 m² (cobertura) | sem preço | | Apto | | "sem valor público" |

**"A partir de R$ 709.796" (Terral):** o texto existe em [terralincorporadora.com.br/lancamento/eleva25/71](https://www.terralincorporadora.com.br/lancamento/eleva25/71) (confirmado), mas **sem unidade, tipologia ou data**. Não bate com nenhuma tabela: o mais próximo é o "preço estimado" do Apto para 45 m² (R$ 709.033,50, que é só 45 × R$ 15.756/m², fórmula e não tabela). Inferência, não confirmada: é o 2 quartos compacto de ~45 m². Por isso saiu do hero (a LP vende 3 quartos) e a página avisa que esse número não informa a unidade.

Entrega: **maio/2027** (Acontece, Mark Imóveis) ou **out/2028** (Apto); Terral e o site do lançamento não publicam. A LP não afirma data: manda confirmar. Decorado "de 71,30 m²": não confirmado (o site lista 71,66 m²); a LP diz só "decorado de 3 quartos".

### Versat Home Resort

| Metragem | Preço | R$/m² | Fonte | Data do dado |
|---|---|---|---|---|
| 95 m², 1 vaga | R$ 1.166.586,73 | 12.280 | [Apto Versat](https://apto.vc/br/df/brasilia/aguas-claras/versat-home-resort) | tabela de 16/10/2026 |
| 108 m², 1 vaga | R$ 1.395.582,37 | 12.922 | Apto Versat | 16/10/2026 |
| 210 m² (cobertura), 3 vagas | R$ 3.114.829,65 | 14.833 | Apto Versat | 16/10/2026 |
| 64 m²/2q | R$ 751.842 | | **pista refutada**: o anúncio de DF Imóveis é do *Viva Águas Claras*, outro empreendimento | |
| 96 m² | R$ 1.082.486 | 11.276 | DF Imóveis, trecho de buscador, "atualizado em março/2025" | **não usado** (antigo) |

Metragem: Apto diz 95 a 210 m²; anúncios/construtora falam em 96 a 108 m² para o tipo. A LP usa "95 a 108 m²" para 3 quartos e 210 m² para cobertura. Entrega: dez/2028 (Apto; sem data nos sites oficiais). Suíte x semi-suítes e 1 x 2 vagas **divergem entre fontes**: a LP diz "3 quartos com suíte e varanda" e "1 vaga" e avisa que a tabela confirma.

**Média de lançamento em Águas Claras:** o R$ 1.460.980 não aparece em nenhuma página. O Apto mostra **R$ 1.474.191** em 20/10/2026 (página [Águas Claras](https://apto.vc/br/df/brasilia/aguas-claras), sem data de atualização). Não foi usada nas LPs.

**Cuidado com o "preço estimado" do Apto:** é área × valor fixo por m² (R$ 15.756 no Eleva; R$ 13.345 no Versat), não tabela. Nada disso foi usado.

Bloqueios de acesso: DF Imóveis, wimoveis, OLX e a página da construtora Villela retornam 403 (Cloudflare) para qualquer acesso automático; Instagram não foi localizado. Os números desses sites só aparecem como trecho de buscador e estão marcados como não verificados. **Conferir à mão no navegador** antes de usar.

## Análise competitiva

### Eleva 25: site `eleva25aguasclaras.com.br`

Domínio próprio no Netlify; o código se autodenomina "site oficial", mas a titularidade não está provada (a página da Terral é a oficial da incorporadora).

- **O que tem:** vídeo e hero, lazer detalhado por pavimento (mais de 20 espaços), plantas de 3 quartos de 68,78 a 91,45 m² e coberturas de 133 e 172 m², diferenciais, tempos até metrô/shopping/parque, dados registrais, CTAs de WhatsApp com mensagem pronta, JSON-LD completo.
- **O que não tem:** **nenhum preço, condição ou data de entrega**; nenhum formulário (todo CTA é `wa.me` para um único número, sem saber quem atende); omite o 2 quartos de ~45 m² que a Terral e os portais divulgam; Meta Pixel sem evento Lead e sem GA/GTM (não mede o clique); "poucos minutos a pé" sem dizer o modo de deslocamento.
- **Onde a LP do Vitor perde:** volume de imagem e vídeo, detalhe do lazer, plantas oficiais por unidade, peso institucional (CNPJ, memorial).
- **Onde pode ganhar:** valores de referência com fonte e data (o oficial não publica nenhum); explicação honesta do que é público e do que só a tabela mostra; contrapartida clara (tabela com fluxo); alerta sobre o "a partir de R$ 709.796" sem unidade; uma pessoa conhecida atendendo; visita ao decorado; medição e prova de leads; página mais leve.
- **Posicionamento:** não competir em informação. Vencer em **atendimento** (um corretor com nome e foto), **condição** (a tabela com sinal e parcelas, quando o Vitor passar os dados) e **clareza** (preço de referência datado, sem pegadinha). Também faltam à LP as **plantas técnicas** por tipologia (hoje há fotos do decorado): baixar do material do incorporador, com autorização.

### Versat: existe site oficial equivalente?

Sim: `versathomeresort.com.br` (hotsite WordPress) e a página da construtora (`construtoravillela.com.br/versat/`, bloqueada ao acesso automático, não analisada).

- **O que tem:** identidade clara ("Time is Life"), lazer bem ilustrado (22 imagens, Fitness by Six, Spa by eLIÁ), formulário curto com consentimento LGPD, carga rápida.
- **O que não tem:** metragem, plantas, quartos, vagas, entrega e preço (**zero informação de produto**); sem WhatsApp; formulário genérico, sem escolha de interesse; sem tracking visível; localização sem distância nem mapa. O hotsite usa um cadastro obrigatório ("Cadastre-se agora e receba condições exclusivas").
- **Onde a LP do Vitor ganha com folga:** é a única que diz metragens, valores de referência, entrega prevista e como funciona o pagamento, sem exigir cadastro antes. **Onde perde:** lazer ilustrado (22 imagens oficiais) e marca das parcerias.
- **Posicionamento:** "o que o site oficial não conta": plantas, faixa de preço, localização com mapa e atendimento por WhatsApp na hora.

## SÓ O VITOR CONSEGUE (cobrar dele)

> Nada abaixo existe em portal. **Nenhum valor foi inventado**; as LPs só dizem que a tabela traz esses itens.

Para **cada empreendimento** (Versat e Eleva 25), pedir ao Vitor a tabela comercial atual da incorporadora:

1. **Sinal / entrada** da tabela e **quanto de FGTS** pode entrar e quando.
2. **Número e valor das mensais**, e vencimento da primeira.
3. **Número e valor das semestrais / intermediárias**.
4. **Saldo nas chaves** e financiamento bancário (quem financia, taxa de referência).
5. **Índice de correção** (a única pista, de um anúncio de 2024 do Eleva, é INCC-FGV, desatualizada) e **despesas** (ITBI, registro, taxa de evolução de obra).
6. **Tabela por unidade/andar**, unidades **disponíveis** e **validade** da tabela.
7. **Data contratual de entrega** (Eleva: 05/2027 x 10/2028; Versat: dez/2028 só em portal).
8. **Vagas por tipologia** (1 ou 2 no Versat), suíte x semi-suítes no Versat, e **2 quartos compactos** do Eleva (existem? metragem e preço).
9. **A que unidade corresponde** o "a partir de R$ 709.796" da Terral.
10. **Autorização** para usar plantas e imagens oficiais (planta técnica por tipologia) e o material do decorado.
11. **Endereço, dias e horário do decorado** de cada empreendimento.
12. **Nome completo e número do CRECI-DF** para o rodapé (**obrigatório em anúncio imobiliário**; hoje são campos amarelos `data-pendente` nas duas LPs; antes de subir tráfego, trocar) e, se quiser, a foto atual.
13. **Confirmar o número de WhatsApp**: a LP usa (61) 91223-0005 (`556191223005`, o mesmo do código anterior).

## Pendências técnicas e decisões do Guilherme

- **Auto-resposta do logger com preços antigos:** ao receber um lead, o logger manda WhatsApp automático pelo número do Vitor com "a partir de R$ 654.311,14 / 996.885,30" (Eleva) e "R$ 1.146.759,73" (Versat), valores que não batem com esta página. Texto em `infra/vg-lead-logger-server.js` (`EMPREENDIMENTOS`). **Não alterado**: muda mensagem enviada em nome do Vitor. Decidir se atualiza ou remove os valores.
- **Publicação:** resolvida em 20/10/2026 (versão 3 no ar, ver `relatorio/RELATORIO.md`). A entrega anterior de 20/10 (5b13615) nunca chegou a ser publicada.
- **GTM/Google Ads:** o container `GTM-543P3VS8` e a conversão de WhatsApp continuam, agora disparando a cada clique no WhatsApp **e** a cada envio de formulário. Revisar com a BRM se isso duplica conversões.
- **Medição pelo Meta Pixel:** vem pelo GTM (como antes); confirmar que o evento de clique/lead chega no Meta (`vg_wa_click`, `vg_lead_form` no dataLayer).
- Plantas técnicas, vídeo do decorado, fotos do decorado do Eleva e prova social ainda não estão nas páginas.

## Verificação feita em 20/10/2026

Chrome headless real, celular (390 px) e desktop (1280 px), contra o logger de produção com `?vg_test=1`: sem modal; sem rolagem horizontal; zero erros de console; todos os botões visíveis geraram `wa_click` com UTM, seção, sessão e horário (Versat e Eleva); o formulário enviou o lead (`tipo=lead`, seção `captura-1`) e mostrou a confirmação; os registros chegaram em `clicks.jsonl`/`leads.jsonl`; o relatório ignora os testes. **Não testado:** envio real por WhatsApp, abertura do `wa.me` em aparelho real, navegador Safari/iOS, medição no GTM/Meta.
