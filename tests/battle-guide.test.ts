import { describe, expect, test } from 'vitest'
import { battleRegions, fireRedLeafGreenGyms } from '../src/data/battleGuide'
import { recommendationsForLevel } from '../src/utils/recommendations'

describe('guia de batalhas de Kanto', () => {
  test('possui os oito ginásios em ordem e com equipes completas', () => {
    expect(fireRedLeafGreenGyms).toHaveLength(8)
    expect(fireRedLeafGreenGyms.map(({ order }) => order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(fireRedLeafGreenGyms.every(({ party }) => party.length >= 2)).toBe(true)
    expect(fireRedLeafGreenGyms.every(({ party }) => party.every(({ moves }) => moves.length > 0))).toBe(true)
  })

  test('mantém níveis recomendados coerentes com o maior adversário', () => {
    for (const battle of battleRegions.flatMap(({ battles }) => battles)) {
      const highestLevel = Math.max(...battle.party.map(({ level }) => level))
      expect(battle.recommendedLevel[1]).toBeGreaterThanOrEqual(highestLevel)
    }
  })

  test('cobre as nove regiões principais', () => {
    expect(battleRegions.map(({ id }) => id)).toEqual(['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'])
    expect(battleRegions.every(({ battles }) => battles.length > 0)).toBe(true)
  })

  test('usa estágios evoluídos nas recomendações de nível alto', () => {
    expect(recommendationsForLevel([19, 43, 315], 50)).toEqual([20, 45, 407])
    expect(recommendationsForLevel([19, 43, 315], 15)).toEqual([19, 43, 315])
  })

  test('todas as regiões incluem a fase final da Liga', () => {
    for (const region of battleRegions) {
      expect(region.battles.some(({ category }) => category === 'elite-four')).toBe(true)
      expect(region.battles.some(({ category }) => category === 'champion')).toBe(true)
    }
  })
})
