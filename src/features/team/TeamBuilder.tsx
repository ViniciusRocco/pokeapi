import { useEffect, useMemo, useState } from 'react'
import { LoaderCircle, Plus, Search, Shield, Swords, Trash2 } from 'lucide-react'
import { getPokemonBatch, getPokemonIndex, getTypeRelations } from '../../api'
import { allTypes, typePt } from '../../constants'
import type { Pokemon } from '../../types'
import { analyzeTeam, type RelationsByType } from '../../utils/matchups'
import { capitalize, officialArtwork } from '../../utils/pokemon'
import { TypeBadge } from '../../components/TypeBadge'

function storedTeam(): Pokemon[] {
  try { return JSON.parse(localStorage.getItem('pokedex:team') ?? '[]') as Pokemon[] } catch { return [] }
}

export function TeamBuilder({ onOpen }: { onOpen: (pokemon: Pokemon) => void }) {
  const [size, setSize] = useState<3 | 6>(6)
  const [team, setTeam] = useState<Pokemon[]>(storedTeam)
  const [search, setSearch] = useState('')
  const [candidates, setCandidates] = useState<Pokemon[]>([])
  const [relations, setRelations] = useState<RelationsByType>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('pokedex:team', JSON.stringify(team))
  }, [team])

  useEffect(() => {
    Promise.all(allTypes.map(async (type) => [type, await getTypeRelations(type)] as const))
      .then((entries) => setRelations(Object.fromEntries(entries)))
  }, [])

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(async () => {
      setLoading(true)
      const term = search.trim().toLowerCase()
      const index = await getPokemonIndex()
      const ids = index
        .filter(({ name, url }) => !term || name.includes(term) || String(Number(url.split('/').filter(Boolean).at(-1))).includes(term))
        .slice(0, 18)
        .map(({ url }) => Number(url.split('/').filter(Boolean).at(-1)))
      const pokemon = await getPokemonBatch(ids)
      if (active) { setCandidates(pokemon); setLoading(false) }
    }, 250)
    return () => { active = false; window.clearTimeout(timer) }
  }, [search])

  const analysis = useMemo(() => analyzeTeam(team, allTypes, relations), [team, relations])

  function changeSize(next: 3 | 6) {
    setSize(next)
    setTeam((current) => current.slice(0, next))
  }

  function togglePokemon(pokemon: Pokemon) {
    setTeam((current) => current.some((item) => item.id === pokemon.id)
      ? current.filter((item) => item.id !== pokemon.id)
      : current.length < size ? [...current, pokemon] : current)
  }

  return <section className="team-builder">
    <header className="team-hero"><div className="battle-logo"><Swords /></div><div><span>ANÁLISE DE BATALHA</span><h1>Monte seu time</h1><p>Escolha seus Pokémon e descubra a cobertura e os riscos da sua equipe.</p></div></header>

    <div className="team-size"><span>Tamanho do time</span><div><button className={size === 3 ? 'active' : ''} onClick={() => changeSize(3)}>3 Pokémon</button><button className={size === 6 ? 'active' : ''} onClick={() => changeSize(6)}>6 Pokémon</button></div></div>

    <div className={`team-slots slots-${size}`}>{Array.from({ length: size }, (_, index) => {
      const pokemon = team[index]
      return pokemon ? <article className="team-member" key={pokemon.id}><button onClick={() => onOpen(pokemon)}><img src={officialArtwork(pokemon)} alt={capitalize(pokemon.name)} /><b>{capitalize(pokemon.name)}</b><div>{pokemon.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}</div></button><button className="remove-member" onClick={() => togglePokemon(pokemon)} aria-label={`Remover ${pokemon.name}`}><Trash2 /></button></article>
        : <div className="empty-slot" key={index}><Plus /><span>Escolher</span></div>
    })}</div>

    <section className="team-analysis"><div className={`grade-card grade-${analysis.grade}`}><span>NOTA DO TIME</span><strong>{analysis.grade}</strong><b>{analysis.score}/100</b><small>{team.length < size ? `Adicione mais ${size - team.length}` : 'Time completo'}</small></div><div className="analysis-metrics">
      <Metric label="Vantagem de tipos" value={analysis.coverage} tone="good" />
      <Metric label="Resistência do time" value={analysis.resistance} tone="good" />
      <Metric label="Tipos em desvantagem" value={analysis.vulnerability} tone="bad" />
      <Metric label="Diversidade de tipos" value={analysis.diversity} tone="neutral" />
    </div></section>

    <div className="team-matchups"><div><h2><Swords /> Forte contra</h2><div>{analysis.strongAgainst.map((type) => <span key={type}>{typePt[type]}</span>)}</div></div><div><h2><Shield /> Vulnerável contra</h2><div className="weak">{analysis.weakAgainst.map((type) => <span key={type}>{typePt[type]}</span>)}</div></div></div>

    <section className="pokemon-picker"><div><h2>Escolha qualquer Pokémon</h2><p>{team.length}/{size} selecionados</p></div><label><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou número..." /></label>
      {loading ? <LoaderCircle className="spin" /> : <div className="candidate-grid">{candidates.map((pokemon) => {
        const selected = team.some((item) => item.id === pokemon.id)
        return <button className={selected ? 'selected' : ''} onClick={() => togglePokemon(pokemon)} disabled={!selected && team.length >= size} key={pokemon.id}><img src={officialArtwork(pokemon)} alt="" /><span>{capitalize(pokemon.name)}</span><small>{pokemon.types.map(({ type }) => typePt[type.name]).join(' · ')}</small>{selected && <b>✓</b>}</button>
      })}</div>}
    </section>

    <p className="analysis-note">A nota considera cobertura ofensiva, resistências, vulnerabilidades e diversidade. Pokémon de dois tipos têm ambos os multiplicadores combinados.</p>
  </section>
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className={`metric ${tone}`}><div><span>{label}</span><b>{value}%</b></div><i><em style={{ width: `${value}%` }} /></i></div>
}
