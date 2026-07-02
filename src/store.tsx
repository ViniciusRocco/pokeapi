import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Pokemon } from './types'

interface StoreValue {
  favorites: Pokemon[]
  toggleFavorite: (pokemon: Pokemon) => void
  isFavorite: (id: number) => boolean
  compare: Pokemon[]
  toggleCompare: (pokemon: Pokemon) => void
  clearCompare: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Pokemon[]>(
    () => readStored('pokedex:favorites', []),
  )
  const [compare, setCompare] = useState<Pokemon[]>([])

  useEffect(() => {
    localStorage.setItem('pokedex:favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((pokemon: Pokemon) => {
    setFavorites((current) => current.some((item) => item.id === pokemon.id)
      ? current.filter((item) => item.id !== pokemon.id)
      : [...current, pokemon])
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.some((pokemon) => pokemon.id === id),
    [favorites],
  )

  const toggleCompare = useCallback((pokemon: Pokemon) => {
    setCompare((current) => {
      if (current.some((item) => item.id === pokemon.id)) {
        return current.filter((item) => item.id !== pokemon.id)
      }
      if (current.length < 2) return [...current, pokemon]
      return [current[1], pokemon]
    })
  }, [])

  const clearCompare = useCallback(() => setCompare([]), [])

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, compare, toggleCompare, clearCompare }),
    [favorites, toggleFavorite, isFavorite, compare, toggleCompare, clearCompare],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return store
}
