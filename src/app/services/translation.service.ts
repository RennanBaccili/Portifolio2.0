import { Injectable, Signal, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'pt' | 'en';

export interface Translations {
  // Hero Section
  hero: {
    greeting: string;
    name: string;
    subtitle: string;
    description: string;
    aboutButton: string;
    skillsButton: string;
  };
  // About Section
  about: {
    title: string;
    intro: string;
    paragraph1: string;
    paragraph2: string;
    etec: string;
      highlights: {
        graduation: {
          title: string;
          description: string;
        };
        postgradDataScience: {
          title: string;
          description: string;
        };
        postgradComputerEngineering: {
          title: string;
          description: string;
        };
        awsPractitioner: {
          title: string;
          description: string;
        };
        awsSolutionsArchitect: {
          title: string;
          description: string;
        };
        etec: {
          title: string;
          description: string;
        };
        experience: {
          title: string;
          description: string;
        };
      };
  };
  // Experience Section
  experience: {
    title: string;
    current: string;
    rodonaves: {
      title: string;
      company: string;
      period: string;
      context: string;
      items: string[];
    };
    jediet: {
      title: string;
      company: string;
      period: string;
      items: string[];
    };
    selfEmployed: {
      title: string;
      company: string;
      period: string;
      items: string[];
    };
  };
  // Skills Section
  skills: {
    title: string;
    categories: {
      languagesFrameworks: string;
      databases: string;
      cloudInfrastructure: string;
      architecture: string;
      observability: string;
      appliedAi: string;
    };
  };
  // Projects Section
  projects: {
    title: string;
    viewProject: string;
  };
  // Project Detail — apenas rotulos. O conteudo de cada projeto vive
  // em src/app/data/projects e e resolvido pelo ProjectsService.
  projectDetail: {
    backToProjects: string;
    overviewAndArchitecture: string;
    architectureDiagrams: string;
    aiFocus: string;
    mainFlows: string;
    architecturalDecisions: string;
    technicalChallenges: string;
    functionalFlowAndScreens: string;
    diagramZoomHint: string;
    flowIntro: string;
    flowHint: string;
    projectNotFound: string;
    imageViewAlt: string;
    stackLabel: string;
    roleLabel: string;
  };
  // Contact Section
  contact: {
    title: string;
    description: string;
    contactButton: string;
    linkedin: string;
    github: string;
    whatsapp: string;
  };
}

const translations: Record<Language, Translations> = {
  pt: {
    hero: {
      greeting: 'Olá, eu sou',
      name: 'Rennan',
      subtitle: 'Software Engineer | .NET & C# | Full Stack | AWS',
      description: 'Transformo processos manuais em sistemas automatizados que geram resultado mensurável: já reduzi o tempo de execução de um fluxo crítico em 90% e cortei um deploy de 30 minutos para 1 minuto. Full stack em .NET (C#) e Angular, com AWS e IA aplicada.',
      aboutButton: 'Sobre Mim',
      skillsButton: 'Tecnologias'
    },
    about: {
      title: 'Sobre Mim',
      intro: 'Sou Full Stack Software Engineer com 6 anos de experiência em desenvolvimento de software, incluindo os últimos 3 anos na Rodonaves construindo sistemas corporativos críticos em .NET (C#), Angular e AWS. Formado em Análise e Desenvolvimento de Sistemas pela Uninter, com pós-graduação em Engenharia de Computação e outra em Ciência de Dados e Inteligência Artificial. AWS Certified Solutions Architect – Associate.',
      paragraph1: 'Meu foco é resolver problema de negócio com código e medir o resultado. Redesenhei um fluxo manual crítico na Rodonaves e reduzi o tempo de execução de ~35 minutos para 3 minutos (-90%) em mais de 300 filiais, e troquei um deploy manual de 30 minutos por um pipeline de CI/CD de 1 minuto (-97%).',
      paragraph2: 'Também lidero modernização de sistemas legados — migrando telas Windows Forms para Angular sem interromper a operação — e apliquei IA de forma prática, implementando um assistente inteligente com LLM e RAG que reduziu o tempo que os times gastam procurando informação.',
      etec: 'Formação técnica em Informática para Internet pela ETEC Manoel dos Reis Araújo (2015 - 2018).',
      highlights: {
        graduation: {
          title: 'Análise e Desenvolvimento de Sistemas',
          description: 'Graduação - Uninter'
        },
        postgradDataScience: {
          title: 'Ciências de Dados e Inteligência Artificial',
          description: 'Pós-graduação'
        },
        postgradComputerEngineering: {
          title: 'Engenharia da Computação',
          description: 'Pós-graduação'
        },
        awsPractitioner: {
          title: 'AWS Cloud Practitioner',
          description: 'Certificação AWS'
        },
        awsSolutionsArchitect: {
          title: 'AWS Solutions Architect Associate',
          description: 'Certificação AWS'
        },
        etec: {
          title: 'Técnico em Informática para Internet',
          description: 'ETEC Manoel dos Reis Araújo - 3 anos (2015-2018)'
        },
        experience: {
          title: 'Experiência',
          description: '6 anos desenvolvendo soluções'
        }
      }
    },
    experience: {
      title: 'Experiência Profissional',
      current: 'Atual',
      rodonaves: {
        title: 'Software Engineer',
        company: 'Rodonaves',
        period: '2023 – Presente (3 anos)',
        context: 'Frete & logística — uma das maiores transportadoras do Brasil, ~R$2,5 bi de receita anual, 9.000+ funcionários, 15 hubs de transferência de carga.',
        items: [
          'Redesenhei um fluxo manual crítico em processo automatizado com .NET (C#), reduzindo o tempo de execução de ~35 minutos para 3 minutos (-90%) em mais de 300 filiais',
          'Implementei pipelines de CI/CD (Jenkins no Rancher), substituindo um deploy manual de 30 minutos por um deploy de 1 minuto (-97%)',
          'Liderei a adoção de um assistente inteligente com LLM e RAG para documentação interna, reduzindo o tempo que os times gastam buscando informação',
          'Liderei a migração de telas legadas em Windows Forms para Angular, mantendo as duas stacks em paralelo para garantir continuidade do negócio',
          'Decompus um monólito em serviços orientados a eventos com RabbitMQ e implementei observabilidade estruturada com Application Insights, reduzindo o tempo de diagnóstico de incidentes em produção'
        ]
      },
      jediet: {
        title: 'Software Engineer (Part-time)',
        company: 'Jediet',
        period: 'Nov 2023 – Mar 2024 (5 meses)',
        items: [
          'Ajudei a arquitetar o produto do zero com Angular, .NET (C#) e PostgreSQL, cobrindo levantamento de requisitos, desenho do pipeline de dados e arquitetura do produto',
          'Apliquei Clean Architecture e TDD desde o início do projeto, garantindo uma base de código testável, desacoplada e escalável',
          'Conduzi o desenvolvimento do MVP do conceito até um produto funcional pronto para o mercado, em conjunto com design de produto e engenharia'
        ]
      },
      selfEmployed: {
        title: 'Software Engineer (Full-time)',
        company: 'Autônomo',
        period: 'Jan 2023 – Jan 2024 (1 ano e 1 mês)',
        items: [
          'Redesenhei fluxos de gestão de restaurante em uma aplicação web full stack com React e .NET (C#), habilitando controle de cardápio em tempo real, gestão de equipe e permissionamento por papel',
          'Construí um sistema de controle de acesso granular com múltiplos papéis de equipe, reduzindo erros operacionais ligados a ações não autorizadas',
          'Entreguei a solução de ponta a ponta de forma independente, do levantamento de requisitos ao deploy, usando PostgreSQL como banco principal'
        ]
      }
    },
    skills: {
      title: 'Habilidades Técnicas',
      categories: {
        languagesFrameworks: 'Linguagens & Frameworks',
        databases: 'Bancos de Dados',
        cloudInfrastructure: 'Cloud & Infraestrutura',
        architecture: 'Arquitetura',
        observability: 'Observabilidade',
        appliedAi: 'IA Aplicada'
      }
    },
    projects: {
      title: 'Projetos',
      viewProject: 'Ver projeto'
    },
    projectDetail: {
      backToProjects: 'Voltar aos projetos',
      overviewAndArchitecture: 'Visão geral e arquitetura',
      architectureDiagrams: 'Diagramas de arquitetura',
      aiFocus: 'Inteligência artificial',
      mainFlows: 'Fluxos principais',
      architecturalDecisions: 'Decisões arquiteturais',
      technicalChallenges: 'Desafios técnicos',
      functionalFlowAndScreens: 'Fluxo funcional e principais telas',
      diagramZoomHint: 'Clique no diagrama para ampliar.',
      flowIntro: 'As telas a seguir mostram o produto em uso no dia a dia, seguindo a ordem natural do fluxo.',
      flowHint: 'Role a página para ir avançando pelas telas do fluxo.',
      projectNotFound: 'Projeto não encontrado.',
      imageViewAlt: 'Visualização da tela do projeto',
      stackLabel: 'Stack',
      roleLabel: 'Atuação'
    },
    contact: {
      title: 'Vamos Conversar?',
      description: 'Estou sempre aberto a discutir novos projetos, oportunidades de colaboração ou apenas trocar ideias sobre tecnologia e desenvolvimento de software.',
      contactButton: 'Entre em Contato',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      whatsapp: 'WhatsApp'
    }
  },
  en: {
    hero: {
      greeting: 'Hello, I am',
      name: 'Rennan',
      subtitle: 'Software Engineer | .NET & C# | Full Stack | AWS',
      description: 'I turn manual processes into automated systems that produce measurable results: I have cut a critical workflow execution time by 90% and reduced a 30-minute deploy to 1 minute. Full stack in .NET (C#) and Angular, with AWS and applied AI.',
      aboutButton: 'About Me',
      skillsButton: 'Technologies'
    },
    about: {
      title: 'About Me',
      intro: 'Full Stack Software Engineer with 6 years of software development experience, including the last 3 years at Rodonaves building mission-critical enterprise systems in .NET (C#), Angular and AWS. B.Sc. in Systems Analysis and Development from Uninter, with postgraduate degrees in Computer Engineering and in Data Science & AI. AWS Certified Solutions Architect – Associate.',
      paragraph1: 'My focus is solving business problems with code and measuring the outcome. I redesigned a critical manual workflow at Rodonaves, cutting execution time from ~35 minutes to 3 minutes (-90%) across 300+ branches, and replaced a 30-minute manual deploy with a 1-minute CI/CD pipeline (-97%).',
      paragraph2: 'I also lead legacy system modernization — migrating Windows Forms screens to Angular without disrupting the business — and apply AI in practice, having built an LLM + RAG intelligent assistant that reduced the time teams spend searching for information.',
      etec: 'Technical degree in Internet Computing from ETEC Manoel dos Reis Araújo (2015 - 2018).',
      highlights: {
        graduation: {
          title: 'Systems Analysis and Development',
          description: 'Bachelor\'s Degree - Uninter'
        },
        postgradDataScience: {
          title: 'Data Science and Artificial Intelligence',
          description: 'Postgraduate Degree'
        },
        postgradComputerEngineering: {
          title: 'Computer Engineering',
          description: 'Postgraduate Degree'
        },
        awsPractitioner: {
          title: 'AWS Cloud Practitioner',
          description: 'AWS Certification'
        },
        awsSolutionsArchitect: {
          title: 'AWS Solutions Architect Associate',
          description: 'AWS Certification'
        },
        etec: {
          title: 'Technical degree in Internet Computing',
          description: 'ETEC Manoel dos Reis Araújo - 3 years (2015-2018)'
        },
        experience: {
          title: 'Experience',
          description: '6 years developing solutions'
        }
      }
    },
    experience: {
      title: 'Professional Experience',
      current: 'Current',
      rodonaves: {
        title: 'Software Engineer',
        company: 'Rodonaves',
        period: '2023 – Present (3 years)',
        context: 'Freight & logistics — one of Brazil\'s largest trucking/logistics companies, ~$500M USD annual revenue, 9,000+ employees, 15 cargo transfer hubs nationwide.',
        items: [
          'Redesigned a critical manual workflow into an automated .NET (C#) process, cutting execution time from ~35 minutes to 3 minutes (-90%) across 300+ branches',
          'Streamlined API delivery with CI/CD pipelines (Jenkins on Rancher), replacing a 30-minute manual deploy with a 1-minute deploy (-97%)',
          'Led the adoption of an LLM + RAG-based intelligent assistant for internal documentation, reducing the time employees spend searching for information',
          'Led the migration of legacy Windows Forms screens to Angular, running both stacks in parallel to guarantee business continuity',
          'Decomposed a monolith into event-driven services using RabbitMQ and implemented structured observability with Application Insights, reducing production incident diagnosis time'
        ]
      },
      jediet: {
        title: 'Software Engineer (Part-time)',
        company: 'Jediet',
        period: 'Nov 2023 – Mar 2024 (5 months)',
        items: [
          'Helped architect the product from the ground up using Angular, .NET (C#) and PostgreSQL, covering requirements extraction, data pipeline design and product architecture',
          'Applied Clean Architecture and TDD principles from the project inception, ensuring a testable, decoupled and scalable codebase',
          'Drove MVP development from concept to a fully functional, market-ready product, working cross-functionally between product design and engineering'
        ]
      },
      selfEmployed: {
        title: 'Software Engineer (Full-time)',
        company: 'Self-employed',
        period: 'Jan 2023 – Jan 2024 (1 yr 1 mo)',
        items: [
          'Redesigned restaurant management workflows into a full-stack web application using React and .NET (C#), enabling real-time menu control, staff management and role-based permissioning',
          'Built a granular access control system supporting multiple staff roles, reducing operational errors related to unauthorized actions',
          'Delivered end-to-end solutions independently, from requirements gathering through deployment, using PostgreSQL as the primary database'
        ]
      }
    },
    skills: {
      title: 'Technical Skills',
      categories: {
        languagesFrameworks: 'Languages & Frameworks',
        databases: 'Databases',
        cloudInfrastructure: 'Cloud & Infrastructure',
        architecture: 'Architecture',
        observability: 'Observability',
        appliedAi: 'Applied AI'
      }
    },
    projects: {
      title: 'Projects',
      viewProject: 'View project'
    },
    projectDetail: {
      backToProjects: 'Back to projects',
      overviewAndArchitecture: 'Overview and architecture',
      architectureDiagrams: 'Architecture diagrams',
      aiFocus: 'Artificial intelligence',
      mainFlows: 'Main flows',
      architecturalDecisions: 'Architectural decisions',
      technicalChallenges: 'Technical challenges',
      functionalFlowAndScreens: 'Functional flow and main screens',
      diagramZoomHint: 'Click the diagram to enlarge.',
      flowIntro: 'The following screens show the product in day-to-day use, following the natural order of the flow.',
      flowHint: 'Scroll the page to move through the flow screens.',
      projectNotFound: 'Project not found.',
      imageViewAlt: 'Project screen view',
      stackLabel: 'Stack',
      roleLabel: 'Role'
    },
    contact: {
      title: 'Let\'s Talk?',
      description: 'I am always open to discussing new projects, collaboration opportunities, or just exchanging ideas about technology and software development.',
      contactButton: 'Get in Touch',
      linkedin: 'LinkedIn',
        github: 'GitHub',
      whatsapp: 'WhatsApp'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private platformId = inject(PLATFORM_ID);
  private currentLanguage = signal<Language>('en');
  
  public readonly language: Signal<Language> = this.currentLanguage.asReadonly();
  public readonly t: Signal<Translations> = computed(() => translations[this.currentLanguage()]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('portfolio-language') as Language;
      if (savedLang && (savedLang === 'pt' || savedLang === 'en')) {
        this.currentLanguage.set(savedLang);
      }
    }
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    // Save to localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('portfolio-language', lang);
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'pt' ? 'en' : 'pt';
    this.setLanguage(newLang);
  }
}
