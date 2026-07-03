import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  LoaderCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { DesktopNavigation, MobileNavigation } from './components/Navigation'
import { PokemonCard } from './components/PokemonCard'
import { CompareView } from './features/compare/CompareView'
import { PokemonDetails } from './features/details/PokemonDetails'
import { FilterSheet } from './features/filters/FilterSheet'
import { WelcomeFlow } from './features/auth/WelcomeFlow'
import { FavoritesView } from './features/favorites/FavoritesView'
import { ProfileView } from './features/profile/ProfileView'
import { TeamBuilder } from './features/team/TeamBuilder'
import { usePokemonCatalog } from './hooks/usePokemonCatalog'
import type { Filters, Pokemon, View } from './types'
import { defaultFilters, readStoredFilters } from './utils/pokemon'

function activeFilterCount(filters: Filters): number {
  return filters.types.length
    + (filters.generation ? 1 : 0)
    + (filters.minHeight !== defaultFilters.minHeight || filters.maxHeight !== defaultFilters.maxHeight ? 1 : 0)
    + (filters.minWeight !== defaultFilters.minWeight || filters.maxWeight !== defaultFilters.maxWeight ? 1 : 0)
}

export default function App() {
  const [view, setView] = useState<View>('pokedex')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Filters>(readStoredFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selected, setSelected] = useState<Pokemon | null>(null)
  const [welcome, setWelcome] = useState<'first' | 'choice' | null>(
    () => localStorage.getItem('pokedex:onboarded') === 'true' ? null : 'first',
  )
  const searchInput = useRef<HTMLInputElement>(null)
  const catalog = usePokemonCatalog(search, filters, sort)

  const displayedPokemon = catalog.pokemon
  const filterCount = activeFilterCount(filters)

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }
    document.addEventListener('keydown', focusSearch)
    return () => document.removeEventListener('keydown', focusSearch)
  }, [])

  function updateFilters(nextFilters: Filters) {
    setFilters(nextFilters)
    localStorage.setItem('pokedex:filters', JSON.stringify(nextFilters))
  }

  function updateSearch(value: string) {
    setSearch(value)
  }

  function closeWelcome() {
    localStorage.setItem('pokedex:onboarded', 'true')
    setWelcome(null)
  }

  if (welcome) {
    return <WelcomeFlow firstRun={welcome === 'first'} onComplete={closeWelcome} />
  }

  return (
    <div className="app-shell">
      <DesktopNavigation view={view} onChange={setView} />

      <div className="main-column">
        {view === 'compare' ? (
          <CompareView onSelect={setSelected} />
        ) : view === 'team' ? (
          <TeamBuilder onOpen={setSelected} />
        ) : view === 'profile' ? (
          <ProfileView onAuthenticate={() => setWelcome('choice')} />
        ) : view === 'favorites' ? (
          <FavoritesView onOpen={setSelected} onAuthenticate={() => setWelcome('choice')} />
        ) : (
          <>
            <header className="topbar">
              <div><h1>Pokédex</h1></div>
            </header>

            <>
                <div className="toolbar">
                  <label className="search">
                    <Search />
                    <input
                      ref={searchInput}
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
                  <p><b>{catalog.resultCount}</b> Pokémons encontrados</p>
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

            <main className="pokemon-grid">
              {displayedPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} onOpen={() => setSelected(pokemon)} />
              ))}
            </main>

            {catalog.loading && (
              <div className="loading" role="status">
                <LoaderCircle className="spin" />
                Carregando Pokémons...
              </div>
            )}

            {catalog.error && (
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

            {!catalog.loading && catalog.hasMore && (
              <button className="load-more" onClick={catalog.loadMore}>
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
