import type { EvolutionChain, MoveDetail, NamedResource, Pokemon, PokemonSpecies, TypeDamageRelations } from './types'

const BASE = 'https://pokeapi.co/api/v2'

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE}${path}`, { signal })
  if (!response.ok) throw new Error(response.status === 404 ? 'Pokémon não encontrado.' : 'Não foi possível acessar a PokeAPI.')
  return response.json() as Promise<T>
}

const pokemonCache = new Map<string, Promise<Pokemon>>()

interface ResourceList { results: NamedResource[] }
interface TypeResponse { pokemon: { pokemon: NamedResource }[]; damage_relations: TypeDamageRelations }

let pokemonIndex: Promise<NamedResource[]> | undefined
const typeIndex = new Map<string, Promise<Set<number>>>()
const typeRelationsCache = new Map<string, Promise<TypeDamageRelations>>()
const moveCache = new Map<string, Promise<MoveDetail>>()

function resourceId(resource: NamedResource): number {
  return Number(resource.url.split('/').filter(Boolean).at(-1))
}

export function getPokemonIndex(): Promise<NamedResource[]> {
  pokemonIndex ??= request<ResourceList>('/pokemon?limit=1025')
    .then(({ results }) => results)
    .catch((error: unknown) => {
      pokemonIndex = undefined
      throw error
    })
  return pokemonIndex
}

export function getPokemonIdsByType(type: string): Promise<Set<number>> {
  const cached = typeIndex.get(type)
  if (cached) return cached

  const pending = request<TypeResponse>(`/type/${type}`)
    .then(({ pokemon }) => new Set(pokemon.map((entry) => resourceId(entry.pokemon))))
    .catch((error: unknown) => {
      typeIndex.delete(type)
      throw error
    })
  typeIndex.set(type, pending)
  return pending
}

export function getTypeRelations(type: string): Promise<TypeDamageRelations> {
  const cached = typeRelationsCache.get(type)
  if (cached) return cached
  const pending = request<TypeResponse>(`/type/${type}`)
    .then(({ damage_relations }) => damage_relations)
    .catch((error: unknown) => {
      typeRelationsCache.delete(type)
      throw error
    })
  typeRelationsCache.set(type, pending)
  return pending
}

export function getMove(name: string): Promise<MoveDetail> {
  const cached = moveCache.get(name)
  if (cached) return cached
  const pending = request<MoveDetail>(`/move/${name}`).catch((error: unknown) => {
    moveCache.delete(name)
    throw error
  })
  moveCache.set(name, pending)
  return pending
}

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

export async function getPokemonBatch(ids: number[]): Promise<Pokemon[]> {
  return Promise.all(ids.map((id) => getPokemon(id)))
}
