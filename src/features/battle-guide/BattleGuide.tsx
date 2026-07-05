import { useEffect, useMemo, useState } from 'react'
import { Award, ChevronRight, Gamepad2, LoaderCircle, MapPin, ShieldAlert, Sparkles, Swords, Target } from 'lucide-react'
import { getMove, getPokemon, getPokemonBatch, getTypeRelations } from '../../api'
import { battleRegions, type TrainerBattle } from '../../data/battleGuide'
import type { MoveDetail, Pokemon } from '../../types'
import { allTypes, statPt, typePt } from '../../constants'
import { defensiveMultiplier, offensiveMultiplier, type RelationsByType } from '../../utils/matchups'
import { capitalize, officialArtwork } from '../../utils/pokemon'
import { TypeBadge } from '../../components/TypeBadge'
import { recommendationsForLevel } from '../../utils/recommendations'

function readTeam(): Pokemon[] {
  try { return JSON.parse(localStorage.getItem('pokedex:team') ?? '[]') as Pokemon[] } catch { return [] }
}

export function BattleGuide({ onOpenPokemon, onOpenTeam }: { onOpenPokemon: (pokemon: Pokemon) => void; onOpenTeam: () => void }) {
  const [region, setRegion] = useState(battleRegions[0])
  const [selected, setSelected] = useState(battleRegions[0].battles[0])
  const [party, setParty] = useState<Pokemon[]>([])
  const [recommended, setRecommended] = useState<Pokemon[]>([])
  const [moves, setMoves] = useState<Record<string, MoveDetail>>({})
  const [relations, setRelations] = useState<RelationsByType>({})
  const [playerLevel, setPlayerLevel] = useState(selected.recommendedLevel[0])
  const [loading, setLoading] = useState(true)
  const [team] = useState(readTeam)

  useEffect(() => {
    Promise.all(allTypes.map(async (type) => [type, await getTypeRelations(type)] as const))
      .then((entries) => setRelations(Object.fromEntries(entries)))
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setPlayerLevel(selected.recommendedLevel[0])
    Promise.all([
      Promise.all(selected.party.map(({ pokemon }) => getPokemon(pokemon))),
      getPokemonBatch(recommendationsForLevel(selected.recommendedPokemonIds, selected.recommendedLevel[1])),
      Promise.all([...new Set(selected.party.flatMap(({ moves: memberMoves }) => memberMoves))].map(getMove)),
    ]).then(([partyPokemon, counters, moveDetails]) => {
      if (!active) return
      setParty(partyPokemon)
      setRecommended(counters)
      setMoves(Object.fromEntries(moveDetails.map((move) => [move.name, move])))
      setLoading(false)
    })
    return () => { active = false }
  }, [selected])

  const analysis = useMemo(() => analyzeBattle(team, party, Object.values(moves), relations, playerLevel, selected), [team, party, moves, relations, playerLevel, selected])
  const selectedIndex = region.battles.findIndex(({ id }) => id === selected.id)

  function changeRegion(regionId: string) {
    const nextRegion = battleRegions.find(({ id }) => id === regionId) ?? battleRegions[0]
    setRegion(nextRegion)
    setSelected(nextRegion.battles[0])
  }

  return <section className="battle-guide">
    <header className="battle-guide-hero">
      <div className="guide-logo"><ShieldAlert /><Swords /></div>
      <div><span>GUIA DE CAMPANHA</span><h1>Guia de Batalhas</h1><p>Prepare seu time para os principais desafios de cada região.</p></div>
      <label><Gamepad2 /><span>Região e jogo</span><select aria-label="Selecionar região e jogo" value={region.id} onChange={(event) => changeRegion(event.target.value)}>{battleRegions.map((item) => <option value={item.id} key={item.id}>{item.name} — {item.game}</option>)}</select></label>
    </header>

    <div className="campaign-summary"><div><b>Região de {region.name}</b><span>{region.battles.length} desafios disponíveis · {region.game}</span></div><div className="campaign-progress"><i><em style={{ width: `${((selectedIndex + 1) / region.battles.length) * 100}%` }} /></i><span>{selectedIndex + 1}/{region.battles.length}</span></div></div>

    <nav className="trainer-timeline" aria-label="Desafios da campanha">
      {region.battles.map((battle, index) => <button style={{ '--trainer-accent': battle.accent } as React.CSSProperties} className={selected.id === battle.id ? 'active' : ''} onClick={() => setSelected(battle)} key={battle.id}><small>{categoryLabel(battle.category, index)}</small><b>{battle.trainer}</b><span>{typePt[battle.specialty] ?? 'Equipe mista'}</span></button>)}
    </nav>

    <article className="trainer-overview" style={{ '--trainer-accent': selected.accent } as React.CSSProperties}>
      <div className="trainer-identity"><div className="trainer-portrait">{selected.trainer.charAt(0)}</div><div><span>{selected.title}</span><h2>{selected.trainer}</h2><div className="trainer-meta"><span><MapPin />{selected.location}</span><span><Award />{selected.badge}</span></div></div></div>
      <div className="battle-level"><span>NÍVEL RECOMENDADO</span><strong>{selected.recommendedLevel[0]}–{selected.recommendedLevel[1]}</strong><small>Nível máximo adversário: {Math.max(...selected.party.map(({ level }) => level))}</small></div>
      <p>{translateStrategyText(selected.description, selected.specialty)}</p>
      <div className="reward"><Award /><span>Recompensa</span><b>{selected.reward}</b></div>
    </article>

    {loading ? <div className="guide-loading"><LoaderCircle className="spin" /> Carregando estratégia...</div> : <>
      <section className="guide-section"><div className="guide-section-title"><div><span>EQUIPE ADVERSÁRIA</span><h2>Pokémon de {selected.trainer}</h2></div><b>{party.length} Pokémon</b></div>
        <div className="trainer-party">{selected.party.map((member, index) => {
          const pokemon = party[index]
          if (!pokemon) return null
          return <article className="trainer-pokemon" key={`${member.pokemon}-${index}`}><button className="trainer-mon-head" onClick={() => onOpenPokemon(pokemon)}><div className="level-badge">Nv. {member.level}</div><img src={officialArtwork(pokemon)} alt={capitalize(pokemon.name)} /><h3>{capitalize(pokemon.name.replaceAll('-', ' '))}</h3><div className="types">{pokemon.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}</div>{(member.ability || member.heldItem) && <div className="trainer-mon-details">{member.ability && <span>Habilidade: {capitalize(member.ability.replaceAll('-', ' '))}</span>}{member.heldItem && <span>Item: {capitalize(member.heldItem.replaceAll('-', ' '))}</span>}</div>}</button><div className="trainer-stats">{pokemon.stats.map(({ stat, base_stat }) => <div key={stat.name}><span>{statPt[stat.name]}</span><i><em style={{ width: `${Math.min(base_stat / 1.6, 100)}%` }} /></i><b>{base_stat}</b></div>)}</div><div className="trainer-moves">{member.moves.map((name) => <div key={name}><TypeBadge type={moves[name]?.type.name ?? 'normal'} /><span>{capitalize(name.replaceAll('-', ' '))}</span><small>{moves[name]?.power ? `Poder ${moves[name].power}` : 'Status'}</small></div>)}</div></article>
        })}</div>
      </section>

      <section className="readiness-panel"><div className="readiness-head"><div><span>SEU TIME CONTRA ESTE LÍDER</span><h2>Análise de prontidão</h2></div><div className={`readiness-grade grade-${analysis.grade}`}><strong>{analysis.grade}</strong><span>{analysis.score}%</span></div></div>
        {team.length === 0 ? <div className="no-saved-team"><Swords /><div><h3>Você ainda não montou um time</h3><p>Monte uma equipe para receber uma análise personalizada contra {selected.trainer}.</p></div><button onClick={onOpenTeam}>Montar meu time</button></div> : <>
          <div className="saved-team-row">{team.map((pokemon) => <button key={pokemon.id} onClick={() => onOpenPokemon(pokemon)}><img src={officialArtwork(pokemon)} alt="" /><span>{capitalize(pokemon.name)}</span></button>)}</div>
          <label className="level-control"><span>Nível médio atual do seu time</span><input type="range" min="5" max="100" value={playerLevel} onChange={(event) => setPlayerLevel(Number(event.target.value))} /><b>{playerLevel}</b></label>
          <div className="readiness-metrics"><Metric label="Cobertura contra a equipe" value={analysis.coverage} /><Metric label="Preparação de nível" value={analysis.levelReadiness} /><Metric label="Time preenchido" value={analysis.completeness} /></div>
          <div className="battle-alerts"><div><Target /><p><b>{analysis.coveredOpponents}/{party.length} adversários cobertos</b><span>Seu time possui ao menos um tipo super efetivo contra eles.</span></p></div><div className="danger"><ShieldAlert /><p><b>{analysis.threats.length ? `Cuidado com ${analysis.threats.map((type) => typePt[type]).join(', ')}` : 'Sem ameaça compartilhada grave'}</b><span>Tipos de golpes que atingem vários membros com vantagem.</span></p></div></div>
        </>}
      </section>

      <section className="guide-section"><div className="guide-section-title"><div><span>RECOMENDAÇÃO POR TIPO E NÍVEL</span><h2>Boas escolhas para esta batalha</h2></div><Sparkles /></div><div className="recommended-counters">{recommended.map((pokemon) => <button key={pokemon.id} onClick={() => onOpenPokemon(pokemon)}><img src={officialArtwork(pokemon)} alt="" /><div><b>{capitalize(pokemon.name.replaceAll('-', ' '))}</b><span>{pokemon.types.map(({ type }) => typePt[type.name]).join(' · ')}</span></div><ChevronRight /></button>)}</div><div className="battle-tips">{selected.tips.map((tip) => <p key={tip}><Sparkles />{translateStrategyText(tip, selected.specialty)}</p>)}</div></section>
    </>}

    <footer className="guide-source">Fonte da equipe: {region.source}. Níveis sugeridos são recomendações estratégicas, não uma garantia de vitória.</footer>
  </section>
}

