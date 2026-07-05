export interface NamedResource { name: string; url: string }
export interface PokemonType { slot: number; type: NamedResource }
export interface PokemonStat { base_stat: number; effort: number; stat: NamedResource }
export interface PokemonAbility { ability: NamedResource; is_hidden: boolean; slot: number }
export interface MoveVersionDetail { level_learned_at: number; move_learn_method: NamedResource; version_group: NamedResource }
export interface PokemonMove { move: NamedResource; version_group_details: MoveVersionDetail[] }
export interface MoveDetail { id: number; name: string; accuracy: number | null; power: number | null; pp: number; type: NamedResource; damage_class: NamedResource }
export interface Pokemon {
  id: number; name: string; height: number; weight: number; types: PokemonType[]; stats: PokemonStat[];
  abilities: PokemonAbility[]; moves: PokemonMove[];
  sprites: { front_default: string | null; other: { 'official-artwork': { front_default: string | null } } }
}
export interface PokemonSpecies { evolution_chain: { url: string }; generation: NamedResource; flavor_text_entries: { flavor_text: string; language: NamedResource }[] }
export interface EvolutionDetail { min_level: number | null; trigger: NamedResource; item: NamedResource | null }
export interface EvolutionNode { species: NamedResource; evolution_details: EvolutionDetail[]; evolves_to: EvolutionNode[] }
export interface EvolutionChain { chain: EvolutionNode }
export interface TypeDamageRelations {
  double_damage_from: NamedResource[]
  double_damage_to: NamedResource[]
  half_damage_from: NamedResource[]
  half_damage_to: NamedResource[]
  no_damage_from: NamedResource[]
  no_damage_to: NamedResource[]
}
export interface Filters { types: string[]; generation: number | null; minHeight: number; maxHeight: number; minWeight: number; maxWeight: number }
export interface Account { name: string; email: string }
export type View = 'pokedex' | 'favorites' | 'compare' | 'team' | 'guide' | 'profile'
