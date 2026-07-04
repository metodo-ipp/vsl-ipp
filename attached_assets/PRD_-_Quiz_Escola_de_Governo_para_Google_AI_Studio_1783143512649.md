# PRD - Quiz Diagnostico Escola de Governo

## 1. Contexto

Criar uma aplicacao web para um funil de vendas baseado em quiz diagnostico.

O usuario responde a 5 perguntas, informa seus dados de contato e recebe um diagnostico principal entre 5 areas da vida. Com base nesse diagnostico, o sistema redireciona o lead para uma das 5 VSLs especificas.

Este projeto deve ser construido como aplicacao propria, nao usando Typeform, Outgrow ou outra ferramenta externa de quiz.

## 2. Stack obrigatoria

- Frontend: Next.js hospedado na Vercel.
- Backend: API da propria aplicacao usando rotas serverless/route handlers no ambiente da Vercel.
- Banco de dados: Neon Postgres.
- Deploy: Vercel.
- Persistencia de leads, respostas, resultado do quiz, origem de trafego e eventos principais no Neon.

## 3. Objetivo do produto

Capturar leads qualificados via trafego pago, identificar a principal area de desalinhamento do usuario e direcionar cada lead para a VSL mais adequada.

O funil deve priorizar WhatsApp como canal principal de relacionamento, recuperacao e venda.

## 4. Jornada do usuario

1. Usuario clica em um anuncio.
2. Chega na landing page do quiz.
3. Clica em "Iniciar Diagnostico".
4. Responde 5 perguntas.
5. Preenche nome, email e WhatsApp obrigatorio.
6. Ve tela de loading: "Analisando suas respostas..."
7. E redirecionado para a pagina da VSL correspondente ao diagnostico.
8. Assiste a VSL.
9. Ao assistir 80% da VSL, ve o botao de compra.
10. Clica para comprar a oferta padrao de R$ 497.
11. Pode escolher upgrade opcional para mentoria/VIP de R$ 4.997.
12. Finaliza compra no checkout externo.
13. Apos compra, acessa pagina de obrigado e entra no grupo de WhatsApp correspondente a sua area.

## 5. Areas, diagnosticos e VSLs

O quiz deve gerar exatamente um diagnostico vencedor.

| Area | Diagnostico | Slug | VSL |
|---|---|---|---|
| Saude Fisica | A Fortaleza Comprometida | saude | VSL Saude |
| Controle Emocional | A Mente em Sobrecarga | emocional | VSL Emocional |
| Familia e Lar | O Lar Desalinhado | familia | VSL Familia |
| Espiritual | A Bussola Desconectada | espiritual | VSL Espiritual |
| Profissional/Financeiro | O Potencial Represado | profissional | VSL Profissional |

Os links reais das VSLs devem ficar configuraveis via banco de dados ou variaveis de ambiente.

## 6. Perguntas do quiz

### Pergunta 1

Texto: Para comecarmos, qual e o seu estado civil atual?

Objetivo: segmentacao de copy. Nao pontua no diagnostico.

Opcoes:

- Casado(a)
- Solteiro(a)
- Namorando / Noivo(a)
- Divorciado(a) / Viuvo(a)

### Pergunta 2

Texto: Como voce se sente na maior parte dos seus dias logo ao acordar?

Opcoes:

- Cansado, sem energia fisica e sentindo o corpo pesado. Pontua: saude
- Ansioso, com a mente a mil e ja sobrecarregado antes do dia comecar. Pontua: emocional
- Frustrado com o clima em casa ou preocupado com minha familia. Pontua: familia
- Desconectado de um proposito maior, sentindo um vazio interno. Pontua: espiritual
- Preocupado com boletos, estagnado ou insatisfeito com meu trabalho. Pontua: profissional

### Pergunta 3

Texto: Quando a rotina aperta e falta tempo, o que voce costuma sacrificar primeiro?

Opcoes:

