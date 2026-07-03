import { useEffect, useMemo, useState } from 'react'
import { ShieldAlert, Target } from 'lucide-react'
import { getTypeRelations } from '../../api'
import { allTypes, typePt } from '../../constants'
import type { Pokemon } from '../../types'
import { defensiveMultiplier, offensiveMultiplier, type RelationsByType } from '../../utils/matchups'

export function TypeMatchups({ pokemon }: { pokemon: Pokemon }) {
  const [relations, setRelations] = useState<RelationsByType>({})
  const pokemonTypes = useMemo(() => pokemon.types.map(({ type }) => type.name), [pokemon.types])

  useEffect(() => {
    let active = true
    Promise.all(pokemonTypes.map(async (type) => [type, await getTypeRelations(type)] as const))
      .then((entries) => { if (active) setRelations(Object.fromEntries(entries)) })
    return () => { active = false }
  }, [pokemonTypes])

  if (Object.keys(relations).length !== pokemonTypes.length) return null
  const incoming = allTypes.map((type) => ({ type, multiplier: defensiveMultiplier(type, pokemonTypes, relations) }))
  const weaknesses = incoming.filter(({ multiplier }) => multiplier > 1).sort((a, b) => b.multiplier - a.multiplier)
  const resistances = incoming.filter(({ multiplier }) => multiplier < 1).sort((a, b) => a.multiplier - b.multiplier)
  const strong = allTypes.filter((target) => pokemonTypes.some((type) => offensiveMultiplier(type, target, relations) > 1))

  return <section className="type-matchups">
    <div className="matchup-block danger"><div className="insight-heading"><ShieldAlert /><div><h2>Fraquezas defensivas</h2><p>Tipos que causam dano aumentado.</p></div></div><div className="matchup-chips">{weaknesses.map(({ type, multiplier }) => <span className={multiplier >= 4 ? 'critical' : ''} key={type}>{typePt[type]} <b>{multiplier}×</b>{multiplier >= 4 && <small> alto risco de K.O.</small>}</span>)}</div></div>
    <div className="matchup-block"><div className="insight-heading"><Target /><div><h2>Vantagem ofensiva</h2><p>Tipos contra os quais seus golpes STAB são fortes.</p></div></div><div className="matchup-chips positive">{strong.map((type) => <span key={type}>{typePt[type]}</span>)}</div></div>
    <div className="matchup-block"><h3>Resistências e imunidades</h3><div className="matchup-chips neutral">{resistances.map(({ type, multiplier }) => <span key={type}>{typePt[type]} <b>{multiplier}×</b></span>)}</div></div>
  </section>
}
