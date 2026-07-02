import { useCallback, useEffect, useRef, useState } from 'react'
import { generationRange, getPokemonBatch, getPokemonIdsByType, getPokemonIndex } from '../api'
import type { Filters, Pokemon } from '../types'
import { matchesFilters, PAGE_SIZE } from '../utils/pokemon'

interface CatalogState {
  pokemon: Pokemon[]
  loading: boolean
  error: string
  reload: () => void
  hasMore: boolean
  loadMore: () => void
  resultCount: number
}

function idFromUrl(url: string): number {
  return Number(url.split('/').filter(Boolean).at(-1))
}

export function usePokemonCatalog(search: string, filters: Filters, sort: 'asc' | 'desc'): CatalogState {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [resultCount, setResultCount] = useState(0)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [revision, setRevision] = useState(0)
  const requestId = useRef(0)

  const reload = useCallback(() => setRevision((value) => value + 1), [])
  const loadMore = useCallback(() => setLimit((value) => value + PAGE_SIZE), [])

  useEffect(() => {
    setLimit(PAGE_SIZE)
    setPokemon([])
  }, [search, filters, sort])

  useEffect(() => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError('')

    async function loadCatalog() {
      const index = await getPokemonIndex()
      const term = search.trim().toLowerCase()
      const numericTerm = term.replace(/[^0-9]/g, '')
      const searchedId = numericTerm ? Number(numericTerm) : null
      const [start, end] = generationRange(filters.generation)
      const typeSets = await Promise.all(filters.types.map(getPokemonIdsByType))
      const ids = index
        .map((resource) => ({ id: idFromUrl(resource.url), name: resource.name }))
        .filter(({ id, name }) => id >= start && id <= end
          && (!term || name.includes(term) || id === searchedId)
          && typeSets.every((set) => set.has(id)))
        .map(({ id }) => id)
        .sort((a, b) => sort === 'asc' ? a - b : b - a)

      setResultCount(ids.length)
      const matches: Pokemon[] = []
      let cursor = 0
      while (cursor < ids.length && matches.length < limit) {
        const batch = await getPokemonBatch(ids.slice(cursor, cursor + PAGE_SIZE))
        cursor += PAGE_SIZE
        matches.push(...batch.filter((item) => matchesFilters(item, filters)))
        if (requestId.current === currentRequest) setPokemon(matches.slice(0, limit))
      }
      if (requestId.current === currentRequest) {
        setHasMore(cursor < ids.length || matches.length > limit)
        if (cursor >= ids.length) setResultCount(matches.length)
      }
    }

    loadCatalog()
      .catch(() => {
        if (requestId.current === currentRequest) {
          setError('A PokeAPI não respondeu. Verifique sua conexão e tente novamente.')
        }
      })
      .finally(() => {
        if (requestId.current === currentRequest) setLoading(false)
      })

    return () => {
      requestId.current += 1
    }
  }, [filters, limit, revision, search, sort])

  return { pokemon, loading, error, reload, hasMore, loadMore, resultCount }
}
