import { ProjectDefinition } from '../project-content.model';

export const TRENDERTOK: ProjectDefinition = {
  id: 'trendertok',
  icon: '🎬',
  stack: [
    'Python 3.13',
    'FastAPI',
    'Next.js 16',
    'React 19',
    'TypeScript strict',
    'SQLAlchemy + Alembic',
    'APScheduler',
    'ffmpeg',
    'Claude Haiku',
    'OpenAI',
    'MiniMax Hailuo',
    'ElevenLabs',
    'Fly.io'
  ],
  content: {
    pt: {
      name: 'TrenderTok',
      tagline:
        'Pipeline autônomo de conteúdo com IA — detecta tendências, gera vídeo vertical e publica no TikTok e LinkedIn, sempre atrás de um portão de revisão humana.',
      subtitle:
        'Automação de conteúdo com IA — backend FastAPI com três pipelines de geração e painel de controle Next.js',
      role: 'Arquitetura e desenvolvimento full stack (backend e frontend)',
      summary:
        'Sistema que colapsa a linha de produção de conteúdo curto — pesquisar tendência, escrever roteiro, produzir vídeo, publicar, medir — em um pipeline automatizado. Detecta tópicos em alta em três fontes independentes, gera roteiro estruturado por cena via LLM, monta vídeo vertical 1080x1920 com ffmpeg e publica após aprovação humana obrigatória. São dois deployáveis: uma API FastAPI que concentra toda a lógica e um painel Next.js que é a única superfície do operador.',
      architecture: [
        {
          title: 'Dois deployáveis, uma fronteira de I/O selada',
          content:
            'O backend FastAPI é dono de toda a regra de negócio e do agendamento; o frontend Next.js é dono exclusivo da experiência. No frontend, a regra arquitetural é dura: nenhum componente chama fetch diretamente — toda saída HTTP passa por onze módulos de cliente sobre um único ponto de acesso. A regra é violada exatamente uma vez, de forma documentada, no upload multipart, e a exceção fica dentro da própria camada de I/O.'
        },
        {
          title: 'Três eixos ortogonais de configuração',
          content:
            'Canal (TikTok ou LinkedIn), modo de geração (vídeo por IA, avatar ou mídia própria) e provedor de IA (qual LLM escreve, qual gera imagem) são eixos independentes que se combinam livremente. Cada um tem default por nicho e alguns têm override por post. É o que mantém o sistema extensível sem reescrita: adicionar um canal é uma entrada no módulo de canais mais um publisher.'
        },
        {
          title: 'Três pipelines de geração sobre primitivas compartilhadas',
          content:
            'Pipeline A monta vídeo com footage de stock e efeito Ken Burns; Pipeline B usa geração de vídeo por IA; Pipeline C produz um avatar falante com clonagem de voz e lip-sync. Os três compartilham as mesmas primitivas de assembly: wrapper de ffmpeg com quality gate, normalização de loudness e gerador de legendas ASS sincronizadas por palavra.'
        },
        {
          title: 'ffmpeg direto, sem camada intermediária',
          content:
            'MoviePy foi substituído por chamadas diretas ao ffmpeg. Isso habilitou 1080x1920 real, burn-in de legendas ASS, normalização a -14 LUFS e filtergraphs avançados. O wrapper escreve o filtergraph em arquivo temporário e usa a flag de script — evitando todo o inferno de escaping de shell para grafos de centenas de caracteres.'
        },
        {
          title: 'Máquinas de estado explícitas',
          content:
            'O vídeo gerado percorre roteiro pendente, roteiro pronto, vídeo pendente, pronto ou falho. O item de revisão percorre pendente, aprovado, rejeitado ou substituído. A publicação percorre agendado, enfileirado, publicando, publicado, retentando ou falho. Cada transição é explícita no modelo e observável pela interface.'
        },
        {
          title: 'Observabilidade persistida, não em memória',
          content:
            'O estado de cada job vive em tabela com detalhe legível por humano, não em dicionário de processo. É isso que permite ao painel reconstruir visibilidade quase em tempo real de um pipeline assíncrono que não emite eventos — e é isso que sobrevive a um restart.'
        }
      ],
      diagrams: [],
      flows: [
        {
          title: 'Detecção de tendências com scoring determinístico',
          content:
            'A cada trinta minutos, três fontes são consultadas em paralelo com timeout individual — uma fonte que falha retorna vazio e o ciclo continua. Os candidatos passam por nove passos: normalização dentro de cada fonte, boost para consultas em ascensão, decaimento exponencial por recência, combinação ponderada com renormalização pelas fontes que responderam, bônus por aparecer em múltiplas fontes, deduplicação fuzzy, bônus de velocidade contra o ciclo anterior e classificação de ciclo de vida.'
        },
        {
          title: 'Geração de roteiro com prompt composto em camadas',
          content:
            'O system prompt não é uma string fixa — é montado em runtime empilhando quatro camadas com precedência explícita: prompt persistente do nicho, alvo de duração, override de arquétipo e prompt base do pipeline. A mesma tabela de restrições que pede o formato no prompt também o impõe no parser, então instrução e validação saem da mesma fonte de verdade.'
        },
        {
          title: 'Montagem do vídeo com fallback progressivo',
          content:
            'A narração é gerada com timings por palavra, que alimentam as legendas karaokê. Cada cena busca footage com fallback em três níveis: consulta da cena, nome do nicho, e termos genéricos rotacionados. Isso garante que o vídeo sempre monta se o provedor estiver alcançável, em vez de falhar inteiro por uma única consulta ruim. No final, quality gate e normalização de loudness.'
        },
        {
          title: 'Revisão humana e publicação',
          content:
            'O item entra na fila mesmo quando a geração falha — o operador precisa ver o erro, não o silêncio. Aprovado, o dispatch roteia por canal. A publicação roda em background com refresh proativo de token, e o arquivo local só é removido depois do commit bem-sucedido. Limite de taxa vira retentativa com backoff exponencial, não falha.'
        }
      ],
      ai: {
        title: 'Uma frota de modelos sob orquestração determinística',
        summary:
          'Cinco provedores de modelo integrados atrás de um dispatcher configurável por nicho. A parte interessante não é ter chamado APIs de IA — é o tratamento de tudo que acontece em volta: roteamento com semântica precisa de fallback, validação de saída que não confia no modelo, gate de segurança com dois perfis de risco e guardrails de custo em quatro pontos distintos.',
        points: [
          {
            title: 'Fallback com semântica precisa',
            content:
              'A distinção que a maioria das implementações multi-provider erra: indisponibilidade do provedor causa degradação silenciosa para a melhor alternativa; falha do provedor escolhido propaga o erro honestamente. Mascarar uma falha do GPT como um erro de autenticação do Claude torna o sistema indebugável, então o roteamento é autoritativo quando a escolha foi explícita.'
          },
          {
            title: 'Nenhuma saída de LLM é confiada',
            content:
              'Parser tolerante a code fences, validação de schema por cena sensível ao pipeline, imposição de contagem de cenas, teto de palavras aparado de trás para frente, e clamps de segurança que registram em log quando o modelo desobedece. A validação assume que o modelo pode ignorar a instrução — porque ele pode.'
          },
          {
            title: 'Gate de segurança com dois perfis de risco',
            content:
              'Um post profissional legitimamente cita empresas e pessoas reais; gerar a imagem de uma pessoa real é risco de deepfake. Por isso o gate de texto aplica um conjunto de categorias e o gate de mídia aplica um conjunto maior. O matching é ancorado em fronteira de palavra para não bloquear falsos positivos clássicos como "computing" por conter um nome próprio.'
          },
          {
            title: 'Prompt engineering movido por evidência de produção',
            content:
              'Uma restrição dura no prompt proíbe termos como silhueta, sombra e iluminação dramática nas consultas de footage. A razão é concreta: esse footage é ilegível em vertical e, encadeado entre cenas, produzia vídeo quase preto. A correção foi restringir o espaço de saída do modelo, não compensar no encode — causa raiz na camada certa.'
          },
          {
            title: 'Guardrails de custo em quatro pontos',
            content:
              'Cache SHA-256 por prompt na geração de vídeo evita recobrança de clipe idêntico; teto de regenerações por tendência; orçamento de imagens por ciclo; e o gate de segurança rodando antes de qualquer chamada paga. Uma decisão de provedor chegou a ser revertida depois que a precificação usada na escolha original se mostrou incorreta, com sete alternativas reprecificadas e envelope de custo tabelado.'
          },
          {
            title: 'Memória anti-repetição sem vector store',
            content:
              'Antes de gerar, o sistema consulta os posts recentes do mesmo nicho e injeta no prompt a instrução de tomar um ângulo diferente. Em geração em lote, essa lista é recomputada a cada iteração — então os posts de uma mesma rodada divergem progressivamente entre si. Diversidade em lote sem custo de embeddings.'
          },
          {
            title: 'Biometria tratada como classe de segredo',
            content:
              'O pipeline de avatar envolve rosto e voz. O consentimento é coluna não nula, os assets são criptografados no mesmo nível dos tokens OAuth, clonar terceiros é feature proibida por design, e o frontend nunca toca nos bytes — troca apenas identificadores opacos e um status mascarado. O gate de consentimento é duplicado no cliente e no servidor, porque um gate de CLI não protege um endpoint HTTP.'
          }
        ]
      },
      decisions: [],
      challenges: [
        {
          title: 'Observar um pipeline assíncrono que não emite eventos',
          content:
            'Não há WebSocket nem SSE. A visibilidade quase em tempo real é reconstruída cruzando três sinais heterogêneos: status do item, jobs em execução no log de atividade, e uma janela temporal de polling aberta pela ação do usuário. Cada sinal cobre um buraco dos outros — em especial o caso do LinkedIn, cujos posts nascem prontos e nunca passam por um estado observável.'
        },
        {
          title: 'Corrida entre o agendador e o operador',
          content:
            'Dois produtores podem gerar para a mesma tendência ao mesmo tempo. Resolvido em três camadas: conflito tipado no backend, tratamento específico no cliente e humanização da mensagem. Antes da correção, os dois caminhos produziam linhas duplicadas com quinze milissegundos de diferença.'
        },
        {
          title: 'Publicação duplicada é dano irreversível',
          content:
            'Um duplo clique em publicar postaria duas vezes na rede social. Defesa tripla: atualização otimista imediata do estado, regra que só oferece o botão em estados elegíveis, e desabilitação enquanto a ação está em voo.'
        },
        {
          title: 'Recuperação de estado após queda do processo',
          content:
            'Um restart deixa jobs em execução e vídeos pendentes travados para sempre. A recuperação no boot faz triagem por evidência: um vídeo pendente cujo arquivo existe em disco é resgatado como pronto — o assembly terminou, só o commit não aconteceu. Recuperar em vez de descartar é a diferença entre perder e não perder minutos de CPU e o custo das chamadas de API.'
        },
        {
          title: 'Narração cortada no meio da palavra',
          content:
            'A flag que corta pelo stream mais curto truncava a última frase quando os visuais acabavam antes do áudio. A correção tem duas partes: padding de silêncio ao fim da narração e medição da duração real do áudio para ancorar o fade-out no maior entre visual e áudio, segurando o último frame durante a cauda.'
        },
        {
          title: 'Erros de provedor que não assustam o operador',
          content:
            'Dumps de erro de API de LLM nunca chegam ao usuário. Um tradutor classifica oito famílias de falha — autenticação, cota, limite de taxa, sobrecarga, conflito, configuração, rede e servidor — e devolve mensagem específica com o passo corretivo, com uma guarda final que bloqueia qualquer vazamento de JSON ou stack trace.'
        }
      ],
      metrics: [
        { label: 'Linhas de código', value: '~28k' },
        { label: 'Endpoints da API', value: '49' },
        { label: 'Funções de teste', value: '594' },
        { label: 'Migrations', value: '31' },
        { label: 'Provedores de IA', value: '5' },
        { label: 'ADRs formais', value: '12' }
      ],
      screenshots: [
        {
          id: 'landing',
          name: 'Landing',
          src: '/trendertok/landing.jpg',
          description1:
            'A entrada pública do produto, em tema escuro único com o rosa do TikTok como acento. A promessa é declarada em uma frase — tendências viram vídeo automaticamente — e o subtexto já entrega o ponto que diferencia o sistema: a aprovação acontece em um clique, antes da janela da tendência fechar.',
          description2:
            'Os círculos coloridos à esquerda são uma animação em sete fases: os sinais das três fontes de tendência convergem, viram um player de vídeo e depois o ícone da plataforma. A ancoragem é relativa ao viewport e recalculada a cada ciclo para sobreviver a redimensionamento, e há um fallback completo para quem prefere movimento reduzido.'
        },
        {
          id: 'como-funciona',
          name: 'Como funciona',
          src: '/trendertok/como-funciona.jpg',
          description1:
            'A seção que explica o pipeline em três passos: detectar as tendências em alta nos nichos configurados, gerar roteiro e montar o vídeo vertical com narração e legendas, e revisar antes de publicar com a divulgação de conteúdo gerado por IA aplicada.',
          description2:
            'Abaixo, os números que definem a proposta: menos de trinta minutos de esforço manual por semana, três vídeos alinhados a tendência por ciclo, e três fontes de sinal por tendência. O passo três existe por decisão de produto — o sistema é autônomo até o ponto de publicar, e nunca além dele.'
        }
      ]
    },
    en: {
      name: 'TrenderTok',
      tagline:
        'Autonomous AI content pipeline — detects trends, generates vertical video and publishes to TikTok and LinkedIn, always behind a human review gate.',
      subtitle:
        'AI content automation — FastAPI backend with three generation pipelines and a Next.js control plane',
      role: 'Architecture and full stack development (backend and frontend)',
      summary:
        'A system that collapses the short-form content production line — research the trend, write the script, produce the video, publish, measure — into an automated pipeline. It detects trending topics across three independent sources, generates a scene-structured script via LLM, assembles 1080x1920 vertical video with ffmpeg, and publishes after mandatory human approval. Two deployables: a FastAPI service owning all business logic, and a Next.js dashboard that is the operator only surface.',
      architecture: [
        {
          title: 'Two deployables, one sealed I/O boundary',
          content:
            'The FastAPI backend owns all business logic and scheduling; the Next.js frontend owns the experience exclusively. On the frontend the architectural rule is hard: no component calls fetch directly — all HTTP egress goes through eleven client modules over a single access point. The rule is broken exactly once, in a documented way, for multipart upload, and the exception stays inside the I/O layer itself.'
        },
        {
          title: 'Three orthogonal configuration axes',
          content:
            'Channel (TikTok or LinkedIn), generation mode (AI video, avatar or bring-your-own media) and AI provider (which LLM writes, which generates images) are independent axes that combine freely. Each has a per-niche default and some have per-post overrides. This is what keeps the system extensible without a rewrite: adding a channel is one entry in the channels module plus a publisher.'
        },
        {
          title: 'Three generation pipelines over shared primitives',
          content:
            'Pipeline A assembles video from stock footage with a Ken Burns effect; Pipeline B uses AI video generation; Pipeline C produces a talking avatar with voice cloning and lip-sync. All three share the same assembly primitives: an ffmpeg wrapper with a quality gate, loudness normalization, and a word-synced ASS caption generator.'
        },
        {
          title: 'ffmpeg directly, with no intermediate layer',
          content:
            'MoviePy was replaced by direct ffmpeg calls. That enabled true 1080x1920, ASS caption burn-in, normalization to -14 LUFS and advanced filtergraphs. The wrapper writes the filtergraph to a temporary file and uses the script flag — avoiding the entire shell-escaping nightmare for graphs hundreds of characters long.'
        },
        {
          title: 'Explicit state machines',
          content:
            'A generated video moves through script pending, script ready, video pending, ready or failed. A review item moves through pending, approved, rejected or superseded. Publication moves through scheduled, queued, posting, posted, retrying or failed. Every transition is explicit in the model and observable from the interface.'
        },
        {
          title: 'Observability persisted, not held in memory',
          content:
            'Each job state lives in a table with a human-readable detail field, not in a process dictionary. That is what lets the dashboard reconstruct near real-time visibility of an asynchronous pipeline that emits no events — and it is what survives a restart.'
        }
      ],
      diagrams: [],
      flows: [
        {
          title: 'Trend detection with deterministic scoring',
          content:
            'Every thirty minutes three sources are queried in parallel with individual timeouts — a failing source returns empty and the cycle continues. Candidates go through nine steps: normalization within each source, a boost for rising queries, exponential recency decay, weighted merge renormalized by the sources that answered, a bonus for appearing in multiple sources, fuzzy deduplication, a velocity bonus against the previous cycle, and lifecycle classification.'
        },
        {
          title: 'Script generation with layered composed prompts',
          content:
            'The system prompt is not a fixed string — it is assembled at runtime by stacking four layers with explicit precedence: persistent niche prompt, duration target, archetype override and pipeline base prompt. The same constraint table that asks for the format in the prompt also enforces it in the parser, so instruction and validation come from one source of truth.'
        },
        {
          title: 'Video assembly with progressive fallback',
          content:
            'Voiceover is generated with per-word timings, which feed the karaoke captions. Each scene fetches footage with a three-level fallback: the scene query, the niche name, and rotating generic terms. This guarantees the video always assembles if the provider is reachable, rather than failing entirely on one bad query. Quality gate and loudness normalization close the process.'
        },
        {
          title: 'Human review and publishing',
          content:
            'The item enters the queue even when generation fails — the operator needs to see the error, not silence. Once approved, dispatch routes by channel. Publishing runs in the background with proactive token refresh, and the local file is removed only after a successful commit. Rate limiting becomes a retry with exponential backoff, not a failure.'
        }
      ],
      ai: {
        title: 'A fleet of models under deterministic orchestration',
        summary:
          'Five model providers integrated behind a dispatcher configurable per niche. The interesting part is not having called AI APIs — it is everything handled around them: routing with precise fallback semantics, output validation that does not trust the model, a safety gate with two risk profiles, and cost guardrails at four distinct points.',
        points: [
          {
            title: 'Fallback with precise semantics',
            content:
              'The distinction most multi-provider implementations get wrong: provider unavailability causes silent degradation to the best alternative; failure of the chosen provider surfaces the error honestly. Masking a GPT failure as a Claude authentication error makes the system undebuggable, so routing is authoritative when the choice was explicit.'
          },
          {
            title: 'No LLM output is trusted',
            content:
              'A parser tolerant of code fences, pipeline-aware per-scene schema validation, scene count enforcement, a word cap trimmed from the back, and safety clamps that log when the model disobeys. Validation assumes the model may ignore the instruction — because it can.'
          },
          {
            title: 'A safety gate with two risk profiles',
            content:
              'A professional post legitimately names real companies and people; generating an image of a real person is deepfake risk. So the text gate applies one set of categories and the media gate applies a larger one. Matching is word-boundary anchored so classic false positives — a common word that happens to contain a proper noun — are not blocked.'
          },
          {
            title: 'Prompt engineering driven by production evidence',
            content:
              'A hard constraint in the prompt forbids terms like silhouette, shadow and dramatic lighting in footage queries. The reason is concrete: that footage is illegible in vertical format and, chained across scenes, produced a nearly black video. The fix was to constrain the model output space, not to compensate in the encode — root cause at the right layer.'
          },
          {
            title: 'Cost guardrails at four points',
            content:
              'A SHA-256 prompt cache on video generation avoids re-billing an identical clip; a regeneration cap per trend; an image budget per cycle; and the safety gate running before any paid call. One provider decision was reverted after the pricing used in the original choice proved incorrect, with seven alternatives re-priced and a cost envelope tabulated.'
          },
          {
            title: 'Anti-repetition memory without a vector store',
            content:
              'Before generating, the system queries recent posts from the same niche and injects an instruction to take a clearly different angle. In batch generation this list is recomputed on every iteration — so posts from one run diverge progressively from each other. Batch diversity with no embedding cost.'
          },
          {
            title: 'Biometrics treated as a secret class',
            content:
              'The avatar pipeline involves a face and a voice. Consent is a non-nullable column, assets are encrypted at the same level as OAuth tokens, cloning third parties is a forbidden feature by design, and the frontend never touches the bytes — it exchanges only opaque identifiers and a masked status. The consent gate is duplicated on client and server, because a CLI gate does not protect an HTTP endpoint.'
          }
        ]
      },
      decisions: [],
      challenges: [
        {
          title: 'Observing an asynchronous pipeline that emits no events',
          content:
            'There is no WebSocket and no SSE. Near real-time visibility is reconstructed by crossing three heterogeneous signals: item status, running jobs in the activity log, and a time window of polling opened by the user action. Each signal covers a gap in the others — especially the LinkedIn case, whose posts are born ready and never pass through an observable state.'
        },
        {
          title: 'A race between the scheduler and the operator',
          content:
            'Two producers can generate for the same trend at once. Solved in three layers: a typed conflict on the backend, specific handling on the client and a humanized message. Before the fix, both paths produced duplicate rows fifteen milliseconds apart.'
        },
        {
          title: 'Duplicate publishing is irreversible damage',
          content:
            'A double click on publish would post twice to the social network. Triple defense: immediate optimistic state update, a rule that only offers the button in eligible states, and disabling while the action is in flight.'
        },
        {
          title: 'State recovery after a process crash',
          content:
            'A restart leaves running jobs and pending videos stuck forever. Startup recovery triages by evidence: a pending video whose file exists on disk is rescued as ready — assembly finished, only the commit did not happen. Rescuing rather than discarding is the difference between losing and not losing minutes of CPU and the cost of the API calls.'
        },
        {
          title: 'Voiceover cut off mid-word',
          content:
            'The flag that trims to the shortest stream truncated the last sentence when visuals ended before the audio. The fix has two parts: silence padding at the end of the voiceover, and measuring real audio duration to anchor the fade-out to the longer of visual and audio, holding the last frame through the tail.'
        },
        {
          title: 'Provider errors that do not frighten the operator',
          content:
            'Raw LLM API error dumps never reach the user. A translator classifies eight failure families — authentication, quota, rate limit, overload, conflict, configuration, network and server — and returns a specific message with the corrective step, with a final guard blocking any JSON or stack trace leak.'
        }
      ],
      metrics: [
        { label: 'Lines of code', value: '~28k' },
        { label: 'API endpoints', value: '49' },
        { label: 'Test functions', value: '594' },
        { label: 'Migrations', value: '31' },
        { label: 'AI providers', value: '5' },
        { label: 'Formal ADRs', value: '12' }
      ],
      screenshots: [
        {
          id: 'landing',
          name: 'Landing',
          src: '/trendertok/landing.jpg',
          description1:
            'The public entry point, in a single dark theme with the TikTok pink as accent. The promise is stated in one line — trends become videos automatically — and the subtext already delivers the differentiating point: approval takes one click, before the trend window closes.',
          description2:
            'The coloured circles on the left are a seven-phase animation: signals from the three trend sources converge, become a video player and then the platform icon. Anchoring is viewport-relative and recalculated each cycle to survive resizing, and there is a complete fallback for reduced-motion preferences.'
        },
        {
          id: 'como-funciona',
          name: 'How it works',
          src: '/trendertok/como-funciona.jpg',
          description1:
            'The section explaining the pipeline in three steps: detect trending topics in the configured niches, generate the script and assemble the vertical video with voiceover and captions, and review before publishing with AI content disclosure applied.',
          description2:
            'Below it, the numbers that define the proposition: under thirty minutes of manual effort per week, three trend-aligned videos per cycle, and three signal sources per trend. Step three exists by product decision — the system is autonomous up to the point of publishing, and never past it.'
        }
      ]
    }
  }
};
