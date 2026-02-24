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
      items: string[];
    };
    jediet: {
      title: string;
      company: string;
      period: string;
      items: string[];
    };
    prefeitura: {
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
      languages: string;
      frontend: string;
      backend: string;
      desktop: string;
      databases: string;
      cloud: string;
      ai: string;
    };
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
      subtitle: 'Full Stack Software Engineer',
      description: 'Desenvolvedor apaixonado por criar soluções escaláveis e de alta qualidade, com foco em arquitetura de software, inteligência artificial e melhores práticas.',
      aboutButton: 'Sobre Mim',
      skillsButton: 'Tecnologias'
    },
    about: {
      title: 'Sobre Mim',
      intro: 'Sou um Full Stack Software Engineer com 3 anos de experiência em desenvolvimento de software, formado em Análise e Desenvolvimento de Sistemas pela Uninter, com pós-graduação em Engenharia de Computação e outra em Ciência de Dados e Inteligência Artificial.',
      paragraph1: 'Trabalho no desenvolvimento de soluções frontend, backend e desktop, participando de todo o ciclo de vida da aplicação, desde a coleta de requisitos até o deploy em produção e manutenção.',
      paragraph2: 'Tenho forte foco em qualidade de código, escalabilidade, arquitetura de software e melhores práticas. Em projetos recentes, tenho trabalhado ativamente com Inteligência Artificial aplicada, especialmente no desenvolvimento de assistentes inteligentes e soluções baseadas em LLM, utilizando RAG e integração com APIs de IA.',
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
          description: '5+ anos desenvolvendo soluções'
        }
      }
    },
    experience: {
      title: 'Experiência Profissional',
      current: 'Atual',
      rodonaves: {
        title: 'Full Stack Software Engineer',
        company: 'Rodonaves',
        period: '2 anos (Atual)',
        items: [
          'Desenvolvimento e manutenção de aplicações web e desktop (Windows Forms .NET)',
          'Trabalho em sistemas corporativos críticos de alta disponibilidade',
          'Integração entre aplicações desktop, APIs backend e serviços cloud',
          'Contribuição para melhorias arquiteturais, otimização de performance e escalabilidade',
          'Suporte para automação de processos e adoção de soluções baseadas em IA'
        ]
      },
      jediet: {
        title: 'Software Engineer',
        company: 'Jediet',
        period: '1 ano',
        items: [
          'Desenvolvimento de aplicações web',
          'Implementação de novas funcionalidades e melhorias contínuas',
          'Participação em decisões técnicas e evolução da arquitetura do produto'
        ]
      },
      prefeitura: {
        title: 'Aprendiz em TI / Infraestrutura',
        company: 'Prefeitura Municipal de Santa Rita do Passa Quatro',
        period: '2018 - 2019',
        items: [
          'Suporte e manutenção de equipamentos e rede',
          'Atuação em infraestrutura de TI no setor público'
        ]
      }
    },
    skills: {
      title: 'Habilidades Técnicas',
      categories: {
        languages: 'Linguagens',
        frontend: 'Frontend',
        backend: 'Backend',
        desktop: 'Desktop (.NET)',
        databases: 'Bancos de Dados',
        cloud: 'Cloud & DevOps',
        ai: 'Inteligência Artificial'
      }
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
      subtitle: 'Full Stack Software Engineer',
      description: 'Developer passionate about creating scalable and high-quality solutions, with a focus on software architecture, artificial intelligence, and best practices.',
      aboutButton: 'About Me',
      skillsButton: 'Technologies'
    },
    about: {
      title: 'About Me',
      intro: 'I am a Full Stack Software Engineer with 5 years of experience in software development, holding a degree in Systems Analysis and Development from Uninter, as well as a postgraduate degree in Computer Engineering and another in Data Science and Artificial Intelligence.',
      paragraph1: 'I work on developing frontend, backend, and desktop solutions, participating in the entire application lifecycle, from requirements gathering to production deployment and maintenance.',
      paragraph2: 'I have a strong focus on code quality, scalability, software architecture, and best practices. In recent projects, I have been actively working with applied Artificial Intelligence, especially in developing intelligent assistants and LLM-based solutions, using RAG and integrating with AI APIs.',
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
          description: '5+ years developing solutions'
        }
      }
    },
    experience: {
      title: 'Professional Experience',
      current: 'Current',
      rodonaves: {
        title: 'Full Stack Software Engineer',
        company: 'Rodonaves',
        period: '2 years (Current)',
        items: [
          'Development and maintenance of web and desktop applications (Windows Forms .NET)',
          'Work on mission-critical, high-availability corporate systems',
          'Integration between desktop applications, backend APIs, and cloud services',
          'Contribution to architectural improvements, performance optimization, and scalability',
          'Support for process automation and adoption of AI-based solutions'
        ]
      },
      jediet: {
        title: 'Software Engineer',
        company: 'Jediet',
        period: '1 year',
        items: [
          'Development of web applications',
          'Implementation of new features and continuous improvements',
          'Participation in technical decision-making and product architecture evolution'
        ]
      },
      prefeitura: {
        title: 'IT / Infrastructure Apprentice',
        company: 'Santa Rita do Passa Quatro City Hall',
        period: '2018 - 2019',
        items: [
          'Hardware and network support and maintenance',
          'IT infrastructure operations in the public sector'
        ]
      }
    },
    skills: {
      title: 'Technical Skills',
      categories: {
        languages: 'Languages',
        frontend: 'Frontend',
        backend: 'Backend',
        desktop: 'Desktop (.NET)',
        databases: 'Databases',
        cloud: 'Cloud & DevOps',
        ai: 'Artificial Intelligence'
      }
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
