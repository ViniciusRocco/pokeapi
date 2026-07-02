import type { EvolutionChain, Pokemon, PokemonSpecies } from './types'

const BASE = 'https://pokeapi.co/api/v2'

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE}${path}`, { signal })
  if (!response.ok) throw new Error(response.status === 404 ? 'Pokémon não encontrado.' : 'Não foi possível acessar a PokeAPI.')
  return response.json() as Promise<T>
}

const pokemonCache = new Map<string, Promise<Pokemon>>()

export function getPokemon(nameOrId: string | number, signal?: AbortSignal): Promise<Pokemon> {
  const key = String(nameOrId).toLowerCase()
  if (signal) return request<Pokemon>(`/pokemon/${key}`, signal)

  const cached = pokemonCache.get(key)
  if (cached) return cached

  const pending = request<Pokemon>(`/pokemon/${key}`).catch((error: unknown) => {
    pokemonCache.delete(key)
    throw error
  })
  pokemonCache.set(key, pending)
  return pending
}

export const getSpecies = (id: number, signal?: AbortSignal) =>
  request<PokemonSpecies>(`/pokemon-species/${id}`, signal)

export async function getEvolutionChain(url: string, signal?: AbortSignal): Promise<EvolutionChain> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Não foi possível carregar as evoluções.')
  return response.json() as Promise<EvolutionChain>
}

export const generationRange = (generation: number | null): [number, number] => {
  const ranges: Record<number, [number, number]> = { 1: [1, 151], 2: [152, 251], 3: [252, 386], 4: [387, 493], 5: [494, 649], 6: [650, 721], 7: [722, 809], 8: [810, 905], 9: [906, 1025] }
  return generation ? ranges[generation] : [1, 1025]
}

export async function getPokemonRange(
  start: number,
  end: number,
  onProgress?: (loaded: Pokemon[]) => void,
): Promise<Pokemon[]> {
  const ids = Array.from({ length: end - start + 1 }, (_, index) => start + index)
  const loaded: Pokemon[] = []
  const concurrency = 30

  for (let index = 0; index < ids.length; index += concurrency) {
    const batch = await Promise.all(
      ids.slice(index, index + concurrency).map((id) => getPokemon(id)),
    )
    loaded.push(...batch)
    onProgress?.([...loaded])
  }

  return loaded
}
