import type { Pokemon, TypeDamageRelations } from '../types'

export type RelationsByType = Record<string, TypeDamageRelations>

function includes(resources: { name: string }[], type: string): boolean {
  return resources.some((resource) => resource.name === type)
}

export function defensiveMultiplier(attackType: string, defenderTypes: string[], relations: RelationsByType): number {
  return defenderTypes.reduce((multiplier, defenderType) => {
    const chart = relations[defenderType]
    if (!chart) return multiplier
    if (includes(chart.no_damage_from, attackType)) return 0
    if (includes(chart.double_damage_from, attackType)) return multiplier * 2
    if (includes(chart.half_damage_from, attackType)) return multiplier * 0.5
    return multiplier
  }, 1)
}

export function offensiveMultiplier(attackType: string, defenderType: string, relations: RelationsByType): number {
  const chart = relations[attackType]
  if (!chart) return 1
  if (includes(chart.no_damage_to, defenderType)) return 0
  if (includes(chart.double_damage_to, defenderType)) return 2
  if (includes(chart.half_damage_to, defenderType)) return 0.5
  return 1
}

export interface TeamAnalysis {
  coverage: number
  resistance: number
  vulnerability: number
  diversity: number
  score: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
  strongAgainst: string[]
  weakAgainst: string[]
  weaknessDetails: { type: string; weak: number; resistant: number }[]
}

export function analyzeTeam(team: Pokemon[], allTypes: string[], relations: RelationsByType): TeamAnalysis {
  if (team.length === 0) return { coverage: 0, resistance: 0, vulnerability: 0, diversity: 0, score: 0, grade: 'F', strongAgainst: [], weakAgainst: [], weaknessDetails: [] }

  const teamTypes = [...new Set(team.flatMap((pokemon) => pokemon.types.map(({ type }) => type.name)))]
  const strongAgainst = allTypes.filter((target) => teamTypes.some((type) => offensiveMultiplier(type, target, relations) > 1))
  const defensive = allTypes.map((attackType) => {
    const multipliers = team.map((pokemon) => defensiveMultiplier(attackType, pokemon.types.map(({ type }) => type.name), relations))
    return {
      type: attackType,
      weak: multipliers.filter((value) => value > 1).length,
      resistant: multipliers.filter((value) => value < 1).length,
    }
  })
  const resistantTypes = defensive.filter(({ resistant, weak }) => resistant > weak).map(({ type }) => type)
  const weakAgainst = defensive.filter(({ weak, resistant }) => weak > resistant).map(({ type }) => type)
  const weaknessDetails = defensive.filter(({ weak, resistant }) => weak > resistant)
  const coverage = Math.round((strongAgainst.length / allTypes.length) * 100)
  const resistance = Math.round((resistantTypes.length / allTypes.length) * 100)
  const vulnerability = Math.round((weakAgainst.length / allTypes.length) * 100)
  const diversity = Math.round((teamTypes.length / Math.min(team.length * 2, allTypes.length)) * 100)
  const score = Math.max(0, Math.min(100, Math.round(coverage * 0.45 + resistance * 0.3 + diversity * 0.25 - vulnerability * 0.2)))
  const grade = score >= 85 ? 'S' : score >= 75 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F'
  return { coverage, resistance, vulnerability, diversity, score, grade, strongAgainst, weakAgainst, weaknessDetails }
}
