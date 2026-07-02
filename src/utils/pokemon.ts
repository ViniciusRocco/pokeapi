import type { EvolutionNode, Filters, Pokemon } from '../types.js'

export const TOTAL_POKEMON = 1025
export const PAGE_SIZE = 24

export const defaultFilters: Filters = {
  types: [],
  generation: null,
  minHeight: 0,
  maxHeight: 1000,
  minWeight: 0,
  maxWeight: 10000,
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatPokemonId(id: number): string {
  return `Nº${String(id).padStart(3, '0')}`
}

export function officialArtwork(pokemon: Pokemon): string {
  return pokemon.sprites.other['official-artwork'].front_default
    ?? pokemon.sprites.front_default
    ?? ''
}

export function matchesFilters(pokemon: Pokemon, filters: Filters): boolean {
  const hasTypes = filters.types.length === 0
    || filters.types.every((type) => pokemon.types.some((entry) => entry.type.name === type))

  return hasTypes
    && pokemon.height >= filters.minHeight
    && pokemon.height <= filters.maxHeight
    && pokemon.weight >= filters.minWeight
    && pokemon.weight <= filters.maxWeight
}

export function filterPokemon(
  pokemon: Pokemon[],
  search: string,
  filters: Filters,
  sort: 'asc' | 'desc',
): Pokemon[] {
  const term = search.trim().toLowerCase()
  const numericTerm = term.replace(/[^0-9]/g, '')
  const searchedId = numericTerm.length > 0 ? Number(numericTerm) : null

  return pokemon
    .filter((item) => {
      const matchesSearch = !term
        || item.name.includes(term)
        || (searchedId !== null && item.id === searchedId)

      return matchesSearch && matchesFilters(item, filters)
    })
    .sort((a, b) => sort === 'asc' ? a.id - b.id : b.id - a.id)
}

export function flattenEvolution(node: EvolutionNode): EvolutionNode[] {
  return [node, ...node.evolves_to.flatMap(flattenEvolution)]
}

export function readStoredFilters(): Filters {
  try {
    const raw = localStorage.getItem('pokedex:filters')
    if (!raw) return defaultFilters

    const stored = JSON.parse(raw) as Filters
    const usesLegacyLimits = stored.maxHeight === 200 && stored.maxWeight === 1000
    return usesLegacyLimits ? defaultFilters : stored
  } catch {
    return defaultFilters
  }
}
