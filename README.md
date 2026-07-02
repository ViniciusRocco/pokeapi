# Pokédex — desafio frontend

Aplicação React + TypeScript que consome a [PokeAPI](https://pokeapi.co/) e reproduz a linguagem visual dos layouts fornecidos no desafio.

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
- listagem inicial com todas as nove gerações; cada geração também pode ser isolada pelo filtro;
- cache de requisições em memória e concorrência limitada para evitar chamadas duplicadas e pressão excessiva sobre a API;
- imagens obtidas do campo `official-artwork` da PokeAPI, com fallback para o sprite padrão;
- testes unitários para busca, filtros múltiplos, limites, ordenação e formatação.
