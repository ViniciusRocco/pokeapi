import { useEffect, useMemo, useState } from 'react'
import { LoaderCircle, Swords } from 'lucide-react'
import { getMove } from '../../api'
import type { MoveDetail, Pokemon } from '../../types'
import { capitalize } from '../../utils/pokemon'
import { currentLearnset, levelUpLearnset, translateLearnMethod } from '../../utils/moves'
import { TypeBadge } from '../../components/TypeBadge'

export function MoveInsights({ pokemon }: { pokemon: Pokemon }) {
  const [details, setDetails] = useState<MoveDetail[]>([])
  const [loading, setLoading] = useState(true)
  const learnset = useMemo(() => currentLearnset(pokemon), [pokemon])
  const levelMoves = useMemo(() => levelUpLearnset(pokemon), [pokemon])

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all(levelMoves.map((move) => getMove(move.name)))
      .then((moves) => { if (active) setDetails(moves) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [levelMoves])

  const pokemonTypes = new Set(pokemon.types.map(({ type }) => type.name))
  const highlights = details
    .filter((move) => move.power && move.power > 0)
    .sort((a, b) => ((b.power ?? 0) * (pokemonTypes.has(b.type.name) ? 1.5 : 1)) - ((a.power ?? 0) * (pokemonTypes.has(a.type.name) ? 1.5 : 1)))
    .slice(0, 8)

  return <section className="move-insights">
    <div className="insight-heading"><Swords /><div><h2>Golpes de destaque</h2><p>Priorizados por poder e bônus do mesmo tipo (STAB).</p></div></div>
    {loading && <LoaderCircle className="spin" aria-label="Carregando golpes" />}
    {!loading && <div className="highlight-moves">{highlights.map((move) => {
      const learned = levelMoves.find((item) => item.name === move.name)
      return <article key={move.id}><div><b>{capitalize(move.name.replaceAll('-', ' '))}</b><TypeBadge type={move.type.name} /></div><span>{learned ? translateLearnMethod(learned.method, learned.level) : 'Consulte a versão'}</span><small>Poder {move.power ?? '—'} · Precisão {move.accuracy ?? '—'} · PP {move.pp}</small></article>
    })}</div>}

    <details className="all-moves"><summary>Ver todos os {learnset.length} golpes e métodos</summary><div className="moves-table">
      {learnset.map((move) => <div key={move.name}><b>{capitalize(move.name.replaceAll('-', ' '))}</b><span>{translateLearnMethod(move.method, move.level)}</span></div>)}
    </div><p>Os níveis e métodos exibidos correspondem ao grupo de versões mais recente informado pela PokeAPI.</p></details>
  </section>
}
