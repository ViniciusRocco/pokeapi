import { useEffect, useState } from 'react'
import { getPokemon } from '../../api'
import type { EvolutionNode, Pokemon } from '../../types'
import { capitalize, officialArtwork } from '../../utils/pokemon'

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
          <b aria-hidden="true">→</b>
          <EvolutionChain node={child} onOpen={onOpen} />
        </span>
      ))}
    </>
  )
}
