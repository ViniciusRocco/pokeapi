import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import { PokemonCard } from '../src/components/PokemonCard'
import { FilterSheet } from '../src/features/filters/FilterSheet'
import { WelcomeFlow } from '../src/features/auth/WelcomeFlow'
import { StoreProvider } from '../src/store'
import { defaultFilters } from '../src/utils/pokemon'
import type { Pokemon } from '../src/types'

const bulbasaur: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  types: [{ slot: 1, type: { name: 'grass', url: '' } }],
  stats: [],
  abilities: [],
  moves: [],
  sprites: { front_default: 'bulbasaur.png', other: { 'official-artwork': { front_default: null } } },
}

describe('PokemonCard', () => {
  test('abre os detalhes por teclado', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<StoreProvider><PokemonCard pokemon={bulbasaur} onOpen={onOpen} /></StoreProvider>)

    const card = screen.getByRole('button', { name: /ver detalhes de bulbasaur/i })
    card.focus()
    await user.keyboard('{Enter}')

    expect(onOpen).toHaveBeenCalledOnce()
  })

  test('favorita e persiste o Pokémon', async () => {
    const user = userEvent.setup()
    render(<StoreProvider><PokemonCard pokemon={bulbasaur} onOpen={vi.fn()} /></StoreProvider>)

    const favorite = screen.getByRole('button', { name: /favoritar bulbasaur/i })
    await user.click(favorite)

    expect(screen.getByRole('button', { name: /desfavoritar bulbasaur/i })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('pokedex:favorites') ?? '[]')).toHaveLength(1)
    })
  })
})

test('aplica filtros múltiplos', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<FilterSheet value={defaultFilters} onChange={onChange} onClose={vi.fn()} />)

  await user.click(screen.getByRole('button', { name: 'Fogo' }))
  await user.click(screen.getByRole('button', { name: '1ª' }))
  await user.click(screen.getByRole('button', { name: /aplicar filtros/i }))

  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ types: ['fire'], generation: 1 }))
})

test('conclui o acesso Google em modo demonstrativo', async () => {
  const user = userEvent.setup()
  const onComplete = vi.fn()
  render(<StoreProvider><WelcomeFlow initialStep="login-provider" onComplete={onComplete} /></StoreProvider>)

  await user.click(screen.getByRole('button', { name: /continuar com o google/i }))
  await user.type(screen.getByLabelText('Nome'), 'Ash Ketchum')
  await user.type(screen.getByLabelText('E-mail do Google'), 'ash@gmail.com')
  await user.click(screen.getByRole('button', { name: 'Continuar' }))

  expect(await screen.findByText(/bem-vindo de volta/i, {}, { timeout: 2000 })).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('pokedex:session') ?? '{}')).toMatchObject({ email: 'ash@gmail.com' })
})
