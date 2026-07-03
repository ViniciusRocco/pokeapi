import { Heart, Trash2 } from 'lucide-react'
import { useStore } from '../../store'
import type { Pokemon } from '../../types'
import { capitalize, formatPokemonId, officialArtwork } from '../../utils/pokemon'
import { TypeBadge } from '../../components/TypeBadge'
import { typeColors } from '../../constants'

export function FavoritesView({ onOpen, onAuthenticate }: { onOpen: (pokemon: Pokemon) => void; onAuthenticate: () => void }) {
  const { account, favorites, toggleFavorite } = useStore()

  if (!account) return <section className="favorites-page"><h1>Favoritos</h1><div className="favorites-empty">
    <img className="guest-favorite-art" src={`${import.meta.env.BASE_URL}assets/image133.png`} alt="Treinador Pokémon" />
    <h2>Você precisa entrar em uma conta para fazer isso.</h2>
    <p>Para acessar esta funcionalidade, é necessário fazer login ou criar uma conta.</p>
    <button onClick={onAuthenticate}>Entre ou Cadastre-se</button>
  </div></section>

  if (favorites.length === 0) return <section className="favorites-page"><h1>Favoritos</h1><div className="favorites-empty">
    <img src={`${import.meta.env.BASE_URL}assets/Magikarp_Jump_Pattern_01.png`} alt="Magikarp" />
    <h2>Você não favoritou nenhum Pokémon :(</h2>
    <p>Clique no ícone de coração dos seus Pokémon favoritos e eles aparecerão aqui.</p>
  </div></section>

  return <section className="favorites-page"><h1>Favoritos</h1><div className="favorite-list">
    {favorites.map((pokemon) => {
      const color = typeColors[pokemon.types[0]?.type.name ?? 'normal']
      return <article className="favorite-row" key={pokemon.id} style={{ '--favorite-color': color } as React.CSSProperties}>
        <button className="favorite-main" onClick={() => onOpen(pokemon)}>
          <div><span>{formatPokemonId(pokemon.id)}</span><h2>{capitalize(pokemon.name)}</h2><div className="types">{pokemon.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}</div></div>
          <div className="favorite-art"><img src={officialArtwork(pokemon)} alt={capitalize(pokemon.name)} /><Heart fill="currentColor" /></div>
        </button>
        <button className="favorite-delete" onClick={() => toggleFavorite(pokemon)} aria-label={`Desfavoritar ${pokemon.name}`}><Trash2 /></button>
      </article>
    })}
  </div></section>
}
