import type { CSSProperties } from 'react'
import { BarChart3, Heart } from 'lucide-react'
import { typeColors } from '../constants'
import { useStore } from '../store'
import type { Pokemon } from '../types'
import { capitalize, formatPokemonId, officialArtwork } from '../utils/pokemon'
import { TypeBadge } from './TypeBadge'

interface PokemonCardProps {
  pokemon: Pokemon
  onOpen: () => void
}

export function PokemonCard({ pokemon, onOpen }: PokemonCardProps) {
  const { isFavorite, toggleFavorite, compare, toggleCompare } = useStore()
  const mainType = pokemon.types[0]?.type.name ?? 'normal'
  const isCompared = compare.some((item) => item.id === pokemon.id)
  const isFavored = isFavorite(pokemon.id)
  const style = { '--accent': typeColors[mainType] } as CSSProperties

  return (
    <article className="pokemon-card" style={style} onClick={onOpen}>
      <div className="card-copy">
        <span className="number">{formatPokemonId(pokemon.id)}</span>
        <h2>{capitalize(pokemon.name)}</h2>
        <div className="types">
          {pokemon.types.map(({ type }) => <TypeBadge type={type.name} key={type.name} />)}
        </div>
      </div>

      <div className="art-panel">
        <span className="shape" />
        <img src={officialArtwork(pokemon)} alt={capitalize(pokemon.name)} loading="lazy" />
      </div>

      <button
        className={`heart ${isFavored ? 'active' : ''}`}
        onClick={(event) => { event.stopPropagation(); toggleFavorite(pokemon) }}
        aria-label={isFavored ? `Desfavoritar ${pokemon.name}` : `Favoritar ${pokemon.name}`}
      >
        <Heart fill={isFavored ? 'currentColor' : 'none'} />
      </button>

      <button
        className={`compare-toggle ${isCompared ? 'active' : ''}`}
        onClick={(event) => { event.stopPropagation(); toggleCompare(pokemon) }}
        aria-label={isCompared ? `Remover ${pokemon.name} da comparação` : `Comparar ${pokemon.name}`}
      >
        <BarChart3 />
      </button>
    </article>
  )
}
