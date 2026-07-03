import { useEffect, useState } from 'react'
import { getPokemon } from '../../api'
import type { EvolutionNode, Pokemon } from '../../types'
import { capitalize, officialArtwork } from '../../utils/pokemon'
import { recommendedEvolutionLevel } from '../../utils/moves'

interface EvolutionChainProps {
  node: EvolutionNode
  onOpen: (pokemon: Pokemon) => void
}

export function EvolutionChain({ node, onOpen }: EvolutionChainProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)

  useEffect(() => {
    let active = true
    getPokemon(node.species.name)
      .then((result) => { if (active) setPokemon(result) })
      .catch(() => undefined)
    return () => { active = false }
  }, [node.species.name])

  return (
    <>
      {pokemon && (
        <button className="evolution-item" onClick={() => onOpen(pokemon)}>
          <img src={officialArtwork(pokemon)} alt="" />
          <span>{capitalize(pokemon.name)}</span>
        </button>
      )}
      {node.evolves_to.map((child) => (
        <span className="evo-branch" key={child.species.name}>
          <span className="evolution-requirement">
            <b aria-hidden="true">→</b>
            <small>{evolutionRequirement(child)}</small>
            {pokemon && <EvolutionAdvice current={pokemon} child={child} />}
          </span>
          <EvolutionChain node={child} onOpen={onOpen} />
        </span>
      ))}
    </>
  )
}

function EvolutionAdvice({ current, child }: { current: Pokemon; child: EvolutionNode }) {
  const [evolution, setEvolution] = useState<Pokemon | null>(null)
  useEffect(() => {
    let active = true
    getPokemon(child.species.name).then((result) => { if (active) setEvolution(result) }).catch(() => undefined)
    return () => { active = false }
  }, [child.species.name])
  if (!evolution) return null
  const advice = recommendedEvolutionLevel(current, evolution, child.evolution_details[0]?.min_level ?? null)
  return <em title={advice.reason}>{advice.level ? `Sugestão: nível ${advice.level}` : 'Pode evoluir agora'}</em>
}

function evolutionRequirement(node: EvolutionNode): string {
  const detail = node.evolution_details[0]
  if (!detail) return 'Evolução'
  if (detail.min_level) return `Nível ${detail.min_level}`
  if (detail.item) return detail.item.name.replaceAll('-', ' ')
  if (detail.trigger.name === 'trade') return 'Troca'
  if (detail.trigger.name === 'use-item') return 'Usar item'
  return 'Condição especial'
}
