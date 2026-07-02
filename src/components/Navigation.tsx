import { BarChart3, Heart, Menu, UserRound } from 'lucide-react'
import { useStore } from '../store'
import type { View } from '../types'

interface NavigationProps {
  view: View
  onChange: (view: View) => void
}

export function DesktopNavigation({ view, onChange }: NavigationProps) {
  const { favorites, compare } = useStore()
  return (
    <aside className="desktop-sidebar">
      <div className="brand"><span>◓</span> Pokédex</div>
      <nav aria-label="Navegação principal">
        <button className={view === 'pokedex' ? 'active' : ''} onClick={() => onChange('pokedex')}>
          <Menu />Pokédex
        </button>
        <button className={view === 'favorites' ? 'active' : ''} onClick={() => onChange('favorites')}>
          <Heart />Favoritos <small>{favorites.length}</small>
        </button>
        <button className={view === 'compare' ? 'active' : ''} onClick={() => onChange('compare')}>
          <BarChart3 />Comparar <small>{compare.length}/2</small>
        </button>
      </nav>
      <p>Dados fornecidos pela PokeAPI</p>
    </aside>
  )
}

export function MobileNavigation({ view, onChange }: NavigationProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegação mobile">
      <button className={view === 'pokedex' ? 'active' : ''} onClick={() => onChange('pokedex')}>
        <span>◓</span>Pokédex
      </button>
      <button className={view === 'compare' ? 'active' : ''} onClick={() => onChange('compare')}>
        <BarChart3 />Comparar
      </button>
      <button className={view === 'favorites' ? 'active' : ''} onClick={() => onChange('favorites')}>
        <Heart />Favoritos
      </button>
      <button aria-label="Perfil indisponível"><UserRound />Perfil</button>
    </nav>
  )
}
