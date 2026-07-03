import { describe, expect, test } from 'vitest'
import { analyzeTeam, defensiveMultiplier, type RelationsByType } from '../src/utils/matchups'
import type { Pokemon, TypeDamageRelations } from '../src/types'

const resource = (name: string) => ({ name, url: '' })
const neutral = (): TypeDamageRelations => ({ double_damage_from: [], double_damage_to: [], half_damage_from: [], half_damage_to: [], no_damage_from: [], no_damage_to: [] })

describe('análise de tipos', () => {
  test('combina duas fraquezas defensivas como dano 4x', () => {
    const relations: RelationsByType = {
      fire: { ...neutral(), double_damage_from: [resource('rock')] },
      flying: { ...neutral(), double_damage_from: [resource('rock')] },
    }
    expect(defensiveMultiplier('rock', ['fire', 'flying'], relations)).toBe(4)
  })

  test('mantém a nota do time entre F e S e percentuais válidos', () => {
    const pokemon = {
      id: 6, name: 'charizard', height: 17, weight: 905,
      types: [{ slot: 1, type: resource('fire') }, { slot: 2, type: resource('flying') }],
      stats: [], abilities: [], moves: [],
      sprites: { front_default: null, other: { 'official-artwork': { front_default: null } } },
    } satisfies Pokemon
    const relations = { fire: neutral(), flying: neutral() }
    const analysis = analyzeTeam([pokemon], ['fire', 'water', 'grass'], relations)
    expect(analysis.score).toBeGreaterThanOrEqual(0)
    expect(analysis.score).toBeLessThanOrEqual(100)
    expect(['S', 'A', 'B', 'C', 'D', 'F']).toContain(analysis.grade)
  })
})