function categoryLabel(category: TrainerBattle['category'], index: number): string {
  if (category === 'champion') return 'CAMPEÃO'
  if (category === 'elite-four') return 'ELITE FOUR'
  if (category === 'trial') return 'PROVA'
  return `${index + 1}º GINÁSIO`
}

function analyzeBattle(team: Pokemon[], opponents: Pokemon[], moves: MoveDetail[], relations: RelationsByType, playerLevel: number, battle: TrainerBattle) {
  if (team.length === 0 || Object.keys(relations).length < allTypes.length) return { coverage: 0, levelReadiness: 0, completeness: 0, score: 0, grade: 'F', coveredOpponents: 0, threats: [] as string[] }
  const teamTypes = [...new Set(team.flatMap((pokemon) => pokemon.types.map(({ type }) => type.name)))]
  const coveredOpponents = opponents.filter((opponent) => teamTypes.some((attackType) => opponent.types.reduce((value, { type }) => value * offensiveMultiplier(attackType, type.name, relations), 1) > 1)).length
  const coverage = opponents.length ? Math.round((coveredOpponents / opponents.length) * 100) : 0
  const targetLevel = (battle.recommendedLevel[0] + battle.recommendedLevel[1]) / 2
  const levelReadiness = Math.min(100, Math.round((playerLevel / targetLevel) * 100))
  const completeness = Math.min(100, Math.round((team.length / 6) * 100))
  const moveTypes = [...new Set(moves.map(({ type }) => type.name))]
  const threats = moveTypes.filter((attackType) => team.filter((pokemon) => defensiveMultiplier(attackType, pokemon.types.map(({ type }) => type.name), relations) > 1).length >= Math.max(2, Math.ceil(team.length / 2)))
  const score = Math.round(coverage * 0.5 + levelReadiness * 0.3 + completeness * 0.2)
  const grade = score >= 90 ? 'S' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'
  return { coverage, levelReadiness, completeness, score, grade, coveredOpponents, threats }
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div><span>{label}</span><b>{value}%</b><i><em style={{ width: `${value}%` }} /></i></div>
}

function translateStrategyText(text: string, specialty: string): string {
  return text.replace(`tipo ${specialty}`, `tipo ${typePt[specialty] ?? specialty}`)
}
