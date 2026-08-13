import { ProjectDefinition } from '../project-content.model';

export const VIGILIA: ProjectDefinition = {
  id: 'vigilia',
  icon: '📡',
  stack: [
    'TypeScript 5.6',
    'NestJS 10 + Fastify',
    'Python 3.12',
    'Next.js 15',
    'React 19',
    'PostgreSQL + pgvector',
    'Drizzle ORM',
    'Redis Streams',
    'Claude Haiku 4.5',
    'XLM-RoBERTa',
    'spaCy',
    'sentence-transformers',
    'Terraform',
    'Fly.io'
  ],
  content: {
    pt: {
      name: 'Vigília',
      tagline:
        'SaaS multi-tenant que mede opinião pública com amostra e confiança declaradas — IA híbrida com modelos locais e conformidade LGPD como teste executável.',
      subtitle:
        'Plataforma de inteligência de opinião pública — monólito modular NestJS com pool de workers Python, IA híbrida e governança verificada por CI',
      role: 'Arquitetura e desenvolvimento full stack',
      summary:
        'Plataforma que monitora a conversa pública sobre um assunto, mede o que as pessoas de um lugar realmente pensam sobre ele — com amostra, fontes e grau de confiança declarados em cada número — e assiste o operador a decidir que posição tomar. Em 616 commits e mais de 80 sprints, o produto saiu de "monitorar menções" para "medir opinião", o que exigiu reestruturar o modelo de domínio inteiro sem derrubar o que já rodava em produção.',
      architecture: [
        {
          title: 'Monólito modular com dois pools de processo',
          content:
            'Uma API NestJS sobre Fastify com 24 módulos e 140 rotas, e um pool de 25 tarefas asyncio em Python, desacoplados por Redis Streams. As fronteiras de módulo são reais e verificadas por lint: nenhum módulo importa o diretório interno de outro. A escolha de não usar microsserviços é justificada por números medidos, não por preferência — o pico voltado ao usuário é de fração de requisição por segundo, e a complexidade do sistema vem de compliance e multi-tenancy, não de throughput.'
        },
        {
          title: 'Schema canônico único em duas linguagens',
          content:
            'O schema vive em Drizzle, do lado da API. Os workers Python não definem mappers ORM e não têm sistema de migration próprio — rodam SQL cru contra tabelas que a API é dona. Um único sistema de migration para o monólito inteiro. O custo é perder tipagem de ORM no Python; o ganho é o fim da divergência de schema entre duas linguagens.'
        },
        {
          title: 'Isolamento multi-tenant em profundidade',
          content:
            'Vinte e nove tabelas com Row Level Security e trinta e quatro políticas, todas chaveadas na identidade do operador definida por transação. A defesa não para aí: uma regra de ESLint customizada verifica por análise da árvore sintática que nenhuma query toca tabela multi-tenant fora do contexto de operador. E um job de CI dedicado sobe um Postgres real e exige que consultas cross-tenant devolvam zero linhas.'
        },
        {
          title: 'Append-only garantido por GRANT, não por convenção',
          content:
            'A trilha de auditoria, os eventos de medição de uso e o razão de créditos recebem apenas SELECT e INSERT no nível de papel do banco, reforçados por triggers. Cinco papéis Postgres distintos com grants separados, verificados por teste ponta a ponta. É auditoria que a aplicação não consegue apagar.'
        },
        {
          title: 'Eventos com vocabulário fechado',
          content:
            'Todo tipo de evento é registrado numa tabela de vocabulário e exige teste de contrato antes de poder ser publicado. A fila está envolvida num port fino — trocar Redis Streams por outra tecnologia não muda nada fora do adaptador. Retry com backoff, circuit breaker e dead-letter queue com console administrativo e replay auditado.'
        },
        {
          title: 'Uma exceção de IPC, codificada e justificada',
          content:
            'A regra de não usar HTTP em loopback vale entre módulos. Entre serviços existe uma exceção estreita: a classificação de entidade que bloqueia o operador na criação de um assunto roda por chamada síncrona autenticada por HMAC, com rate limit, orçamento de latência declarado e acesso somente leitura ao estado compartilhado. O motivo é concreto — duplicar os modelos de NLP no processo Node custaria perto de um gigabyte.'
        }
      ],
      diagrams: [
        {
          id: 'vigilia-architecture',
          src: '/diagrams/vigilia-architecture',
          title: 'Arquitetura do sistema',
          caption:
            'Os dois pools de processo, os modelos locais dentro do worker e os dois pontos onde o LLM entra. Note a nota sobre os modelos locais: o dado sensível do operador não pode deixar o processo, e isso determinou a arquitetura de embeddings.',
          kind: 'component'
        },
        {
          id: 'vigilia-narrative-pipeline',
          src: '/diagrams/vigilia-narrative-pipeline',
          title: 'Do comentário à narrativa nomeada',
          caption:
            'A esteira de IA híbrida. Todo o trabalho pesado — sentimento, entidades, vetores de significado, agrupamento — roda localmente. O LLM entra apenas no fim, para nomear um grupo já formado, e sob teto de custo.',
          kind: 'sequence'
        }
      ],
      flows: [
        {
          title: 'Da coleta do comentário à narrativa nomeada',
          content:
            'O coletor grava publicação e reação em tabelas distintas, com a identidade do autor em hash com sal. O sentimento é classificado localmente e o resultado abaixo do limiar de confiança é marcado para revisão. As entidades são extraídas e a região é inferida por dois sinais que nunca são fundidos. Cada fala vira uma linha com tipo e vetor de significado. As falas da janela são agrupadas por similaridade, e só um grupo com evidência suficiente ganha um nome do LLM.'
        },
        {
          title: 'Do número bruto à leitura com confiança declarada',
          content:
            'Para cada combinação de assunto, lugar, janela e camada, o ciclo calcula seis métricas — incluindo peso de apoio, que soma as curtidas dos comentários, porque um comentário com oitocentas curtidas não vale um. Os valores são normalizados pela população, e a função devolve nulo, nunca zero, quando o denominador é desconhecido. A camada de confiança usa pisos conjuntivos de amostra e de fontes distintas.'
        },
        {
          title: 'Da decisão do operador à estratégia exportada',
          content:
            'O operador marca as histórias que importam, escolhe a posição e escreve um briefing. O sistema monta o contexto, passa cada trecho de terceiro pelo filtro de injeção e cerca em tags. A reserva de crédito e o débito acontecem na mesma transação, antes da chamada. A saída vem por tool-calling forçado, é validada duas vezes, passa por um filtro de conformidade determinístico e vira cinco cards. A exportação é a fronteira do sistema.'
        },
        {
          title: 'Do score ao alerta em tempo real',
          content:
            'O score de importância é recalculado por assunto e janela, com o detalhamento por componente persistido em JSON para auditoria. O disparo de alerta é por borda, não por nível — só cruzar o limiar para cima gera alerta. O evento sobe por Redis Streams até um relay SSE na API, e o navegador consome por um multiplexador singleton sobre uma única conexão. O orçamento de latência é de dois minutos do cálculo ao badge.'
        }
      ],
      ai: {
        title: 'IA híbrida com governança verificada por CI',
        summary:
          'O trabalho pesado de análise roda em modelos locais calibrados por medição; o LLM é reservado a quatro tarefas generativas estreitas. Essa separação não é acidental — é decisão de arquitetura escrita, com prova de conformidade e gate de CI que bloqueia merge. O projeto também é explícito sobre onde não usa IA, o que é raro e é sinal de maturidade.',
        points: [
          {
            title: 'Modelos locais fazem o trabalho pesado',
            content:
              'Sentimento em português roda em XLM-RoBERTa local, com conjunto de validação versionado e harness de benchmark próprio: 86,4% de acurácia em 220 menções reais. A resposta ao modo de falha identificado não foi trocar de modelo — foi subir o limiar de confiança e marcar a banda de dúvida para revisão humana. Entidades vêm de spaCy com bandas de confiança, e abaixo do piso o pipeline não emite nada em vez de chutar.'
          },
          {
            title: 'Embeddings locais por imposição regulatória',
            content:
              'O campo de posicionamento político do operador é dado sensível. Isso tornou API hospedada de embedding uma violação de restrição rígida, não uma opção mais cara. Os vetores de 512 dimensões são gerados dentro do worker e guardados em pgvector no próprio Postgres — vector store dedicado foi rejeitado porque o volume total cabe em poucos megabytes, e subir um seria over-engineering de duas ordens de grandeza.'
          },
          {
            title: 'Limiares calibrados por medição, contra a intuição',
            content:
              'O limiar de agrupamento de narrativas era 0,75, herdado do domínio de imprensa. Medido sobre 24 mil pares de comentários reais, a mediana de similaridade entre comentários era 0,079 e o percentil 99,9 era 0,694 — o limiar estava acima do p99,9 e praticamente nunca disparava. Baixar para 0,60 levou um quarto das falas a narrativas distintas, validadas por inspeção humana. O domínio de imprensa mantém 0,75, com sua própria tabela de calibração.'
          },
          {
            title: 'O LLM lê grupos, nunca itens',
            content:
              'O agrupamento por vetor local acontece antes, e o modelo só nomeia o grupo formado. Um assunto com cinco mil falas custa seis a dez chamadas, não cinco mil. Combinado com um claim distribuído que impede a varredura agendada e o consumer de duplicarem gasto, e com um teto de rótulos por ciclo, isso transforma um custo proibitivo em item de orçamento previsível.'
          },
          {
            title: 'Saída estruturada: fora do contrato é erro',
            content:
              'Todas as chamadas usam tool-calling forçado. A extração lança exceção se o bloco esperado não vier — resposta livre é erro, nunca fallback. Do lado da API, o schema da estratégia é validado duas vezes: pelo schema da ferramenta no provedor e por um schema Zod compartilhado entre backend e frontend.'
          },
          {
            title: 'Defesa contra prompt injection espelhada em duas linguagens',
            content:
              'Os padrões de injeção vivem em TypeScript e Python simultaneamente, e um teste de contrato lê o arquivo da outra linguagem e falha o CI se as duas listas divergirem. Todo trecho de terceiro entra truncado, redigido, limpo de caracteres de controle e cercado em tags, com o system prompt declarando explicitamente que aquilo é dado a resumir, nunca instrução. Prompt e resposta estão na lista de redação do logger — entrada e saída do modelo nunca são registradas.'
          },
          {
            title: 'Filtro de conformidade determinístico sobre a saída',
            content:
              'Um pós-filtro roda sobre cada card gerado e rejeita conteúdo de ataque e mira por categoria protegida. É deliberadamente lista de palavras, não julgamento semântico: um guarda de conformidade precisa ser auditável e dar o mesmo veredito toda vez. A regra exige três condições simultâneas — a versão anterior, que exigia só coocorrência, tornava assuntos de saúde e religião inutilizáveis e recusava a cada tentativa cobrando o crédito.'
          },
          {
            title: 'Governança de custo no padrão de sistema financeiro',
            content:
              'Reserva de crédito, chamada ao provedor, e liquidação no bloco final com a contagem real de tokens do provedor — ou estorno automático com motivo legível se a chamada falhou. Débito e evento na mesma transação. Dois tetos com posturas de falha opostas e intencionais: o de LLM falha aberto, para que a feature degrade em vez de sumir; o de coleta paga falha fechado, para proteger o gasto.'
          },
          {
            title: 'Conformidade como teste executável',
            content:
              'Um gate de CI varre a árvore e reprova qualquer chamada ao provedor sem referência ao ADR que a autoriza, ou qualquer geração visível ao operador que escape do teto de custo. Um teste muda o posicionamento político do operador e exige que a ordem das menções dentro de um assunto continue idêntica — a prova executável de que personalização não virou microtargeting. Outro quebra de propósito se um sexto sinal aparecer na fórmula de importância.'
          },
          {
            title: 'Onde a inteligência não é IA',
            content:
              'O score de importância é soma ponderada de cinco sinais puros, com pesos que falham o boot se não somarem um. Um ranker aprendido foi rejeitado por três razões escritas: não há dado de engajamento suficiente, há risco do gradiente aprender proxies de categoria protegida, e a auditoria de conformidade fica muito mais difícil. As frases do painel de divergência são escritas por regra — nenhum modelo participa, e nenhum texto capturado de terceiro chega até lá.'
          }
        ]
      },
      decisions: [
        {
          title: 'Provedor único de LLM, reforçado em três camadas',
          content:
            'Expandir para múltiplos provedores exigiria mudar o escopo de compliance. A interface de cliente existe para permitir troca futura, mas o ADR diz explicitamente para não usá-la para introduzir alternativas silenciosamente. A regra é reforçada por gate de CI, por uma allowlist de egresso que recusa qualquer host fora da lista na camada de rede, e por revisão.'
        },
        {
          title: 'Fórmula auditável em vez de ranker aprendido',
          content:
            'Soma ponderada transparente com A/B por coorte de assunto, nunca por operador. O trade-off assumido é abrir mão de ganho de relevância por aprendizado, em troca de poder explicar por que um item ficou onde ficou — que é exatamente o que uma auditoria de conformidade pergunta.'
        },
        {
          title: 'Dois sinais geográficos que nunca se fundem',
          content:
            'A região do veículo e a região inferida do texto são mantidas separadas. Fundir os dois num campo só produziria um número que parece preciso e não é. Abaixo do limiar de confiança, nada é emitido — o pipeline não chuta.'
        },
        {
          title: 'Terraform completo e dormente',
          content:
            'A stack AWS está escrita, fatorada e pronta em dezesseis arquivos, com WAF, KMS, log group de auditoria protegido contra destruição e deploy por OIDC sem chave de longa duração. O cut-over foi deliberadamente adiado e o produto roda em três máquinas Fly.io. A decisão está registrada com o gatilho que a reabre.'
        },
        {
          title: 'Feature flags como variável de ambiente revisável',
          content:
            'O comentário no arquivo de configuração diz o motivo: valor que só existe no CLI é valor que ninguém revisa — foi exatamente assim que a coleta de tendências ficou meses desligada sem ninguém notar.'
        }
      ],
      challenges: [
        {
          title: 'Um modelo de dados que estava mentindo',
          content:
            'A primeira versão guardava uma matéria de jornal e um comentário de uma palavra na mesma tabela, com os mesmos campos. Isso impedia o produto de responder à pergunta central do cliente: não dá para dizer quanta gente pensa alguma coisa quando o sistema não distingue um jornalista escrevendo de oitocentas pessoas concordando. A separação foi feita com migração de dados e script de rollback, sem derrubar produção.'
        },
        {
          title: 'Um bug de unicidade que subestimava toda contagem',
          content:
            'A URL de origem de um comentário era montada com os primeiros caracteres do texto, sob uma restrição de unicidade. Dois comentários começando igual colidiam e um era descartado em silêncio. Encontrado por leitura de código, e documentado com a consequência dita em voz alta: toda contagem feita com os dados anteriores está subestimada por esse motivo.'
        },
        {
          title: 'Um filtro de conformidade que recusava o uso legítimo',
          content:
            'A regra original exigia apenas coocorrência de termo protegido e geografia. Um assunto chamado "Autismo" punha o termo em todo card por definição, e o prompt ordenava uma região real no campo de alcance. Resultado: saúde, religião e política ficaram inutilizáveis, cobrando crédito a cada recusa. A correção foi de duas pontas — a regra passou a exigir três ingredientes, e o prompt parou de entregar o segundo de graça.'
        },
        {
          title: 'Um teto de custo que cobrava e não entregava',
          content:
            'O veredito de recusa não devolvia card nenhum, e o chamador descartava a estratégia inteira depois de os créditos terem sido debitados. Um cliente perdeu quarenta créditos em duas recusas idênticas em uma hora. Hoje os cards sempre voltam, marcados individualmente, e o teto tem estorno automático.'
        },
        {
          title: 'Um worker que travou o event loop por dezesseis minutos',
          content:
            'Codificar centenas de títulos um a um com sentence-transformers é operação síncrona dentro do laço assíncrono — nenhum outro worker registrou nada nesse período. Corrigido com execução em thread separada e leitura em streaming. A máquina maior foi documentada explicitamente como folga para o próximo pico, e não como o conserto.'
        },
        {
          title: 'Um boot de onze minutos que a plataforma matava',
          content:
            'Os workers carregam três modelos de um cache de object storage no boot. O health check tinha período de carência curto, então a máquina era morta enquanto ainda inicializava, em loop. A correção está escrita no arquivo de configuração com o raciocínio, e o endpoint de prontidão devolve um erro explícito com o motivo enquanto o cache não aquece.'
        },
        {
          title: 'Salvar o banco de desenvolvimento de si mesmo',
          content:
            'A conta real de desenvolvimento local foi apagada três vezes por limpeza descuidada de teste. A resposta foi um gate de CI que bloqueia merge e proíbe comandos de remoção sem escopo em arquivos de teste, mais um helper compartilhado que protege por hash de identificação.'
        }
      ],
      metrics: [
        { label: 'Linhas de código', value: '~202k' },
        { label: 'Commits', value: '616' },
        { label: 'Rotas REST', value: '140' },
        { label: 'Migrations', value: '146' },
        { label: 'Arquivos de teste', value: '~485' },
        { label: 'ADRs formais', value: '29' }
      ],
      screenshots: []
    },
    en: {
      name: 'Vigília',
      tagline:
        'Multi-tenant SaaS measuring public opinion with declared sample and confidence — hybrid AI with local models and data protection compliance as an executable test.',
      subtitle:
        'Public opinion intelligence platform — NestJS modular monolith with a Python worker pool, hybrid AI and CI-verified governance',
      role: 'Architecture and full stack development',
      summary:
        'A platform that monitors public conversation about a subject, measures what people in a given place actually think about it — with sample size, sources and confidence declared on every number — and helps the operator decide what position to take. Across 616 commits and more than 80 sprints, the product moved from "monitor mentions" to "measure opinion", which required restructuring the entire domain model without taking down what was already running in production.',
      architecture: [
        {
          title: 'Modular monolith with two process pools',
          content:
            'A NestJS API on Fastify with 24 modules and 140 routes, plus a pool of 25 asyncio tasks in Python, decoupled by Redis Streams. Module boundaries are real and lint-verified: no module imports another module internal directory. The decision not to use microservices is justified by measured numbers rather than preference — user-facing peak is a fraction of a request per second, and system complexity comes from compliance and multi-tenancy, not throughput.'
        },
        {
          title: 'A single canonical schema across two languages',
          content:
            'The schema lives in Drizzle, on the API side. Python workers define no ORM mappers and have no migration system of their own — they run raw SQL against tables the API owns. One migration system for the entire monolith. The cost is losing ORM typing in Python; the gain is the end of schema divergence between two languages.'
        },
        {
          title: 'Multi-tenant isolation in depth',
          content:
            'Twenty-nine tables with Row Level Security and thirty-four policies, all keyed on the operator identity set per transaction. The defense does not stop there: a custom ESLint rule verifies through syntax-tree analysis that no query touches a multi-tenant table outside operator context. And a dedicated CI job starts a real Postgres and requires cross-tenant queries to return zero rows.'
        },
        {
          title: 'Append-only guaranteed by GRANT, not by convention',
          content:
            'The audit trail, usage metering events and the credit ledger receive only SELECT and INSERT at the database role level, reinforced by triggers. Five distinct Postgres roles with separate grants, verified by an end-to-end test. This is auditing the application cannot delete.'
        },
        {
          title: 'Events with a closed vocabulary',
          content:
            'Every event type is registered in a vocabulary table and requires a contract test before it can be published. The queue sits behind a thin port — swapping Redis Streams for another technology changes nothing outside the adapter. Retry with backoff, circuit breaker, and a dead-letter queue with an admin console and audited replay.'
        },
        {
          title: 'One IPC exception, codified and justified',
          content:
            'The no-loopback-HTTP rule holds between modules. Between services there is a narrow exception: the entity classification that blocks the operator when creating a subject runs as a synchronous call authenticated by HMAC, with rate limiting, a declared latency budget and read-only access to shared state. The reason is concrete — duplicating the NLP models in the Node process would cost close to a gigabyte.'
        }
      ],
      diagrams: [
        {
          id: 'vigilia-architecture',
          src: '/diagrams/vigilia-architecture',
          title: 'System architecture',
          caption:
            'The two process pools, the local models inside the worker and the two places the LLM enters. Note the local-models annotation: sensitive operator data cannot leave the process, and that determined the embedding architecture.',
          kind: 'component'
        },
        {
          id: 'vigilia-narrative-pipeline',
          src: '/diagrams/vigilia-narrative-pipeline',
          title: 'From comment to named narrative',
          caption:
            'The hybrid AI pipeline. All the heavy work — sentiment, entities, meaning vectors, clustering — runs locally. The LLM only enters at the end, to name an already-formed group, and under a cost cap.',
          kind: 'sequence'
        }
      ],
      flows: [
        {
          title: 'From collected comment to named narrative',
          content:
            'The collector stores publication and reaction in separate tables, with author identity salted and hashed. Sentiment is classified locally and results below the confidence threshold are flagged for review. Entities are extracted and region is inferred from two signals that are never merged. Each utterance becomes a row with a type and a meaning vector. Utterances in the window are clustered by similarity, and only a group with enough evidence earns a name from the LLM.'
        },
        {
          title: 'From raw number to a reading with declared confidence',
          content:
            'For every combination of subject, place, window and layer, the cycle computes six metrics — including support weight, which sums comment likes, because a comment with eight hundred likes is not worth one. Values are normalized by population, and the function returns null, never zero, when the denominator is unknown. The confidence tier uses conjunctive floors on sample size and distinct sources.'
        },
        {
          title: 'From operator decision to exported strategy',
          content:
            'The operator marks the stories that matter, picks a position and writes a briefing. The system assembles context, runs every third-party excerpt through the injection filter and fences it in tags. Credit reservation and debit happen in the same transaction, before the call. Output comes back through forced tool-calling, is validated twice, passes a deterministic compliance filter and becomes five cards. Export is the boundary of the system.'
        },
        {
          title: 'From score to real-time alert',
          content:
            'The importance score is recomputed per subject and window, with the per-component breakdown persisted as JSON for audit. Alert firing is edge-triggered, not level-triggered — only crossing the threshold upward produces an alert. The event travels through Redis Streams to an SSE relay in the API, and the browser consumes it through a singleton multiplexer over a single connection. The latency budget is two minutes from computation to badge.'
        }
      ],
      ai: {
        title: 'Hybrid AI with CI-verified governance',
        summary:
          'The heavy analysis work runs on locally hosted models calibrated by measurement; the LLM is reserved for four narrow generative tasks. That separation is not accidental — it is a written architectural decision, with a compliance proof and a merge-blocking CI gate. The project is also explicit about where it does not use AI, which is rare and is a maturity signal.',
        points: [
          {
            title: 'Local models do the heavy lifting',
            content:
              'Portuguese sentiment runs on a local XLM-RoBERTa, with a versioned validation set and a purpose-built benchmark harness: 86.4% accuracy on 220 real mentions. The answer to the identified failure mode was not switching models — it was raising the confidence threshold and flagging the uncertainty band for human review. Entities come from spaCy with confidence bands, and below the floor the pipeline emits nothing rather than guessing.'
          },
          {
            title: 'Local embeddings by regulatory constraint',
            content:
              'The operator political positioning field is regulated sensitive data. That made a hosted embedding API a hard-constraint violation, not a more expensive option. The 512-dimension vectors are generated inside the worker and stored in pgvector in Postgres itself — a dedicated vector store was rejected because the total volume fits in a few megabytes, and standing one up would be two orders of magnitude of over-engineering.'
          },
          {
            title: 'Thresholds calibrated by measurement, against intuition',
            content:
              'The narrative clustering threshold was 0.75, inherited from the press domain. Measured over 24,000 real comment pairs, median similarity between comments was 0.079 and the 99.9th percentile was 0.694 — the threshold sat above p99.9 and could essentially never fire. Lowering it to 0.60 moved a quarter of utterances into distinct narratives, validated by human inspection. The press domain keeps 0.75, with its own calibration table.'
          },
          {
            title: 'The LLM reads groups, never items',
            content:
              'Local vector clustering happens first, and the model only names the formed group. A subject with five thousand utterances costs six to ten calls, not five thousand. Combined with a distributed claim preventing the scheduled sweep and the consumer from double-spending, and a cap on labels per cycle, this turns a prohibitive cost into a predictable budget line.'
          },
          {
            title: 'Structured output: off-contract is an error',
            content:
              'Every call uses forced tool-calling. Extraction throws if the expected block does not arrive — a free-form answer is an error, never a fallback. On the API side the strategy schema is validated twice: by the provider tool schema and by a Zod schema shared between backend and frontend.'
          },
          {
            title: 'Prompt injection defense mirrored across two languages',
            content:
              'Injection patterns live in TypeScript and Python simultaneously, and a contract test reads the other language file and fails CI if the two lists diverge. Every third-party excerpt enters truncated, redacted, stripped of control characters and fenced in tags, with the system prompt explicitly declaring it is data to summarize, never instruction. Prompt and completion are on the logger redaction list — model input and output are never logged.'
          },
          {
            title: 'A deterministic compliance filter over the output',
            content:
              'A post-filter runs on every generated card and rejects attack content and targeting by protected category. It is deliberately a word list rather than semantic judgment: a compliance guard has to be auditable and return the same verdict every time. The rule requires three simultaneous conditions — the earlier version, requiring only co-occurrence, made health and religion subjects unusable and refused on every attempt while still charging the credit.'
          },
          {
            title: 'Cost governance in a financial-systems pattern',
            content:
              'Credit reservation, provider call, then settlement in the finally block with the real token counts from the provider — or automatic refund with a readable reason if the call failed. Debit and event in the same transaction. Two caps with deliberately opposite failure postures: the LLM cap fails open, so the feature degrades rather than disappearing; the paid-collection cap fails closed, to protect spend.'
          },
          {
            title: 'Compliance as an executable test',
            content:
              'A CI gate sweeps the tree and fails any provider call without a reference to the ADR authorizing it, or any operator-visible generation that escapes the cost cap. One test changes the operator political positioning and requires that the ordering of mentions inside a subject stays identical — the executable proof that personalization did not become microtargeting. Another breaks on purpose if a sixth signal appears in the importance formula.'
          },
          {
            title: 'Where the intelligence is not AI',
            content:
              'The importance score is a weighted sum of five pure signals, with weights that fail boot if they do not add to one. A learned ranker was rejected for three written reasons: there is not enough engagement data, there is risk of the gradient learning protected-category proxies, and compliance auditing becomes much harder. The divergence panel sentences are written by rule — no model participates, and no captured third-party text ever reaches them.'
          }
        ]
      },
      decisions: [
        {
          title: 'A single LLM provider, enforced in three layers',
          content:
            'Expanding to multiple providers would change the compliance scope. A client interface exists to allow a future swap, but the ADR explicitly says not to use it to introduce alternatives quietly. The rule is enforced by a CI gate, by an egress allowlist that refuses any host outside the list at the network layer, and by review.'
        },
        {
          title: 'An auditable formula instead of a learned ranker',
          content:
            'A transparent weighted sum with A/B testing by subject cohort, never by operator. The accepted trade-off is giving up relevance gains from learning, in exchange for being able to explain why an item ranked where it did — which is exactly what a compliance audit asks.'
        },
        {
          title: 'Two geographic signals that never merge',
          content:
            'The outlet region and the region inferred from text are kept separate. Merging them into one field would produce a number that looks precise and is not. Below the confidence threshold nothing is emitted — the pipeline does not guess.'
        },
        {
          title: 'Terraform complete and dormant',
          content:
            'The AWS stack is written, well factored and ready across sixteen files, with WAF, KMS, an audit log group protected against destruction and OIDC deploys with no long-lived key. Cut-over was deliberately deferred and the product runs on three Fly.io machines. The decision is recorded with the trigger that reopens it.'
        },
        {
          title: 'Feature flags as reviewable environment configuration',
          content:
            'The comment in the configuration file states the reason: a value that exists only in the CLI is a value nobody reviews — that is exactly how trend collection sat switched off for months without anyone noticing.'
        }
      ],
      challenges: [
        {
          title: 'A data model that was lying',
          content:
            'The first version stored a newspaper article and a one-word comment in the same table, with the same fields. That stopped the product from answering the client central question: you cannot say how many people think something when the system does not distinguish one journalist writing from eight hundred people agreeing. The split was done with data migration and a rollback script, without taking production down.'
        },
        {
          title: 'A uniqueness bug that undercounted everything',
          content:
            'The source URL for a comment was assembled using the first characters of its text, under a uniqueness constraint. Two comments starting the same way collided and one was silently dropped. Found by reading code, and documented with the consequence stated out loud: every count taken with the earlier data is undercounted for this reason.'
        },
        {
          title: 'A compliance filter that refused legitimate use',
          content:
            'The original rule required only co-occurrence of a protected term and geography. A subject named "Autism" put the term in every card by definition, and the prompt mandated a real region in the reach field. The result: health, religion and politics became unusable, charging credit on every refusal. The fix came from both ends — the rule now requires three ingredients, and the prompt stopped supplying the second one for free.'
        },
        {
          title: 'A cost cap that charged and delivered nothing',
          content:
            'The refusal verdict returned no cards, and the caller discarded the entire strategy after the credits had already been debited. One client lost forty credits to two identical refusals within an hour. Cards now always come back, marked individually, and the cap has automatic refund.'
        },
        {
          title: 'A worker that blocked the event loop for sixteen minutes',
          content:
            'Encoding hundreds of titles one by one with sentence-transformers is a synchronous operation inside the async loop — no other worker recorded anything during that time. Fixed with execution in a separate thread and streaming reads. The larger machine was documented explicitly as headroom for the next peak, not as the fix.'
        },
        {
          title: 'An eleven-minute boot the platform kept killing',
          content:
            'Workers load three models from an object-storage cache at boot. The health check had a short grace period, so the machine was killed while still initializing, in a loop. The fix is written into the configuration file with the reasoning, and the readiness endpoint returns an explicit error with the reason while the cache warms.'
        },
        {
          title: 'Saving the development database from itself',
          content:
            'The real local development account was wiped three times by careless test cleanup. The answer was a merge-blocking CI gate forbidding unscoped removal commands in test files, plus a shared helper that guards by identity hash.'
        }
      ],
      metrics: [
        { label: 'Lines of code', value: '~202k' },
        { label: 'Commits', value: '616' },
        { label: 'REST routes', value: '140' },
        { label: 'Migrations', value: '146' },
        { label: 'Test files', value: '~485' },
        { label: 'Formal ADRs', value: '29' }
      ],
      screenshots: []
    }
  }
};
