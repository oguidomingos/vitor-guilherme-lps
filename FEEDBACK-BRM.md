# Feedback BRM — Versat e Eleva

Revisão: 19/10/2026. Fonte localizada fora do repositório:
`/root/projects/transcricao-vitor-fabiane-15out.md`, seção 4, itens 1–12,
referentes ao relato de Vitor de 15/10. A transcrição é automática e não foi
revisada pelo cliente. O item 13 é de infraestrutura e está fora desta tarefa.

## Os 12 pedidos e seus status

| Nº | Pedido | Status e evidência / dependência |
| --- | --- | --- |
| 1 | Versat: substituir a referência ao Plano Piloto por resort em Águas Claras. | Feito: título “Seu resort em Águas Claras.” |
| 2 | Versat: simplificar as informações acima da dobra. | Feito: apresentação curta, metragem e preço já existentes, um CTA principal; entrega e incorporadoras continuam nas seções seguintes. |
| 3 | Versat: mostrar fotos já na primeira dobra. | Feito: foto existente `versat/img/g1.jpg`, identificada como decorado ilustrativo, em destaque ao lado do texto no desktop e abaixo no celular. |
| 4 | Eleva: incluir fotos próprias e simplificar no mesmo padrão. | Feito: foto existente `eleva-25/img/d0.jpg`, apresentação compacta e mesma estrutura do Versat. A identificação das fotos segue os comentários de origem já presentes nas LPs. |
| 5 | CTA/formulário: pedir tabela e conversa com corretor. | Feito nas duas LPs: CTA principal, botão do formulário, opção inicial, mensagem do WhatsApp e CTA final. |
| 6 | Pós-formulário: entregar tabela e acionar corretor. | Não feito integralmente: o fluxo existente encaminha a solicitação ao WhatsApp do Vitor; não existe tabela oficial anexada no repositório nem entrega automática verificada. Depende da tabela atualizada e da definição de entrega/atendimento. A página agora descreve uma solicitação, sem prometer entrega automática. |
| 7 | Criativos com sinal, mensais, quantidade de parcelas e semestrais. | Pendente: pesquisa pública realizada em 19/10/2026 e preços das LPs atualizados; falta o fluxo contratual completo e os criativos. Ver PRECOS-FONTES.md. O simulador do portal não substitui a tabela da incorporadora. |
| 8 | Enviar criativos em veiculação ao gestor BRM. | Não feito: faltam arquivos/lista dos criativos, destinatário e autorização de envio; nenhuma mensagem enviada. |
| 9 | Alinhar expectativa de resultado em cerca de dois meses. | Não feito: requer conversa entre responsáveis; não é promessa para inserir nas LPs. |
| 10 | Confirmar investimento: R$ 500 ou R$ 1.500. | Feito: Guilherme confirmou aproximadamente R$ 1.000 em 19/10/2026. Referência interna de investimento em tráfego, sem periodicidade informada; não é preço de imóvel e não foi inserida nas LPs. |
| 11 | Perguntar ao Vitor qual item ele esqueceu de mencionar. | Não feito: depende de resposta do Vitor e autorização para contatá-lo. |
| 12 | Definir dono e data da revisão das LPs. | Não feito: esta revisão técnica ocorreu em 18/10/2026; responsável e data de aprovação comercial ainda precisam ser definidos pelo cliente. |

## Materiais pendentes

Tabela oficial atualizada de cada empreendimento; fluxo de pagamento aprovado;
criativos ativos e destinatário BRM; complemento
do feedback esquecido; responsável e data para revisão comercial. Nenhuma foto
nova foi criada: foram reutilizadas as imagens já identificadas no projeto.
Preços pesquisados em fontes públicas em 19/10/2026, conforme PRECOS-FONTES.md; não houve validação comercial com a BRM.

## Arquivos da alteração

- `versat/index.html`
- `eleva-25/index.html`
- `assets/brm-lps.css` (estilo usado somente nestas duas LPs)
- `FEEDBACK-BRM.md`

## Validação local

Projeto estático, sem `package.json` ou etapa de build. Preview servido apenas
em localhost com servidor temporário e Chrome headless via Playwright.
Verificação em 1440×900, 390×844 e 360×640 para cada LP: imagem carregada e
visível na primeira dobra, ausência de overflow horizontal, recursos locais
sem erro HTTP e JavaScript sem erros. Requisições externas bloqueadas no teste:
fontes remotas, mapas, analytics e atendimento real não são validados.
Não foram enviados leads, mensagens nem realizadas publicações.
