# Entrega v3 — peças claras, 21/10/2026

Pedidos do Vitor (áudios de 21/10, 11h56 a 12h19 + tabelas novas) aplicados. **Nada foi ativado** e nenhuma mensagem foi enviada a ninguém.

## 1. O que mudou no visual
Antes/depois em `ANTES-DEPOIS_visual.jpg` (linha de cima = v2 escura, linha de baixo = v3). Fundo creme claro, foto/render oficial (Terral, Villela e Carvalho) ocupando a maior parte, preço grande, só duas linhas de preço. Sem IA. Assinatura "CRECI 29425-DF" em todas (o botão desenhado foi removido na v3.1). Sem semestrais em nenhuma peça.
12 peças = 2 empreendimentos × 3 ângulos (A decorado/interior, B empreendimento, C lazer/quarto) × 2 formatos (4x5 feed, 9x16 story, com zonas seguras de story respeitadas) + 2 vídeos 9x16 com plano de pagamento sobreposto.

## Ajuste v3.1 (21/10/2026, aprovado pelo Guilherme)
1. **Botão "Falar com corretor" removido** de todas as 12 peças e dos 2 vídeos (era interface falsa dentro da imagem). Sem substituto. O CTA clicável é o botão nativo do Meta Ads.
2. **Parcela maior:** o número da parcela (Eleva 6 mensais de R$ 7.098; Versat parcelas a partir de R$ 3.050) subiu para 196 px no 4x5 e 216 px no 9x16 (antes 86 e 96), com "A partir de / 6 mensais de / parcelas a partir de" em corpo pequeno acima. O sinal ficou em 92 px (4x5) e 100 px (9x16). Vale também para o overlay dos vídeos.
3. **Paleta única da campanha** (idêntica nas 12 peças, nos 2 vídeos e entre Eleva e Versat; sem cor por empreendimento):
   - Fundo claro: `#F7F3EC`
   - Valor (números de sinal e parcela, "R$", "A partir de", marcador do nome): `#C2461B`
   - Apoio (nome do empreendimento, rótulos "SINAL", "6 MENSAIS DE", assinatura/CRECI, legal a 60%): `#1D1A16`
   - Tipografia: Playfair Display 800 nos números, Inter nos demais. Mesmas margens e posições nas 3 composições de cada produto.
4. **Tratamento de imagem uniforme** (função `grade` em `criativos-entrada/vg_criativos_v3.py`): neutraliza 70% da dominante de cor, leva a luminância média a 0,50 e a saturação média a ~0,30 em todas as fotos. Medido (luminância/saturação, antes → depois): e_a 0,54/0,19 → 0,50/0,23; e_b 0,48/0,34 → 0,49/0,31; e_c 0,39/0,31 → 0,45/0,29; v_a 0,51/0,22 → 0,50/0,23; v_b 0,49/0,35 → 0,50/0,31 (era a mais azul/fria); v_c 0,51/0,23 → 0,50/0,24. Nos vídeos o mesmo ajuste foi aplicado de forma mais branda (±15%) para não estourar o filme oficial da Terral. O terceiro trecho do vídeo do Eleva foi trocado por um trecho sem legenda embutida.
Comparativos: `TIRA_6-pecas-4x5_lado-a-lado.jpg`, `ANTES-DEPOIS_4x5_ELEVA-A.jpg`, `ANTES-DEPOIS_9x16_VERSAT-B.jpg`. O `ANTES-DEPOIS_visual.jpg` antigo mostra a v2 escura contra a v3 original.

