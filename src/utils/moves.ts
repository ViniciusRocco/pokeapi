import type { MoveVersionDetail, Pokemon, PokemonMove } from '../types'

export interface LearnedMove {
  name: string
  level: number
  method: string
  versionGroup: string
}

export function latestMoveDetail(move: PokemonMove): MoveVersionDetail | null {
  return move.version_group_details.at(-1) ?? null
}

export function currentLearnset(pokemon: Pokemon): LearnedMove[] {
  return pokemon.moves
    .map((entry) => {
      const detail = latestMoveDetail(entry)
      return detail ? {
        name: entry.move.name,
        level: detail.level_learned_at,
        method: detail.move_learn_method.name,
        versionGroup: detail.version_group.name,
      } : null
    })
    .filter((move): move is LearnedMove => move !== null)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
}

export function levelUpLearnset(pokemon: Pokemon): LearnedMove[] {
  return currentLearnset(pokemon).filter((move) => move.method === 'level-up')
}

export function recommendedEvolutionLevel(current: Pokemon, evolution: Pokemon, minimumLevel: number | null): { level: number | null; reason: string } {
  if (minimumLevel) return { level: minimumLevel, reason: `A evolução é liberada a partir do nível ${minimumLevel}.` }
  const evolvedMoves = new Set(levelUpLearnset(evolution).map((move) => move.name))
  const exclusive = levelUpLearnset(current).filter((move) => move.level > 0 && move.level <= 100 && !evolvedMoves.has(move.name))
  const lastExclusive = exclusive.at(-1)
  if (!lastExclusive) return { level: null, reason: 'Pode evoluir assim que a condição estiver disponível sem perder golpes exclusivos por nível.' }
  return {
    level: lastExclusive.level,
    reason: `Vale considerar evoluir após aprender ${lastExclusive.name.replaceAll('-', ' ')} no nível ${lastExclusive.level}.`,
  }
}

export function translateLearnMethod(method: string, level: number): string {
  if (method === 'level-up') return level > 0 ? `Nível ${level}` : 'Ao evoluir / nível 1'
  if (method === 'machine') return 'MT / máquina'
  if (method === 'egg') return 'Movimento de ovo'
  if (method === 'tutor') return 'Tutor de movimentos'
  return method.replaceAll('-', ' ')
}
