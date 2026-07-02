export interface NamedResource { name: string; url: string }
export interface PokemonType { slot: number; type: NamedResource }
export interface PokemonStat { base_stat: number; effort: number; stat: NamedResource }
export interface PokemonAbility { ability: NamedResource; is_hidden: boolean; slot: number }
export interface PokemonMove { move: NamedResource }
export interface Pokemon {
  id: number; name: string; height: number; weight: number; types: PokemonType[]; stats: PokemonStat[];
  abilities: PokemonAbility[]; moves: PokemonMove[];
  sprites: { front_default: string | null; other: { 'official-artwork': { front_default: string | null } } }
}
export interface PokemonSpecies { evolution_chain: { url: string }; generation: NamedResource; flavor_text_entries: { flavor_text: string; language: NamedResource }[] }
export interface EvolutionNode { species: NamedResource; evolves_to: EvolutionNode[] }
export interface EvolutionChain { chain: EvolutionNode }
export interface Filters { types: string[]; generation: number | null; minHeight: number; maxHeight: number; minWeight: number; maxWeight: number }
export type View = 'pokedex' | 'favorites' | 'compare'