## 2. Conferência valor por valor
| Produto | Peças | Campo | Na peça | Fonte | Tabela oficial | Status | Obs |
|---|---|---|---|---|---|---|---|
| ELEVA | Todas as 6 peças ELEVA (A/B/C × 4x5/9x16) + vídeo | Sinal | R$ 56.784 | Tabela ELEVA 25 TABELA(RUA)_2026_10, B-1906 (48,55 m², menor da tabela) | R$ 56.783,67 | CONFERE | arredondado p/ cima; = 8,00% de R$ 709.795,94 |
| ELEVA | Todas as 6 peças ELEVA (A/B/C × 4x5/9x16) + vídeo | Mensal (6x) | R$ 7.098 | idem | R$ 7.097,96 | CONFERE | arredondado p/ cima; = 1,00% do total; tabela tem 6 mensais a partir de 01/11/2026 |
| ELEVA | Todas as 6 peças ELEVA (A/B/C × 4x5/9x16) + vídeo | Nº de mensais | 6 | idem | 6x | CONFERE |  |
| ELEVA | Todas as 6 peças ELEVA (A/B/C × 4x5/9x16) + vídeo | Semestrais | não mencionado | — | tabela não tem semestrais (tem parcela única 01/02/2027) | OK | pedido do Vitor |
| ELEVA | Legal (rodapé) | Unidade citada | B-1906 (48,55 m²) | idem | B-1906, Apto Borboleta, Disponível, total R$ 709.795,94 | CONFERE |  |
| VERSAT | Todas as 6 peças VERSAT + vídeo | Sinal | R$ 87.770 | Áudio do Vitor 21/10 (copiar concorrente) | menor sinal da tabela set/2026 R00: R$ 93.094,20 (un. 410) | NÃO CONFERE COM A TABELA | Peça está R$ 5.324,20 ABAIXO do menor sinal. Nenhuma unidade da tabela tem sinal ≤ R$ 87.770. Decisão do Guilherme: seguir o pedido do cliente. |
| VERSAT | Todas as 6 peças VERSAT + vídeo | Parcelas a partir de | R$ 3.050 | Áudio do Vitor 21/10 | menor parcela (38x) da tabela: R$ 3.062,31 (un. 410) | NÃO CONFERE COM A TABELA | R$ 12,31 abaixo da menor parcela. Tabela exige também 6 semestrais (R$ 23.273,55 na un. 410) e parcela final — omitidas por pedido do Vitor. |
| VERSAT | Todas as 6 peças VERSAT + vídeo | Semestrais | não mencionado | — | tabela tem 6 semestrais | OMITIDO POR PEDIDO | Vitor: "não precisa nem colocar que tem semestral" |

### Valores órfãos / herdados (auditoria anterior)
| Valor órfão/herdado | Tabela vigente | Status |
|---|---|---|
| R$ 709.796 (site Terral) | B-1906 — total R$ 709.795,94 | RESOLVIDO (a tabela de out/26 traz exatamente R$ 709.795,94) |
| R$ 996.885,30 (msg Vitor 07/10, Eleva 3q) | B-1510 — 68,78 m², total R$ 996.885,30, sinal R$ 79.750,84 | RESOLVIDO (linha existe na tabela 2026_10) |
| R$ 654.311,14 (msg Vitor 07/10, Eleva 2q) | não existe em nenhuma linha (menor total = R$ 709.795,94) | NÃO RESOLVIDO — valor sem origem; não usado |
| R$ 1.146.759,73 (msg Vitor 07/10, Versat) | tabela Versat set/26: menor total = R$ 1.163.677,53 (un. 410) | NÃO RESOLVIDO — provável tabela anterior; não usado |
| R$ 178.027,20 (entrada 20% do Eleva, tabela de julho) | Out/26 B-402: 8%+6x1%+única 6% = R$ 179.202,18 (total R$ 896.010,90) | SUBSTITUÍDO — valor de julho descartado; tabela de julho vencida |
| R$ 890.136,00 (B-402, julho) | Out/26 B-402 = R$ 896.010,90 (+0,66%) | SUBSTITUÍDO |

Tabelas lidas por inteiro e reconciliadas por linha: Eleva 54 linhas e Versat 116 linhas, todas com sinal + parcelas + final = total (zero inconsistências).

