const evolutionProgression: Record<number, { id: number; minLevel: number }[]> = {
  4: [{ id: 5, minLevel: 20 }, { id: 6, minLevel: 36 }], 7: [{ id: 8, minLevel: 20 }, { id: 9, minLevel: 36 }],
  16: [{ id: 17, minLevel: 20 }, { id: 18, minLevel: 36 }], 19: [{ id: 20, minLevel: 20 }], 23: [{ id: 24, minLevel: 22 }],
  25: [{ id: 26, minLevel: 30 }], 27: [{ id: 28, minLevel: 22 }], 35: [{ id: 36, minLevel: 30 }],
  41: [{ id: 42, minLevel: 22 }, { id: 169, minLevel: 40 }], 43: [{ id: 44, minLevel: 21 }, { id: 45, minLevel: 35 }],
  50: [{ id: 51, minLevel: 26 }], 54: [{ id: 55, minLevel: 33 }], 56: [{ id: 57, minLevel: 28 }], 58: [{ id: 59, minLevel: 30 }],
  60: [{ id: 61, minLevel: 25 }, { id: 62, minLevel: 40 }], 63: [{ id: 64, minLevel: 20 }, { id: 65, minLevel: 40 }],
  66: [{ id: 67, minLevel: 28 }, { id: 68, minLevel: 40 }], 69: [{ id: 70, minLevel: 21 }, { id: 71, minLevel: 35 }],
  74: [{ id: 75, minLevel: 25 }, { id: 76, minLevel: 40 }], 81: [{ id: 82, minLevel: 30 }, { id: 462, minLevel: 45 }],
  92: [{ id: 93, minLevel: 25 }, { id: 94, minLevel: 40 }], 96: [{ id: 97, minLevel: 26 }], 109: [{ id: 110, minLevel: 35 }],
  123: [{ id: 212, minLevel: 35 }], 177: [{ id: 178, minLevel: 25 }], 194: [{ id: 195, minLevel: 25 }],
  198: [{ id: 430, minLevel: 35 }], 215: [{ id: 461, minLevel: 35 }], 220: [{ id: 221, minLevel: 33 }, { id: 473, minLevel: 45 }],
  228: [{ id: 229, minLevel: 25 }], 280: [{ id: 281, minLevel: 20 }, { id: 282, minLevel: 30 }],
  315: [{ id: 407, minLevel: 35 }], 328: [{ id: 329, minLevel: 35 }, { id: 330, minLevel: 45 }],
  333: [{ id: 334, minLevel: 35 }],
}

export function recommendationsForLevel(ids: number[], level: number): number[] {
  return ids.map((id) => evolutionProgression[id]
    ?.filter(({ minLevel }) => level >= minLevel)
    .at(-1)?.id ?? id)
}
