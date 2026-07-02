import { useMemo, useState } from 'react'
import {
  ChevronDown,
  LoaderCircle,
  Menu,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { DesktopNavigation, MobileNavigation } from './components/Navigation'
import { PokemonCard } from './components/PokemonCard'
import { CompareView } from './features/compare/CompareView'
import { PokemonDetails } from './features/details/PokemonDetails'
import { FilterSheet } from './features/filters/FilterSheet'
import { usePokemonCatalog } from './hooks/usePokemonCatalog'
import { useStore } from './store'
import type { Filters, Pokemon, View } from './types'
import {
  filterPokemon,
  PAGE_SIZE,
  readStoredFilters,
  TOTAL_POKEMON,
} from './utils/pokemon'

function activeFilterCount(filters: Filters): number {
  return filters.types.length + (filters.generation ? 1 : 0)
}

export default function App() {
  const [view, setView] = useState<View>('pokedex')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Filters>(readStoredFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selected, setSelected] = useState<Pokemon | null>(null)
  const { favorites } = useStore()
  const catalog = usePokemonCatalog(filters.generation)

  const filteredPokemon = useMemo(
    () => filterPokemon(catalog.pokemon, search, filters, sort),
    [catalog.pokemon, search, filters, sort],
  )

  const displayedPokemon = view === 'favorites'
    ? favorites
    : filteredPokemon.slice(0, visibleCount)

  const title = view === 'favorites' ? 'Meus favoritos' : 'Pokédex'
  const filterCount = activeFilterCount(filters)
  const expectedTotal = filters.generation === null ? TOTAL_POKEMON : filteredPokemon.length
  const resultCount = catalog.loading && !search && filters.types.length === 0
    ? expectedTotal
    : filteredPokemon.length

  function updateFilters(nextFilters: Filters) {
    setFilters(nextFilters)
    setVisibleCount(PAGE_SIZE)
    localStorage.setItem('pokedex:filters', JSON.stringify(nextFilters))
  }

  function updateSearch(value: string) {
    setSearch(value)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="app-shell">
      <DesktopNavigation view={view} onChange={setView} />

      <div className="main-column">
        {view === 'compare' ? (
          <CompareView onSelect={setSelected} />
        ) : (
          <>
            <header className="topbar">
              <button className="mobile-menu" aria-label="Menu"><Menu /></button>
              <div><h1>{title}</h1></div>
              <div className="pokeball" aria-hidden="true">◓</div>
            </header>

            {view === 'pokedex' && (
              <>
                <div className="toolbar">
                  <label className="search">
                    <Search />
                    <input
                      value={search}
                      onChange={(event) => updateSearch(event.target.value)}
                      placeholder="Procurar Pokémon..."
                      aria-label="Procurar Pokémon"
                    />
                    <kbd>⌘ K</kbd>
                  </label>
                  <button className="filter-button desktop-filter" onClick={() => setFiltersOpen(true)}>
                    <SlidersHorizontal />Filtros
                    {filterCount > 0 && <b>{filterCount}</b>}
                  </button>
                </div>

                <div className="list-controls">
                  <p><b>{resultCount}</b> Pokémons encontrados</p>
                  <div className="mobile-list-actions">
                    <button className="mobile-filter" onClick={() => setFiltersOpen(true)}>
                      <SlidersHorizontal /> Filtros
                      {filterCount > 0 && <b>{filterCount}</b>}
                    </button>
                    <button onClick={() => setSort((current) => current === 'asc' ? 'desc' : 'asc')}>
                      {sort === 'asc' ? 'Menor número' : 'Maior número'} <ChevronDown />
                    </button>
                  </div>
                </div>
              </>
            )}

            <main className="pokemon-grid">
              {displayedPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} onOpen={() => setSelected(pokemon)} />
              ))}
            </main>

            {catalog.loading && view === 'pokedex' && (
              <div className="loading" role="status">
                <LoaderCircle className="spin" />
                Carregando Pokémons... ({catalog.pokemon.length}/{expectedTotal})
              </div>
            )}

            {catalog.error && view === 'pokedex' && (
              <div className="error" role="alert">
                <p>{catalog.error}</p>
                <button onClick={catalog.reload}><RefreshCw /> Tentar novamente</button>
              </div>
            )}

            {!catalog.loading && displayedPokemon.length === 0 && (
              <div className="empty-state">
                <Search /><h2>Nenhum Pokémon encontrado</h2>
                <p>Ajuste sua busca ou os filtros.</p>
              </div>
            )}

            {view === 'pokedex' && visibleCount < filteredPokemon.length && (
              <button className="load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                Carregar mais
              </button>
            )}
          </>
        )}
      </div>

      <MobileNavigation view={view} onChange={setView} />

      {filtersOpen && (
        <FilterSheet value={filters} onChange={updateFilters} onClose={() => setFiltersOpen(false)} />
      )}
      {selected && (
        <PokemonDetails pokemon={selected} onClose={() => setSelected(null)} onOpen={setSelected} />
      )}
    </div>
  )
}
