# Como o conteúdo do portfólio é organizado

O conteúdo dos projetos **não fica em componentes nem no arquivo de traduções**.
Ele vive em `src/app/data/projects/`, um arquivo por projeto, e é resolvido para
o idioma ativo pelo `ProjectsService`.

O `translation.service.ts` guarda apenas **rótulos de interface** ("Diagramas de
arquitetura", "Fluxos principais"). O texto específico de cada projeto está no
arquivo de dados do projeto, nos dois idiomas.

## Adicionar um novo projeto

1. Crie `src/app/data/projects/<id>.ts` exportando um `ProjectDefinition`
   (o contrato está em `src/app/data/project-content.model.ts`).
2. Registre-o em `src/app/data/projects/index.ts`, no array `PROJECTS`.
   A ordem do array é a ordem do carrossel na home.

Pronto — o card na home e a rota `/projects/<id>` passam a existir sozinhos.
Não há nada a alterar no componente de detalhe: ele renderiza qualquer projeto
que siga o contrato, e cada seção some quando o array correspondente vem vazio.

## Diagramas

As fontes PlantUML ficam em `docs/diagrams/*.puml` e contêm **apenas a estrutura
do diagrama** — sem `skinparam`, sem cor. A paleta é injetada na renderização.

```bash
python tools/render-puml.py            # renderiza todos
python tools/render-puml.py vigilia    # renderiza só os que casam com o filtro
```

Cada fonte gera **duas** variantes em `public/diagrams/`:
`<nome>-light.svg` e `<nome>-dark.svg`. O portfólio tem alternância de tema, e um
SVG de tema único fica ilegível na metade dos casos. O componente de detalhe monta
o caminho final concatenando o tema ativo, então no arquivo de dados o campo `src`
é o caminho **base**, sem sufixo e sem extensão:

```ts
{ src: '/diagrams/vigilia-architecture', ... }
```

Os SVGs gerados são versionados. O portfólio não depende de nenhum serviço externo
em runtime — a renderização acontece só quando você roda o script, e usa o servidor
público do PlantUML (Kroki como fallback) para não exigir Java e Graphviz na máquina.

### Rótulos dos diagramas em inglês

Os diagramas usam termos técnicos em inglês de propósito: um único arquivo serve as
versões pt e en do site. As legendas — que são o texto explicativo de verdade — ficam
traduzidas no arquivo de dados do projeto.

### Largura

Diagrama largo demais fica ilegível quando reduzido. Se um diagrama passar de
~1500px de largura, empilhe os grupos verticalmente com arestas `[hidden]`
(veja `trendertok-architecture.puml`) em vez de deixar o PlantUML espalhar tudo
lado a lado.

## Prints de tela

Ficam em `public/<projeto>/*.png` e são referenciados no campo `screenshots` do
arquivo de dados. Projetos sem print declarado simplesmente não renderizam a seção.
