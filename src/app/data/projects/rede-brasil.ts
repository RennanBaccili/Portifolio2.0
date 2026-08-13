import { ProjectDefinition } from '../project-content.model';

export const REDE_BRASIL: ProjectDefinition = {
  id: 'rede-brasil',
  icon: '🕸️',
  stack: [
    'TypeScript 5.5',
    'NestJS 10',
    'React 18',
    'Vite + PWA',
    'PostgreSQL 15',
    'Prisma',
    'pg-boss',
    'Zod',
    'Cytoscape.js',
    'MapLibre GL',
    'Claude Sonnet',
    'Whisper',
    'Fly.io'
  ],
  content: {
    pt: {
      name: 'REDE BRASIL',
      tagline:
        'Plataforma B2G de inteligência relacional — grafo institucional, dossiês gerados por IA com streaming e compliance LGPD implementado como invariante de código.',
      subtitle:
        'Inteligência relacional B2G — monorepo TypeScript com grafo em Postgres, IA sob governança verificável e audit log imutável',
      role: 'Arquitetura e desenvolvimento full stack',
      summary:
        'Plataforma que transforma o capital relacional disperso de uma organização — planilhas, agendas, contatos e memória individual — em um grafo institucional navegável. Inclui captura de interações por áudio com transcrição, dossiês de agentes públicos gerados por LLM sobre fontes oficiais, e comunicação em massa sob governança LGPD. Entregue sob contrato comercial, com as fases 1 e 2 em produção.',
      architecture: [
        {
          title: 'Monólito modular com uma única fronteira externa',
          content:
            'Monorepo pnpm com apps/api (NestJS, 30 módulos, 256 endpoints), apps/web (React + Vite, PWA) e packages/shared com schemas Zod isomórficos — a mesma validação roda nos DTOs do backend e nos formulários do frontend. A decisão de manter monólito em vez de microsserviços está registrada em ADR e é justificada pelo perfil do time e pela necessidade de um audit log único e centralizado.'
        },
        {
          title: 'Gateway de integração: o sistema é consumer-only',
          content:
            'Nenhum provedor externo é chamado diretamente. Anthropic, OpenAI, Resend, Twilio, Meta WhatsApp, ReceitaWS, DOU, CGU — tudo passa por um integrations-service separado, comunicado via REST com assinatura HMAC. Isso concentra segredos, rate limit, cache e auditoria de saída em um só lugar. A API do produto nunca detém chaves de provedor de IA.'
        },
        {
          title: 'Grafo relacional dentro do PostgreSQL',
          content:
            'Path-finding entre pessoas usa CTE recursiva no próprio Postgres, sem introduzir banco de grafos na stack. A CTE materializa o grafo bidirecional já com os filtros aplicados no nível da aresta, faz busca em largura acumulando o caminho, e previne ciclos verificando se o próximo nó já está no caminho acumulado. Entrega caminho, ponte e ego-subgrafo até cinco saltos.'
        },
        {
          title: 'Audit log imutável por privilégio de banco',
          content:
            'A trilha de auditoria é WORM por REVOKE de UPDATE, DELETE e TRUNCATE no PostgreSQL. O worker que escreve usa um pool separado com um role que só tem INSERT. Mesmo com escalação de privilégio dentro do processo Node, o log permanece imutável — a garantia mora no banco, não no código da aplicação. Um smoke test automatizado tenta violar a regra e falha o deploy se o REVOKE regredir.'
        },
        {
          title: 'Filas sobre o próprio Postgres',
          content:
            'pg-boss substitui Redis para jobs assíncronos: gravação do audit log, detectores de alerta e campanhas agendadas. Uma dependência de infraestrutura a menos, ao custo de um teto de throughput que o perfil de carga do produto não alcança.'
        },
        {
          title: 'Compliance como invariante estrutural',
          content:
            'O produto opera sob LGPD, Lei Anticorrupção e resoluções do TSE/ANPD. Os campos sensíveis do Art. 11 não têm coluna no schema Prisma — a proibição é ausência estrutural, não permissão negada. A mesma regra é defendida em cinco camadas independentes: o importador rejeita, o refinement Zod rejeita, o serviço de contatos rejeita, a ingestão do RAG rejeita, e o system prompt do LLM proíbe.'
        }
      ],
      diagrams: [
        {
          id: 'redebrasil-architecture',
          src: '/diagrams/redebrasil-architecture',
          title: 'Arquitetura e fronteira de integração',
          caption:
            'O monorepo, o gateway externo que media toda saída, e os dois roles distintos do Postgres. Destaque para o ponto onde o mascaramento de dados sensíveis acontece: antes de qualquer prompt deixar o perímetro.',
          kind: 'component'
        },
        {
          id: 'redebrasil-dossier-stream',
          src: '/diagrams/redebrasil-dossier-stream',
          title: 'Geração de dossiê com streaming SSE',
          caption:
            'O fluxo-assinatura do produto. Note a ordem: o budget gate roda antes de abrir o stream, as etapas de pesquisa emitem apenas rótulo e contagem, e a persistência acontece uma única vez, no evento de conclusão bem-sucedida.',
          kind: 'sequence'
        }
      ],
      flows: [
        {
          title: 'Dossiê de agente público com streaming ao vivo',
          content:
            'O pesquisador aciona a geração e recebe texto token a token. Antes de abrir o stream, o sistema valida papel, existência do contato e orçamento de IA. Depois faz retrieval BM25 sobre os documentos indexados daquele contato, consulta quatro fontes públicas uma a uma, e só então abre o stream com o LLM. O resultado é um JSON de doze seções validado por schema — ordem e cardinalidade conferidas — e persistido como nova versão com status não revisado.'
        },
        {
          title: 'Prontuário por áudio com consentimento de todas as partes',
          content:
            'O analista registra os participantes e cada um dá consentimento revogável. O upload de áudio revalida o consentimento de todos a cada envio, não apenas na criação — se alguém revogou entre um áudio e o seguinte, o upload trava. A transcrição em português é feita por Whisper através do gateway, que aplica mascaramento sobre o texto transcrito, e volta como rascunho para revisão humana.'
        },
        {
          title: 'Acessos: o melhor caminho até um alvo',
          content:
            'O usuário escolhe origem e alvo, profundidade máxima e filtros de natureza e força do vínculo. A CTE recursiva devolve até 25 caminhos ordenados por força total e profundidade. Para cada contato da carteira, uma variação da mesma consulta descobre o melhor caminho até o alvo — as pontes. O resultado alimenta um grafo Cytoscape com modo foco, e os nós confidenciais são mascarados por papel no construtor de elementos.'
        },
        {
          title: 'Enriquecimento de cadastro: propor, aprovar, gravar',
          content:
            'A IA lê o dossiê e propõe atualização de campos institucionais. Nada muda no cadastro até uma aplicação explícita, campo a campo. Itens sem citação de fonte pública são descartados antes mesmo de chegar ao usuário. A aplicação reutiliza o serviço de contatos, herdando validação e rejeição de campos sensíveis, e grava a procedência junto do versionamento — a trilha registra o que foi proposto e o que foi aceito.'
        }
      ],
      ai: {
        title: 'IA em produção sob governança verificável',
        summary:
          'Três superfícies de geração rodam em produção: transcrição em português por Whisper, talking points de briefing pré-reunião, e dossiês de doze seções sobre agentes públicos via Claude Sonnet com RAG. O que diferencia o projeto não é ter chamado uma API de LLM — é o regime de governança implementado no código, e a honestidade sobre onde a IA não é usada.',
        points: [
          {
            title: 'Mascaramento server-side sem opt-out',
            content:
              'Antes de qualquer prompt sair para um modelo externo, o gateway mascara os campos sensíveis do Art. 11 no servidor, sem possibilidade de desativação pelo operador. A resposta inclui a contagem e os tipos de redação aplicada — a redação é auditável, não silenciosa.'
          },
          {
            title: 'Streaming SSE que preserva todos os invariantes',
            content:
              'Ligar a IA real levou a geração de dossiê de instantânea para 90 a 130 segundos. A solução foi streaming ponta a ponta: um AsyncGenerator no backend emitindo protocolo tipado de eventos, timeout por ociosidade entre chunks em vez de duração total, propagação de cancelamento até o provedor, e parser SSE incremental próprio no browser. Nenhuma garantia foi sacrificada: o budget gate roda antes de abrir, e abort, desconexão ou falha de parse não persistem nada.'
          },
          {
            title: 'Saída estruturada de verdade',
            content:
              'O modelo precisa emitir JSON com doze seções na ordem exata. O parser remove code fences, valida com Zod e ainda confere ordem e cardinalidade das seções, lançando erro diagnóstico em vez de aceitar output silenciosamente degradado. O prompt do usuário — campo livre de pauta — é injetado com preâmbulo defensivo contra prompt injection do próprio operador autorizado.'
          },
          {
            title: 'FinOps de IA implementado',
            content:
              'Tabela de preços por operação, registro automático de uso em toda chamada com operação, operador, modelo, tokens e custo, e um budget gate com teto global, por operador e por operação — executado antes de disparar. Custo real medido e documentado em torno de um dólar e trinta por usuário ativo por mês.'
          },
          {
            title: 'A IA nunca dispara ação automática',
            content:
              'Todo output nasce com status não revisado e a interface exibe o rótulo correspondente. Quem gerou um dossiê é proibido de revisá-lo — a checagem compara autor e revisor e rejeita. Exportação para fora da organização passa por revisão jurídica com aprovação que expira. É separação de funções aplicada a conteúdo gerado por modelo.'
          },
          {
            title: 'Honestidade sobre o que não é IA',
            content:
              'O Score de Relevância e o Score de Acesso são heurísticas determinísticas em SQL — decay exponencial de recência, centralidade em escala logarítmica, atividade recente — documentadas como tal justamente para não serem vendidas como IA. Saber onde o modelo agrega, onde não agrega, e conseguir provar a diferença é parte do trabalho.'
          }
        ]
      },
      decisions: [
        {
          title: 'CTE recursiva em vez de banco de grafos',
          content:
            'Neo4j e Apache AGE foram avaliados e rejeitados. A CTE recursiva no Postgres entrega o path-finding necessário sem adicionar um sistema de banco à stack. O custo é consulta mais complexa e um teto de performance mais baixo; o ganho é uma dependência a menos para operar e um único lugar onde os dados vivem.'
        },
        {
          title: 'WORM por privilégio, não por convenção',
          content:
            'A imutabilidade do audit log poderia ser garantida por disciplina de código. Foi garantida por REVOKE no banco, com role dedicado que só tem INSERT. A diferença aparece exatamente no cenário que importa: comprometimento da aplicação.'
        },
        {
          title: 'pgvector decidido, BM25 em produção',
          content:
            'A decisão de usar pgvector na mesma instância — em vez de Pinecone, Weaviate ou Qdrant — já está registrada, com abstração de repositório preservando o caminho de migração. Enquanto o endpoint de embeddings não existe no gateway, o retrieval degrada para BM25 com tsvector em português. Consumidor degrada, contrato permanece.'
        },
        {
          title: 'SSE em endpoint dedicado',
          content:
            'WebSocket foi rejeitado por ser bidirecional demais para o caso. Adicionar uma flag de streaming ao endpoint existente também foi rejeitado: geraria ambiguidade de content-type em um serviço multi-tenant que outro produto consome. O custo assumido é manter dois pipelines de IA.'
        },
        {
          title: 'Cytoscape substituindo SVG artesanal',
          content:
            'Mil e duzentas linhas de SVG inline foram substituídas por Cytoscape com layout fcose. A migração foi incremental, atrás de paridade testada, e exigiu reimplementar o invariante de sigilo no novo renderizador — a máscara de nós confidenciais é testada no construtor de elementos, não nos pixels.'
        }
      ],
      challenges: [
        {
          title: 'Traduzir regulação em invariante verificável',
          content:
            'O desafio central. Vinte e duas diretrizes vinculantes e onze vedações categóricas precisavam sair do documento e virar código. A resposta foi ausência estrutural onde possível — campo sensível que não existe não pode vazar — e defesa em profundidade onde não era possível, com cinco camadas independentes cobrindo a mesma regra.'
        },
        {
          title: 'Streaming sem quebrar garantia de compliance',
          content:
            'Trocar um pipeline síncrono por streaming normalmente derruba invariantes: onde entra o mascaramento, o que persiste quando o stream cai, quem paga por um stream cancelado. Cada pergunta foi respondida explicitamente antes da implementação — mascaramento antes do primeiro chunk, persistência única no evento de sucesso, budget gate antes de abrir.'
        },
        {
          title: 'Consentimento revalidado por operação',
          content:
            'O caso difícil é o participante que revoga consentimento entre dois uploads do mesmo prontuário. Validar na criação não basta. A revalidação acontece a cada upload, e a captura trava mesmo com o prontuário já criado sob consentimento válido.'
        },
        {
          title: 'Escada de precisão de geocoding',
          content:
            'Um contato sempre precisa aparecer no mapa, mas fingir precisão que não existe é pior que não ter mapa. A solução foi uma escada explícita — CEP, rua, bairro, município, estado — com mais de cinco mil centroides do IBGE embarcados como fallback offline, e a precisão sinalizada visualmente por tipo de pino. Falha de geocoding nunca bloqueia o salvamento do contato.'
        },
        {
          title: 'Prompt injection pelo usuário autorizado',
          content:
            'O campo de pauta livre do dossiê é um vetor real, mesmo vindo de um operador legítimo. A mitigação é em camadas: preâmbulo defensivo no user prompt, system prompt que declara suas regras como não sobreponíveis, allowlist de campos na aplicação do enriquecimento, validação Zod da saída, e mascaramento server-side que independe do que o prompt pede.'
        }
      ],
      metrics: [
        { label: 'Linhas de código', value: '~105k' },
        { label: 'Endpoints REST', value: '256' },
        { label: 'Migrations', value: '39' },
        { label: 'Suítes de teste', value: '96' },
        { label: 'Módulos NestJS', value: '30' },
        { label: 'ADRs formais', value: '20' }
      ],
      screenshots: [
        {
          id: 'inicio',
          name: 'Início',
          src: '/redebrasil/inicio.png',
          description1:
            'A tela inicial resume o estado da carteira institucional em três cartões de entrada: total de contatos cadastrados, migração em andamento e board de oportunidades. A navegação lateral expõe as áreas do produto — carteira, prontuários, acessos, mapa geográfico, briefings, alertas, campanhas, consentimentos e governança.',
          description2:
            'O sistema tem seis papéis RBAC fixos e a home é resolvida por redirecionamento conforme o papel do usuário. A busca rápida com atalho de teclado dá acesso direto a qualquer contato sem passar pela navegação.'
        },
        {
          id: 'migracao',
          name: 'Migração de planilhas',
          src: '/redebrasil/migracao.png',
          description1:
            'A tela de migração importa planilhas heterogêneas — formatos do LinkedIn, do Outlook ou genéricos são detectados automaticamente, com mapeamento de colunas sugerido e resolução de vínculos entre os registros importados.',
          description2:
            'O contador "ART. 11 BLOQ." é a parte mais relevante desta tela: linhas contendo dados sensíveis segundo o Art. 11 da LGPD são rejeitadas na importação e contabilizadas separadamente. É a diretriz de compliance visível como número na interface, não como parágrafo em um documento.'
        },
        {
          id: 'mobile',
          name: 'PWA no celular',
          src: '/redebrasil/mobile.png',
          description1:
            'A aplicação é uma PWA instalável com service worker, e o mesmo código atende desktop e celular. O layout reflui para uma coluna, mantendo a hierarquia de informação e os mesmos pontos de entrada.',
          description2:
            'O uso móvel importa no contexto do produto: boa parte do registro de interações acontece logo após uma reunião, fora do escritório, quando o contexto ainda está fresco.'
        },
        {
          id: 'offline',
          name: 'Estado offline',
          src: '/redebrasil/offline.png',
          description1:
            'Quando a conexão cai, o service worker assume e a aplicação informa claramente o que continua disponível: as páginas visitadas recentemente permanecem acessíveis em modo leitura, com um caminho direto para a carteira em cache.',
          description2:
            'Tratar o estado offline como uma tela projetada, e não como um erro genérico do navegador, é o tipo de detalhe que separa uma PWA real de uma aplicação web com manifesto.'
        }
      ]
    },
    en: {
      name: 'REDE BRASIL',
      tagline:
        'B2G relationship intelligence platform — institutional graph, AI-generated dossiers with streaming, and LGPD compliance implemented as a code invariant.',
      subtitle:
        'B2G relationship intelligence — TypeScript monorepo with an in-Postgres graph, AI under verifiable governance and an immutable audit log',
      role: 'Architecture and full stack development',
      summary:
        'A platform that turns an organization scattered relationship capital — spreadsheets, calendars, contacts and individual memory — into a navigable institutional graph. It includes audio capture of interactions with transcription, LLM-generated dossiers on public officials sourced from official records, and mass communication under LGPD governance. Delivered under commercial contract, with phases 1 and 2 in production.',
      architecture: [
        {
          title: 'Modular monolith with a single external boundary',
          content:
            'A pnpm monorepo with apps/api (NestJS, 30 modules, 256 endpoints), apps/web (React + Vite, PWA) and packages/shared holding isomorphic Zod schemas — the same validation runs in backend DTOs and frontend forms. The decision to stay a monolith rather than split into microservices is recorded in an ADR, justified by team profile and by the need for a single centralized audit log.'
        },
        {
          title: 'Integration gateway: the system is consumer-only',
          content:
            'No external provider is called directly. Anthropic, OpenAI, Resend, Twilio, Meta WhatsApp, official Brazilian records — everything goes through a separate integrations-service, reached over REST with HMAC signing. This concentrates secrets, rate limiting, caching and egress auditing in one place. The product API never holds AI provider keys.'
        },
        {
          title: 'Relationship graph inside PostgreSQL',
          content:
            'Path-finding between people uses a recursive CTE in Postgres itself, without adding a graph database to the stack. The CTE materializes the bidirectional graph with filters already applied at edge level, runs breadth-first search accumulating the path, and prevents cycles by checking whether the next node is already in the accumulated path. It delivers paths, bridges and ego-subgraphs up to five hops.'
        },
        {
          title: 'Audit log made immutable by database privilege',
          content:
            'The audit trail is WORM through a REVOKE of UPDATE, DELETE and TRUNCATE in PostgreSQL. The worker that writes it uses a separate pool with a role that only holds INSERT. Even with privilege escalation inside the Node process, the log stays immutable — the guarantee lives in the database, not in application code. An automated smoke test tries to violate the rule and fails the deploy if the REVOKE regresses.'
        },
        {
          title: 'Queues on top of Postgres itself',
          content:
            'pg-boss replaces Redis for asynchronous jobs: audit log writes, alert detectors and scheduled campaigns. One less infrastructure dependency, at the cost of a throughput ceiling the product load profile never reaches.'
        },
        {
          title: 'Compliance as a structural invariant',
          content:
            'The product operates under Brazilian data protection, anti-corruption and electoral regulation. Sensitive fields under Art. 11 have no column in the Prisma schema — the prohibition is structural absence, not a denied permission. The same rule is defended across five independent layers: the importer rejects, the Zod refinement rejects, the contacts service rejects, RAG ingestion rejects, and the LLM system prompt forbids.'
        }
      ],
      diagrams: [
        {
          id: 'redebrasil-architecture',
          src: '/diagrams/redebrasil-architecture',
          title: 'Architecture and integration boundary',
          caption:
            'The monorepo, the external gateway mediating all egress, and the two distinct Postgres roles. Note where sensitive-data masking happens: before any prompt leaves the perimeter.',
          kind: 'component'
        },
        {
          id: 'redebrasil-dossier-stream',
          src: '/diagrams/redebrasil-dossier-stream',
          title: 'Dossier generation with SSE streaming',
          caption:
            'The signature flow of the product. Note the ordering: the budget gate runs before the stream opens, research steps emit only a label and a count, and persistence happens exactly once, on the successful completion event.',
          kind: 'sequence'
        }
      ],
      flows: [
        {
          title: 'Public official dossier with live streaming',
          content:
            'The researcher triggers generation and receives text token by token. Before opening the stream, the system validates role, contact existence and AI budget. It then runs BM25 retrieval over indexed documents for that contact, queries four public sources one by one, and only then opens the stream with the LLM. The result is a twelve-section JSON validated by schema — order and cardinality checked — persisted as a new version with unreviewed status.'
        },
        {
          title: 'Audio-recorded interaction with all-parties consent',
          content:
            'The analyst registers participants and each gives revocable consent. Audio upload revalidates consent from everyone on every upload, not just at creation — if someone revoked between one recording and the next, the upload is blocked. Portuguese transcription runs through Whisper via the gateway, which masks the transcribed text, and returns as a draft for human review.'
        },
        {
          title: 'Access paths: the best route to a target',
          content:
            'The user picks origin and target, maximum depth and filters on relationship nature and strength. The recursive CTE returns up to 25 paths ordered by total strength and depth. For every contact in the portfolio, a variation of the same query finds the best path to the target — the bridges. The result feeds a Cytoscape graph with focus mode, and confidential nodes are masked by role in the element builder.'
        },
        {
          title: 'Record enrichment: propose, approve, write',
          content:
            'The AI reads the dossier and proposes updates to institutional fields. Nothing changes in the record until an explicit, field-by-field apply. Items without a public source citation are discarded before ever reaching the user. The apply reuses the contacts service, inheriting validation and sensitive-field rejection, and stores provenance alongside versioning — the trail records what was proposed and what was accepted.'
        }
      ],
      ai: {
        title: 'AI in production under verifiable governance',
        summary:
          'Three generation surfaces run in production: Portuguese transcription via Whisper, pre-meeting briefing talking points, and twelve-section dossiers on public officials via Claude Sonnet with RAG. What sets the project apart is not having called an LLM API — it is the governance regime implemented in code, and the honesty about where AI is not used.',
        points: [
          {
            title: 'Server-side masking with no opt-out',
            content:
              'Before any prompt leaves for an external model, the gateway masks sensitive regulated fields server-side, with no way for the operator to disable it. The response includes the count and types of redaction applied — redaction is auditable, not silent.'
          },
          {
            title: 'SSE streaming that preserves every invariant',
            content:
              'Turning on the real AI moved dossier generation from instant to 90–130 seconds. The answer was end-to-end streaming: an AsyncGenerator on the backend emitting a typed event protocol, idle timeout between chunks rather than total duration, cancellation propagated to the provider, and a custom incremental SSE parser in the browser. No guarantee was traded away: the budget gate runs before opening, and abort, disconnect or parse failure persist nothing.'
          },
          {
            title: 'Genuinely structured output',
            content:
              'The model must emit JSON with twelve sections in exact order. The parser strips code fences, validates with Zod and still checks section order and cardinality, raising a diagnostic error instead of accepting silently degraded output. The user free-text prompt is injected with a defensive preamble against prompt injection from the authorized operator themselves.'
          },
          {
            title: 'AI FinOps, implemented',
            content:
              'A price table per operation, automatic usage recording on every call with operation, operator, model, tokens and cost, and a budget gate with global, per-operator and per-operation caps — executed before firing. Real cost measured and documented at roughly one dollar thirty per active user per month.'
          },
          {
            title: 'AI never triggers an action on its own',
            content:
              'Every output is born unreviewed and the interface shows the corresponding label. Whoever generated a dossier is barred from reviewing it — the check compares author and reviewer and rejects. External export goes through a legal review with an expiring approval. It is separation of duties applied to model-generated content.'
          },
          {
            title: 'Honesty about what is not AI',
            content:
              'The Relevance Score and Access Score are deterministic SQL heuristics — exponential recency decay, log-scaled centrality, recent activity — documented as such precisely so they are not sold as AI. Knowing where a model adds value, where it does not, and being able to prove the difference is part of the job.'
          }
        ]
      },
      decisions: [
        {
          title: 'Recursive CTE instead of a graph database',
          content:
            'Neo4j and Apache AGE were evaluated and rejected. The recursive CTE in Postgres delivers the path-finding needed without adding a database system to the stack. The cost is a more complex query and a lower performance ceiling; the gain is one less dependency to operate and a single place where data lives.'
        },
        {
          title: 'WORM by privilege, not by convention',
          content:
            'Audit log immutability could have been guaranteed by coding discipline. It was guaranteed by a database REVOKE, with a dedicated INSERT-only role. The difference shows up in exactly the scenario that matters: application compromise.'
        },
        {
          title: 'pgvector decided, BM25 in production',
          content:
            'The decision to use pgvector on the same instance — rather than Pinecone, Weaviate or Qdrant — is already recorded, with a repository abstraction preserving the migration path. While the embeddings endpoint does not exist upstream, retrieval degrades to BM25 with Portuguese tsvector. The consumer degrades, the contract holds.'
        },
        {
          title: 'SSE on a dedicated endpoint',
          content:
            'WebSocket was rejected as too bidirectional for the case. Adding a streaming flag to the existing endpoint was also rejected: it would create content-type ambiguity in a multi-tenant service another product consumes. The accepted cost is maintaining two AI pipelines.'
        },
        {
          title: 'Cytoscape replacing handcrafted SVG',
          content:
            'Twelve hundred lines of inline SVG were replaced by Cytoscape with an fcose layout. The migration was incremental, behind tested parity, and required reimplementing the confidentiality invariant in the new renderer — the mask on confidential nodes is tested in the element builder, not in the pixels.'
        }
      ],
      challenges: [
        {
          title: 'Translating regulation into verifiable invariants',
          content:
            'The central challenge. Twenty-two binding directives and eleven categorical prohibitions had to leave the document and become code. The answer was structural absence where possible — a sensitive field that does not exist cannot leak — and defense in depth where it was not, with five independent layers covering the same rule.'
        },
        {
          title: 'Streaming without breaking a compliance guarantee',
          content:
            'Swapping a synchronous pipeline for streaming usually breaks invariants: where does masking happen, what persists when the stream drops, who pays for a cancelled stream. Each question was answered explicitly before implementation — masking before the first chunk, single persistence on the success event, budget gate before opening.'
        },
        {
          title: 'Consent revalidated per operation',
          content:
            'The hard case is the participant who revokes consent between two uploads on the same record. Validating at creation is not enough. Revalidation happens on every upload, and capture is blocked even when the record was already created under valid consent.'
        },
        {
          title: 'A geocoding precision ladder',
          content:
            'A contact always needs to appear on the map, but faking precision that does not exist is worse than having no map. The answer was an explicit ladder — postal code, street, neighbourhood, municipality, state — with over five thousand official centroids embedded as an offline fallback, and precision signalled visually by pin type. Geocoding failure never blocks saving a contact.'
        },
        {
          title: 'Prompt injection from an authorized user',
          content:
            'The dossier free-text field is a real vector, even coming from a legitimate operator. Mitigation is layered: a defensive preamble in the user prompt, a system prompt declaring its rules non-overridable, a field allowlist when applying enrichment, Zod validation of the output, and server-side masking that does not depend on what the prompt asks for.'
        }
      ],
      metrics: [
        { label: 'Lines of code', value: '~105k' },
        { label: 'REST endpoints', value: '256' },
        { label: 'Migrations', value: '39' },
        { label: 'Test suites', value: '96' },
        { label: 'NestJS modules', value: '30' },
        { label: 'Formal ADRs', value: '20' }
      ],
      screenshots: [
        {
          id: 'inicio',
          name: 'Home',
          src: '/redebrasil/inicio.png',
          description1:
            'The home screen summarizes the state of the institutional portfolio in three entry cards: total contacts registered, migration in progress and the opportunities board. The side navigation exposes the product areas — portfolio, interaction records, access paths, geographic map, briefings, alerts, campaigns, consents and governance.',
          description2:
            'The system has six fixed RBAC roles and the home route is resolved by redirect according to the user role. Quick search with a keyboard shortcut gives direct access to any contact without going through navigation.'
        },
        {
          id: 'migracao',
          name: 'Spreadsheet migration',
          src: '/redebrasil/migracao.png',
          description1:
            'The migration screen imports heterogeneous spreadsheets — LinkedIn, Outlook or generic formats are detected automatically, with suggested column mapping and resolution of relationships between imported records.',
          description2:
            'The "ART. 11 BLOQ." counter is the most relevant part of this screen: rows containing regulated sensitive data are rejected at import and counted separately. It is the compliance directive visible as a number in the interface, not as a paragraph in a document.'
        },
        {
          id: 'mobile',
          name: 'PWA on mobile',
          src: '/redebrasil/mobile.png',
          description1:
            'The application is an installable PWA with a service worker, and the same code serves desktop and mobile. The layout reflows to a single column, keeping the information hierarchy and the same entry points.',
          description2:
            'Mobile use matters in this product context: much of the interaction logging happens right after a meeting, away from the office, while the context is still fresh.'
        },
        {
          id: 'offline',
          name: 'Offline state',
          src: '/redebrasil/offline.png',
          description1:
            'When the connection drops, the service worker takes over and the application states clearly what remains available: recently visited pages stay accessible in read mode, with a direct path to the cached portfolio.',
          description2:
            'Treating the offline state as a designed screen, rather than a generic browser error, is the kind of detail that separates a real PWA from a web application with a manifest.'
        }
      ]
    }
  }
};