## 3. Divergência de preço do VERSAT (nota informativa)
Seguindo a decisão do Guilherme, as peças do Versat levam **sinal R$ 87.770 e parcelas a partir de R$ 3.050** (áudio do Vitor, copiando o concorrente). Na tabela oficial de setembro/2026 (R00, plano de 100 meses) que o próprio Vitor mandou, o **menor sinal é R$ 93.094,20 e a menor parcela R$ 3.062,31** (unidade 410); o sinal da tabela é 8,00% em todas as linhas e nenhuma unidade tem sinal ≤ R$ 87.770. Ou seja, o anúncio promete R$ 5.324,20 a menos de sinal do que a tabela. Provavelmente é outro plano de pagamento (87.770 não bate com nenhuma linha). Status: **em aberto, sem bloquear a entrega**. Se o Vitor confirmar que existe plano com esse sinal, nada muda; se não existir, o lead que chegar vai ver outro valor na conversa. Peças não foram alteradas por isso.

## 4. Meta (conta act_1876712769957014)
- **Pausado:** a campanha `120254723819640536` ([VG] Eleva 25 + Versat — Leads LP — out/26) e, com ela, os 5 anúncios que rodavam: OUT26 Versat V1 video (o vídeo "resort" sem preço), OUT26 Versat IMG carrossel01, OUT26 Eleva25 V1 video, OUT26 Eleva25 V2 video, OUT26 Eleva25 IMG estatico. Verificado: todos com effective_status CAMPAIGN_PAUSED. **Atenção:** os anúncios individuais continuam com status ACTIVE (a Meta recusou pausá-los um a um, erro 2859024: "um administrador da empresa deve aceitar a política de não discriminação"), então reativar a campanha reativa os 5.
- **Anúncios novos: NÃO foram criados.** As 12 imagens subiram para a biblioteca da conta, mas a criação dos creatives falha com o erro 1885183 (app 1718123646144188 em modo Desenvolvimento). Dois passos humanos destravam: (1) admin da empresa aceitar a certificação de não discriminação em Configurações da empresa; (2) colocar o app em modo Live. Depois: `python3 criativos-entrada/publicar-ads-v3.py` cria 6 anúncios, todos PAUSED, na campanha `120254976916970536`. CTA da Meta usado: "Fale conosco" (CONTACT_US), que é o mais próximo; "Falar com corretor" não existe como botão nativo.
- Os 2 vídeos não foram enviados à conta (upload só depois do destravamento).

## 5. Landing pages
Botões principais (topo, hero, barra fixa, capturas, corretor) trocados para "Falar com corretor" em vitorguilhermeimoveis.com.br/versat/ e /eleva-25/, publicados e conferidos no ar. Commit 018b1e6 no repo vitor-guilherme-lps. Botões de planta e de visita ficaram como estavam. **Aviso:** o preço "a partir de" dentro das LPs (ex.: Eleva R$ 955.553, referência Apto) não foi mexido e agora difere das peças.

## 6. Ciclo de 7 dias
Registrado na planilha de acompanhamento, aba "Campanhas Meta" (linhas 35 a 45): 8 criativos, início previsto 22/10/2026 e corte 29/10/2026. **São datas previstas**: o relógio começa de verdade no "liga"; preencher "Início real" e recalcular o corte (início + 7).

## 7. Limites honestos
- Não existe vídeo de decorado real no projeto. Os vídeos usam material oficial: Eleva = trechos do filme oficial da Terral (lobby/lazer/fachada; 15s) e Versat = animação (zoom suave) sobre renders oficiais, porque o único vídeo do Versat disponível tem 360×640 e ficaria borrado. Se o Vitor tiver filmagem do decorado, dá para trocar o fundo e manter a sobreposição.
- Eleva usa a menor unidade da tabela de outubro (B-1906, 48,55 m²). A unidade B-402 (45,36 m²), que as peças antigas usavam, custa R$ 896.010,90 agora.
- Valores do Eleva arredondados para cima (nunca abaixo do real).
