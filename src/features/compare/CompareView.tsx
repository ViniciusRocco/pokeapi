import { BarChart3 } from 'lucide-react'
import { PokemonCard } from '../../components/PokemonCard'
import { statPt } from '../../constants'
import { useStore } from '../../store'
import type { Pokemon } from '../../types'

export function CompareView({ onSelect }: { onSelect: (pokemon: Pokemon) => void }) {
  const { compare, clearCompare } = useStore()

  return (
    <section className="view-section">
      <div className="section-heading">
        <div><span>Análise</span><h1>Comparar Pokémons</h1></div>
        {compare.length > 0 && <button onClick={clearCompare}>Limpar</button>}
      </div>

      {compare.length < 2 ? (
        <div className="empty-state">
          <BarChart3 />
          <h2>Escolha dois Pokémons</h2>
          <p>
            Use o ícone de gráfico nos cards para adicionar{' '}
            {compare.length === 1 ? 'mais um Pokémon' : 'dois Pokémons'} à comparação.
          </p>
          {compare[0] && <PokemonCard pokemon={compare[0]} onOpen={() => onSelect(compare[0])} />}
        </div>
      ) : (
        <div className="comparison-table">
          <div className="compare-head">
            <PokemonCard pokemon={compare[0]} onOpen={() => onSelect(compare[0])} />
            <span>VS</span>
            <PokemonCard pokemon={compare[1]} onOpen={() => onSelect(compare[1])} />
          </div>
          {compare[0].stats.map((stat, index) => {
            const rival = compare[1].stats[index].base_stat
            return (
              <div className="compare-stat" key={stat.stat.name}>
                <b className={stat.base_stat > rival ? 'winner' : ''}>{stat.base_stat}</b>
                <span>{statPt[stat.stat.name]}</span>
                <b className={rival > stat.base_stat ? 'winner' : ''}>{rival}</b>
              </div>
            )
          })}
          <div className="compare-stat total">
            <b>{compare[0].stats.reduce((total, stat) => total + stat.base_stat, 0)}</b>
            <span>Total</span>
            <b>{compare[1].stats.reduce((total, stat) => total + stat.base_stat, 0)}</b>
          </div>
        </div>
      )}
    </section>
  )
}
