import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowLeft, BarChart3, Heart, LoaderCircle } from 'lucide-react'
import { getEvolutionChain, getSpecies } from '../../api'
import { statPt, typeColors } from '../../constants'
import { useStore } from '../../store'
import type { EvolutionNode, Pokemon } from '../../types'
import { capitalize, formatPokemonId, officialArtwork } from '../../utils/pokemon'
import { TypeBadge } from '../../components/TypeBadge'
import { EvolutionChain } from './EvolutionChain'

interface PokemonDetailsProps {
  pokemon: Pokemon
  onClose: () => void
  onOpen: (pokemon: Pokemon) => void
}

export function PokemonDetails({ pokemon, onClose, onOpen }: PokemonDetailsProps) {
  const { isFavorite, toggleFavorite, compare, toggleCompare } = useStore()
  const [evolution, setEvolution] = useState<EvolutionNode | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const mainType = pokemon.types[0]?.type.name ?? 'normal'
  const isCompared = compare.some((item) => item.id === pokemon.id)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setEvolution(null)

    getSpecies(pokemon.id, controller.signal)
      .then(async (species) => {
        const flavorText = species.flavor_text_entries.find((item) => item.language.name === 'pt')
          ?? species.flavor_text_entries.find((item) => item.language.name === 'en')
        setDescription(flavorText?.flavor_text.replace(/[\n\f]/g, ' ') ?? '')

        const chain = await getEvolutionChain(species.evolution_chain.url, controller.signal)
        setEvolution(chain.chain)
      })
      .catch(() => setEvolution(null))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [pokemon.id])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="details-backdrop" role="presentation">
      <main
        className="details"
        style={{ '--accent': typeColors[mainType] } as CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-title"
      >
        <header>
          <button onClick={onClose} aria-label="Voltar para a listagem"><ArrowLeft /></button>
          <span>{formatPokemonId(pokemon.id)}</span>
          <button onClick={() => toggleFavorite(pokemon)} aria-label="Alternar favorito">
            <Heart fill={isFavorite(pokemon.id) ? 'currentColor' : 'none'} />
          </button>
        </header>

        <div className="detail-hero">
          <div>
            <p>Pokémon</p>
            <h1 id="pokemon-title">{capitalize(pokemon.name)}</h1>
            <div className="types">
              {pokemon.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}
            </div>
          </div>
          <img src={officialArtwork(pokemon)} alt={capitalize(pokemon.name)} />
        </div>

        <section className="detail-body">
          <p className="description">{description}</p>
          <div className="facts">
            <div><span>Altura</span><b>{pokemon.height / 10} m</b></div>
            <div><span>Peso</span><b>{pokemon.weight / 10} kg</b></div>
            <div>
              <span>Habilidades</span>
              <b>{pokemon.abilities.map(({ ability }) => capitalize(ability.name.replace('-', ' '))).join(', ')}</b>
            </div>
          </div>

          <h2>Estatísticas</h2>
          <div className="stats">
            {pokemon.stats.map(({ base_stat: value, stat }) => (
              <div key={stat.name}>
                <span>{statPt[stat.name]}</span>
                <b>{value}</b>
                <i><em style={{ width: `${Math.min(value / 1.6, 100)}%` }} /></i>
              </div>
            ))}
          </div>

          <button
            className={`compare-button ${isCompared ? 'selected' : ''}`}
            onClick={() => toggleCompare(pokemon)}
          >
            <BarChart3 />
            {isCompared ? 'Remover da comparação' : 'Adicionar à comparação'}
          </button>

          <h2>Cadeia de evolução</h2>
          {loading && <LoaderCircle className="spin" aria-label="Carregando evolução" />}
          {!loading && evolution && <div className="evolution"><EvolutionChain node={evolution} onOpen={onOpen} /></div>}
          {!loading && !evolution && <p>Não foi possível carregar a evolução.</p>}
        </section>
      </main>
    </div>
  )
}