- Minha alimentacao e meus treinos. Pontua: saude
- Minha paciencia; acabo explodindo ou me isolando. Pontua: emocional
- O tempo de qualidade e a atencao com meu conjuge e/ou filhos. Pontua: familia
- Meu tempo com Deus, oracoes e leitura. Pontua: espiritual
- Meus projetos pessoais e o foco no meu crescimento financeiro. Pontua: profissional

### Pergunta 4

Texto: Se voce pudesse resolver um unico problema hoje, qual traria mais paz para a sua vida?

Opcoes:

- Ter saude de ferro, disposicao e o corpo que desejo. Pontua: saude
- Ter blindagem emocional, paz mental e parar de procrastinar. Pontua: emocional
- Ter um lar harmonioso, sem brigas e com conexao real. Pontua: familia
- Ter clareza espiritual e intimidade para ouvir a voz de Deus. Pontua: espiritual
- Ter paz financeira e ser reconhecido pelo meu trabalho. Pontua: profissional

### Pergunta 5

Texto: O quanto voce esta disposto(a) a investir energia para assumir o governo dessa area nos proximos 30 dias?

Objetivo: termometro de intencao. Nao define o diagnostico principal.

Opcoes:

- Totalmente disposto. Nao aceito mais viver como estou hoje.
- Disposto, mas tenho pouco tempo na rotina.
- Quero apenas entender o que esta acontecendo primeiro.

## 7. Regra de pontuacao

Somente as perguntas 2, 3 e 4 pontuam.

Cada resposta soma 1 ponto para sua area.

Vence a area com maior pontuacao.

Em caso de empate, aplicar a seguinte prioridade:

1. espiritual
2. emocional
3. profissional
4. familia
5. saude

O sistema deve salvar:

- respostas completas;
- pontuacao por area;
- diagnostico vencedor;
- pergunta de estado civil;
- resposta do termometro de intencao;
- dados do lead;
- UTMs;
- pagina/VSL de destino.

## 8. Paginas obrigatorias

### 8.1 Landing page do quiz

URL sugerida: `/`

Elementos:

- Headline direta sobre descobrir o ponto de desalinhamento que mais trava a vida do usuario.
- Botao "Iniciar Diagnostico".
- Layout mobile first.
- Carregar UTMs da URL e manter durante toda a jornada.

### 8.2 Fluxo do quiz

URL sugerida: `/quiz`

Requisitos:

- Uma pergunta por tela.
- Barra de progresso.
- Botao de voltar.
- Botao de avancar bloqueado ate selecionar resposta.
- Persistir respostas localmente durante o fluxo.
- Nao enviar lead ao banco antes do opt-in.

### 8.3 Captura de lead

URL sugerida: `/quiz/contato`

Campos:

- Nome completo: obrigatorio.
- Email: obrigatorio e validado.
- WhatsApp: obrigatorio, com mascara brasileira.

Ao enviar:

- validar os dados;
- calcular resultado;
- salvar lead no Neon;
- salvar respostas no Neon;
- disparar evento `lead_captured`;
- redirecionar para tela de loading.

### 8.4 Loading diagnostico

URL sugerida: `/quiz/analisando`

Exibir por 2 a 4 segundos:

"Analisando suas respostas..."

Depois redirecionar para:

`/resultado/[slug]`

### 8.5 Pagina de VSL dinamica

URL sugerida: `/resultado/saude`, `/resultado/emocional`, `/resultado/familia`, `/resultado/espiritual`, `/resultado/profissional`

Cada pagina deve:

- carregar titulo do diagnostico;
- exibir video da VSL correspondente usando player proprio baseado em HTML5 video;
- exibir texto curto de contexto;
- exibir o CTA de compra somente depois que o usuario assistir 80% da VSL;
- registrar quando o usuario atingir 80% da VSL como `vsl_80_percent_viewed`;
- registrar evento `vsl_viewed`;
- registrar clique no CTA como `checkout_clicked`.

O CTA principal deve levar para um link externo da pagina de checkout de vendas da oferta de R$ 497.

Observacao tecnica importante:

