# Portfólio 2.0

Portfólio pessoal desenvolvido em **Angular 18** com suporte a temas (claro/escuro), internacionalização (PT/EN) e layout responsivo.

## Sobre o projeto

Site one-page que apresenta experiência profissional, formação, habilidades e formas de contato. Inclui animação em estilo código no hero, timeline de experiências, cards de skills e certificações (incluindo AWS).

## Funcionalidades

- **Tema claro/escuro** — alternância via `ThemeToggle`
- **Idiomas** — Português e Inglês com `TranslationService` e persistência no `localStorage`
- **Seções**
  - **Hero** — Apresentação com animação em código
  - **Sobre** — Texto e cards (graduação, pós em Data Science, Engenharia de Computação, AWS Practitioner, AWS Solutions Architect, Etec, experiência)
  - **Experiência** — Timeline (Rodonaves, Jediet, Prefeitura)
  - **Skills** — Linguagens, frontend, backend, desktop, bancos de dados, cloud (AWS, Docker, CI/CD), IA (LLMs, RAG, OpenAI)
  - **Contato** — E-mail, LinkedIn, GitHub e WhatsApp

## Stack

- **Angular** 18 (standalone components, signals)
- **TypeScript** 5.5
- **SCSS** (variáveis e estilos globais em `src/styles/`)
- **Angular SSR** (opcional)

## Como rodar

### Pré-requisitos

- Node.js (versão compatível com Angular 18)
- npm ou yarn

### Instalação

```bash
npm install
```

### Servidor de desenvolvimento

```bash
npm start
# ou
ng serve
```

Acesse `http://localhost:4200/`. A aplicação recarrega automaticamente ao alterar os arquivos.

### Build de produção

```bash
ng build
```

Artefatos em `dist/`.

### Testes

```bash
ng test
```

## Estrutura principal

```
src/app/
├── home/                 # Página principal (hero, about, experience, skills, contact)
├── components/           # button, highlight-card, skill-card, timeline-item, theme-toggle, language-selector
├── services/             # translation.service, theme.service
└── styles/               # Variáveis e estilos globais (SCSS)
```

## Contato

- **E-mail:** rennanbaccili@gmail.com  
- **LinkedIn:** [rennan-bacili-dev](https://www.linkedin.com/in/rennan-bacili-dev/)  
- **GitHub:** [RennanBaccili](https://github.com/RennanBaccili)

---

*Projeto gerado com [Angular CLI](https://github.com/angular/angular-cli) 18.2.12.*
