import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Account, Pokemon } from './types'

interface StoreValue {
  favorites: Pokemon[]
  toggleFavorite: (pokemon: Pokemon) => void
  isFavorite: (id: number) => boolean
  compare: Pokemon[]
  toggleCompare: (pokemon: Pokemon) => void
  clearCompare: () => void
  account: Account | null
  register: (name: string, email: string, password: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasAccount: (email: string) => boolean
  continueWithGoogle: (name: string, email: string) => Promise<boolean>
}

interface StoredAccount extends Account { passwordHash: string; provider?: 'email' | 'google' }

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
  const [account, setAccount] = useState<Account | null>(
    () => readStored('pokedex:session', null),
  )

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

  const hashPassword = useCallback(async (password: string) => {
    const data = new TextEncoder().encode(password)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('')
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const credentials: StoredAccount = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      provider: 'email',
    }
    localStorage.setItem('pokedex:account', JSON.stringify(credentials))
    const session = { name: credentials.name, email: credentials.email }
    localStorage.setItem('pokedex:session', JSON.stringify(session))
    setAccount(session)
    return true
  }, [hashPassword])

  const login = useCallback(async (email: string, password: string) => {
    const credentials = readStored<StoredAccount | null>('pokedex:account', null)
    if (!credentials || credentials.email !== email.trim().toLowerCase()) return false
    if (credentials.passwordHash !== await hashPassword(password)) return false
    const session = { name: credentials.name, email: credentials.email }
    localStorage.setItem('pokedex:session', JSON.stringify(session))
    setAccount(session)
    return true
  }, [hashPassword])

  const logout = useCallback(() => {
    localStorage.removeItem('pokedex:session')
    setAccount(null)
  }, [])

  const hasAccount = useCallback((email: string) => {
    const credentials = readStored<StoredAccount | null>('pokedex:account', null)
    return credentials?.email === email.trim().toLowerCase()
  }, [])

  const continueWithGoogle = useCallback(async (name: string, email: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !name.trim()) return false
    const existing = readStored<StoredAccount | null>('pokedex:account', null)
    const credentials: StoredAccount = existing?.email === normalizedEmail
      ? existing
      : { name: name.trim(), email: normalizedEmail, passwordHash: '', provider: 'google' }
    localStorage.setItem('pokedex:account', JSON.stringify(credentials))
    const session = { name: credentials.name, email: credentials.email }
    localStorage.setItem('pokedex:session', JSON.stringify(session))
    setAccount(session)
    return true
  }, [])

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, compare, toggleCompare, clearCompare, account, register, login, logout, hasAccount, continueWithGoogle }),
    [favorites, toggleFavorite, isFavorite, compare, toggleCompare, clearCompare, account, register, login, logout, hasAccount, continueWithGoogle],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return store
}