- Para o MVP, usar player proprio com a tag `<video>` do HTML5.
- O video deve ficar hospedado fora do repositorio, em um servico de storage/CDN, e ser carregado por URL.
- Nao hospedar arquivos pesados de video dentro do projeto Next.js ou no repositorio.
- O player proprio deve usar os eventos nativos do video para calcular `currentTime / duration` e liberar o CTA quando atingir 80%.
- O sistema deve registrar o evento `vsl_80_percent_viewed` uma unica vez por lead.
- Nao substituir a regra de 80% por timer fixo, exceto como fallback temporario em ambiente de teste.

Recomendacao para reduzir custo no MVP:

- Comecar com player proprio HTML5 + arquivo MP4 hospedado em storage/CDN.
- Evitar contratar player pago antes de validar trafego, retencao e conversao.
- Considerar player pago depois somente se houver necessidade real de adaptive streaming, protecao avancada, analytics detalhado ou estabilidade em alto volume.

### 8.6 Pagina de obrigado

URL sugerida: `/obrigado/[slug]`

Cada area deve ter um link especifico de grupo de WhatsApp.

Elementos:

- Confirmacao da compra.
- Instrucao direta para entrar no grupo de WhatsApp correspondente.
- Botao "Entrar no grupo do WhatsApp".

## 9. Oferta e checkout

Oferta padrao:

- Escola de Governo
- Preco: R$ 497
- Aulas em grupo

Upgrade opcional:

- Mentoria/VIP
- Preco: R$ 4.997
- Deve ser uma escolha ativa do cliente, nao uma imposicao do quiz.

Order bumps:

- Livro
- E-book

Ponto ainda pendente:

Definir como a oferta de R$ 4.997 aparecera:

- Opcao A: comparativo na pagina de vendas;
- Opcao B: opcao dentro do checkout;
- Opcao C: upsell apos compra do plano de R$ 497.

Para a primeira versao tecnica, deixar isso configuravel via URL externa de checkout e nao travar a implementacao do quiz.

## 10. Modelo de dados no Neon

### Tabela `leads`

Campos:

- `id` uuid primary key
- `name` text not null
- `email` text not null
- `whatsapp` text not null
- `marital_status` text
- `intent_level` text
- `winning_area` text not null
- `diagnosis_title` text not null
- `score_saude` integer default 0
- `score_emocional` integer default 0
- `score_familia` integer default 0
- `score_espiritual` integer default 0
- `score_profissional` integer default 0
- `utm_source` text
- `utm_medium` text
- `utm_campaign` text
- `utm_content` text
- `utm_term` text
- `landing_url` text
- `result_url` text
- `created_at` timestamp with time zone default now()

### Tabela `quiz_answers`

Campos:

- `id` uuid primary key
- `lead_id` uuid references leads(id)
- `question_key` text not null
- `question_text` text not null
- `answer_text` text not null
- `score_area` text
- `created_at` timestamp with time zone default now()

### Tabela `events`

Campos:

- `id` uuid primary key
- `lead_id` uuid references leads(id)
- `event_name` text not null
- `event_payload` jsonb
- `created_at` timestamp with time zone default now()

Eventos minimos:

- `quiz_started`
- `quiz_completed`
- `lead_captured`
- `result_generated`
- `vsl_viewed`
- `vsl_80_percent_viewed`
- `checkout_clicked`
- `whatsapp_group_clicked`

## 11. Requisitos de tracking

Capturar UTMs desde a primeira pagina e preservar ate a criacao do lead.

UTMs obrigatorias:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Preparar estrutura para Pixel/CAPI, mas nao bloquear o MVP se as chaves ainda nao existirem.

## 12. Requisitos de UX

- Mobile first.
- Interface limpa, rapida e sem distracoes.
- Uma decisao por tela.
- Botoes grandes e claros.
- Linguagem direta.
- Evitar telas longas.
- O WhatsApp deve parecer parte natural do diagnostico, nao apenas captura comercial.

## 13. Requisitos tecnicos

