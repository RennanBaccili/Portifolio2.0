import { Language } from '../services/translation.service';

/** Bloco de texto com titulo — usado em arquitetura, fluxos, decisoes e desafios. */
export interface ProjectSection {
  title: string;
  content: string;
}

/** Diagrama PlantUML renderizado para SVG em public/diagrams. */
export interface ProjectDiagram {
  id: string;
  /**
   * Caminho BASE do diagrama, sem sufixo de tema nem extensao,
   * ex: `/diagrams/lifeplus-architecture`. O componente acrescenta
   * `-light.svg` ou `-dark.svg` conforme o tema ativo, porque
   * tools/render-puml.py gera uma variante para cada tema.
   */
  src: string;
  title: string;
  caption: string;
  kind: 'component' | 'sequence' | 'deployment' | 'data';
}

/** Print de tela com a narrativa de uso correspondente. */
export interface ProjectScreenshot {
  id: string;
  name: string;
  src: string;
  description1: string;
  description2: string;
}

/** Numero curto exibido na faixa de metricas do projeto. */
export interface ProjectMetric {
  label: string;
  value: string;
}

/** Destaque de IA — a secao que o portfolio sempre retoma. */
export interface ProjectAiHighlight {
  title: string;
  summary: string;
  points: ProjectSection[];
}

/** Conteudo de um projeto em um idioma. */
export interface ProjectLocaleContent {
  name: string;
  /** Frase curta usada no card da home. */
  tagline: string;
  /** Subtitulo do cabecalho da pagina de detalhe. */
  subtitle: string;
  role: string;
  summary: string;
  architecture: ProjectSection[];
  diagrams: ProjectDiagram[];
  flows: ProjectSection[];
  ai: ProjectAiHighlight;
  decisions: ProjectSection[];
  challenges: ProjectSection[];
  metrics: ProjectMetric[];
  screenshots: ProjectScreenshot[];
}

/** Projeto completo: metadados neutros de idioma + conteudo por idioma. */
export interface ProjectDefinition {
  id: string;
  icon: string;
  /** Tecnologias principais — iguais nos dois idiomas, entao ficam fora do bloco traduzido. */
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
  content: Record<Language, ProjectLocaleContent>;
}
