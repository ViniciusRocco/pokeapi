import { useCallback, useEffect, useRef, useState } from 'react'
import { generationRange, getPokemonRange } from '../api'
import type { Pokemon } from '../types'

interface CatalogState {
  pokemon: Pokemon[]
  loading: boolean
  error: string
  reload: () => void
}

export function usePokemonCatalog(generation: number | null): CatalogState {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const requestId = useRef(0)

  const reload = useCallback(() => setRevision((value) => value + 1), [])

  useEffect(() => {
    const currentRequest = ++requestId.current
    const [start, end] = generationRange(generation)
    setPokemon([])
    setLoading(true)
    setError('')

    getPokemonRange(start, end, (partial) => {
      if (requestId.current === currentRequest) setPokemon(partial)
    })
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
  }, [generation, revision])

  return { pokemon, loading, error, reload }
}