- Usar TypeScript.
- Usar Next.js App Router.
- Usar componentes reutilizaveis para perguntas, opcoes, progresso e VSL.
- Validar formularios com Zod ou validacao equivalente.
- Usar variaveis de ambiente para URLs sensiveis e string de conexao do Neon.
- Nunca expor credenciais do Neon no frontend.
- Criar API server-side para salvar lead, respostas e eventos.
- Tratar erro de banco com mensagem simples ao usuario.

## 14. Variaveis de ambiente esperadas

- `DATABASE_URL`
- `CHECKOUT_URL_497`
- `CHECKOUT_URL_4997`
- `VSL_URL_SAUDE`
- `VSL_URL_EMOCIONAL`
- `VSL_URL_FAMILIA`
- `VSL_URL_ESPIRITUAL`
- `VSL_URL_PROFISSIONAL`
- `VSL_POSTER_SAUDE`
- `VSL_POSTER_EMOCIONAL`
- `VSL_POSTER_FAMILIA`
- `VSL_POSTER_ESPIRITUAL`
- `VSL_POSTER_PROFISSIONAL`
- `WHATSAPP_GROUP_SAUDE`
- `WHATSAPP_GROUP_EMOCIONAL`
- `WHATSAPP_GROUP_FAMILIA`
- `WHATSAPP_GROUP_ESPIRITUAL`
- `WHATSAPP_GROUP_PROFISSIONAL`

## 15. Criterios de aceite

O MVP esta pronto quando:

- O usuario consegue iniciar e concluir o quiz.
- O sistema calcula corretamente o diagnostico.
- Empates seguem a prioridade definida.
- Nome, email e WhatsApp sao obrigatorios.
- Lead, respostas, pontuacao e UTMs sao salvos no Neon.
- Cada diagnostico abre a VSL correta.
- CTA de checkout aparece somente apos 80% da VSL assistida.
- Evento `vsl_80_percent_viewed` e registrado quando o usuario atinge 80% do video.
- Clique no checkout e no grupo de WhatsApp sao registrados.
- As 5 paginas de resultado funcionam.
- As 5 paginas de obrigado funcionam.
- A aplicacao esta pronta para deploy na Vercel.

## 16. Prompt para o Google AI Studio

Crie uma aplicacao web full stack em Next.js com TypeScript para um quiz diagnostico chamado "Escola de Governo".

Regras obrigatorias:

- O frontend sera hospedado na Vercel.
- O backend deve usar rotas server-side/serverless da propria aplicacao na Vercel.
- O banco de dados sera Neon Postgres.
- Nao use Typeform, Outgrow ou ferramenta externa de quiz.
- O quiz deve ter 5 perguntas.
- As perguntas 2, 3 e 4 definem o diagnostico entre 5 areas: saude, emocional, familia, espiritual e profissional.
- A pergunta 1 serve para segmentacao de estado civil.
- A pergunta 5 serve como termometro de intencao.
- Depois do quiz, capture nome, email e WhatsApp obrigatorio.
- Salve no Neon: lead, respostas, pontuacao, diagnostico, UTMs e eventos.
- Redirecione o lead para uma das 5 paginas de VSL com base no diagnostico.
- Cada VSL deve usar player proprio HTML5.
- Cada VSL deve ter CTA de checkout que aparece somente quando o usuario assistir 80% do video, calculando `currentTime / duration`.
- O CTA deve enviar o usuario para um link externo de checkout de vendas.
- Cada area deve ter pagina de obrigado com grupo de WhatsApp especifico.
- Use layout mobile first, simples e direto.

Implemente tambem:

- Schema SQL para Neon.
- API para salvar lead e respostas.
- API para registrar eventos.
- Componentes do quiz.
- Paginas `/`, `/quiz`, `/quiz/contato`, `/quiz/analisando`, `/resultado/[slug]` e `/obrigado/[slug]`.
- Validacao de formulario.
- Captura e preservacao de UTMs.
- Variaveis de ambiente para URLs de VSL, checkout, grupos de WhatsApp e banco Neon.

Use o PRD acima como fonte de verdade para perguntas, respostas, diagnosticos, regras de empate e criterios de aceite.
