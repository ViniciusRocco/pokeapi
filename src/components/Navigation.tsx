import { BarChart3, BookOpen, Heart, Menu, Swords, UserRound } from 'lucide-react'
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
      <div className="brand"><img src={`${import.meta.env.BASE_URL}assets/iconoir_pokeball.png`} alt="" /> Pokédex</div>
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
        <button className={view === 'team' ? 'active' : ''} onClick={() => onChange('team')}>
          <Swords />Meu time
        </button>
        <button className={view === 'guide' ? 'active' : ''} onClick={() => onChange('guide')}>
          <BookOpen />Guia de batalhas
        </button>
        <button className={view === 'profile' ? 'active' : ''} onClick={() => onChange('profile')}>
          <UserRound />Perfil
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
        <img src={`${import.meta.env.BASE_URL}assets/iconoir_pokeball.png`} alt="" />Pokédex
      </button>
      <button className={view === 'compare' ? 'active' : ''} onClick={() => onChange('compare')}>
        <BarChart3 />Comparar
      </button>
      <button className={view === 'team' ? 'active' : ''} onClick={() => onChange('team')}>
        <Swords />Time
      </button>
      <button className={view === 'guide' ? 'active' : ''} onClick={() => onChange('guide')}>
        <BookOpen />Guia
      </button>
      <button className={view === 'favorites' ? 'active' : ''} onClick={() => onChange('favorites')}>
        <Heart />Favoritos
      </button>
      <button className={view === 'profile' ? 'active' : ''} onClick={() => onChange('profile')}><UserRound />Perfil</button>
    </nav>
  )
}
