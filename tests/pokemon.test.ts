import type { Pokemon } from '../src/types.js'
import { defaultFilters, filterPokemon, formatPokemonId, matchesFilters } from '../src/utils/pokemon.js'
import { test } from 'vitest'

function createPokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  return {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    types: [
      { slot: 1, type: { name: 'grass', url: '' } },
      { slot: 2, type: { name: 'poison', url: '' } },
    ],
    stats: [],
    abilities: [],
    moves: [],
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } } },
    ...overrides,
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Falhou: ${message}`)
  console.log(`✓ ${message}`)
}

test('busca, filtros, limites e ordenação', () => {
const bulbasaur = createPokemon()
const charmander = createPokemon({
  id: 4,
  name: 'charmander',
  types: [{ slot: 1, type: { name: 'fire', url: '' } }],
})

assert(formatPokemonId(7) === 'Nº007', 'formata números com três dígitos')
assert(formatPokemonId(1025) === 'Nº1025', 'preserva números com quatro dígitos')
assert(
  matchesFilters(bulbasaur, { ...defaultFilters, types: ['grass', 'poison'] }),
  'aceita Pokémon que contém todos os tipos selecionados',
)
assert(
  !matchesFilters(bulbasaur, { ...defaultFilters, types: ['grass', 'flying'] }),
  'rejeita Pokémon sem um dos tipos selecionados',
)
assert(
  matchesFilters(bulbasaur, { ...defaultFilters, minHeight: 7, maxWeight: 69 }),
  'inclui os limites exatos de altura e peso',
)
assert(
  filterPokemon([bulbasaur, charmander], 'char', defaultFilters, 'asc')[0]?.id === 4,
  'busca por trecho do nome',
)
assert(
  filterPokemon([bulbasaur, charmander], 'Nº001', defaultFilters, 'asc')[0]?.id === 1,
  'busca pelo número formatado',
)
assert(
  filterPokemon([bulbasaur, charmander], '', defaultFilters, 'desc')[0]?.id === 4,
  'ordena por número decrescente',
)
})
