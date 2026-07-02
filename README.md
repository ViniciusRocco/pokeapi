# Pokédex — desafio frontend

Aplicação React + TypeScript que consome a [PokeAPI](https://pokeapi.co/) e reproduz a linguagem visual dos layouts fornecidos no desafio.

**Deploy:** [viniciusrocco.github.io/pokeapi](https://viniciusrocco.github.io/pokeapi/)

## Rodando localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

Qualidade de código:

```bash
npm run lint
npm test
```

## Funcionalidades

- catálogo com os 1.025 Pokémons oficiais das nove gerações, com carregamento incremental, sprites e tipos;
- busca por nome ou número;
- filtros múltiplos por tipo, geração, altura e peso;
- ordenação crescente e decrescente;
- detalhes, estatísticas, habilidades e cadeia evolutiva;
- favoritos persistidos no `localStorage`;
- comparação de estatísticas entre dois Pokémons;
- layout responsivo para mobile e desktop;
- estados de carregamento, vazio e erro.

## Decisões técnicas

- TypeScript em modo `strict`, sem `any`;
- arquitetura organizada por domínio (`components`, `features`, `hooks`, `utils`), mantendo o `App` como camada de composição;
- Context API para o estado global de favoritos e comparação, evitando dependência adicional para um estado pequeno e previsível;
- filtros e favoritos persistidos no navegador;
- índice das nove gerações carregado em uma única chamada, com detalhes buscados apenas para os cards visíveis;
- busca e filtros por tipo/geração resolvidos antes do carregamento dos detalhes;
- cache de requisições em memória para evitar chamadas duplicadas e reduzir a pressão sobre a API;
- imagens obtidas do campo `official-artwork` da PokeAPI, com fallback para o sprite padrão;
- testes unitários e de componentes para busca, filtros múltiplos, ordenação, teclado e persistência.

## Deploy

O deploy é automatizado pelo GitHub Actions a cada atualização da branch `main`. O workflow executa testes e build antes de publicar no GitHub Pages.
