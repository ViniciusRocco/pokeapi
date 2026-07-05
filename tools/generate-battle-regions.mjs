import { writeFile } from 'node:fs/promises'

const sourceBase = 'https://raw.githubusercontent.com/domtronn/nuzlocke.data/main/leagues/'
const configs = [
  { id: 'johto', name: 'Johto', game: 'HeartGold / SoulSilver', file: 'hgss.txt', heading: '# Gym leaders', title: 'Líder de Ginásio', locations: ['Violet', 'Azalea', 'Goldenrod', 'Ecruteak', 'Cianwood', 'Olivine', 'Mahogany', 'Blackthorn'] },
  { id: 'hoenn', name: 'Hoenn', game: 'Emerald', file: 'em.txt', heading: '# Gym leaders', title: 'Líder de Ginásio', locations: ['Rustboro', 'Dewford', 'Mauville', 'Lavaridge', 'Petalburg', 'Fortree', 'Mossdeep', 'Sootopolis'] },
  { id: 'sinnoh', name: 'Sinnoh', game: 'Platinum', file: 'plat.txt', heading: '# Gym leaders', title: 'Líder de Ginásio', locations: ['Oreburgh', 'Eterna', 'Hearthome', 'Veilstone', 'Pastoria', 'Canalave', 'Snowpoint', 'Sunyshore'] },
  { id: 'unova', name: 'Unova', game: 'Black / White', file: 'bw.txt', heading: '# Gym leaders', title: 'Líder de Ginásio', locations: ['Striaton', 'Nacrene', 'Castelia', 'Nimbasa', 'Driftveil', 'Mistralton', 'Icirrus', 'Opelucid'] },
  { id: 'kalos', name: 'Kalos', game: 'X / Y', file: 'xy.txt', heading: '# Gym Leaders', title: 'Líder de Ginásio', locations: ['Santalune', 'Cyllage', 'Shalour', 'Coumarine', 'Lumiose', 'Laverre', 'Anistar', 'Snowbelle'] },
  { id: 'alola', name: 'Alola', game: 'Sun / Moon', file: 'sm.txt', heading: '# "Gym" leaders', title: 'Prova / Kahuna', locations: ['Melemele', 'Akala', 'Akala', 'Ula’ula', 'Ula’ula', 'Poni', 'Monte Lanakila'] },
  { id: 'galar', name: 'Galar', game: 'Sword / Shield', file: 'swsh.txt', heading: '# Gym leaders', title: 'Líder de Ginásio', locations: ['Turffield', 'Hulbury', 'Motostoke', 'Stow-on-Side', 'Ballonlea', 'Circhester', 'Spikemuth', 'Hammerlocke'] },
  { id: 'paldea', name: 'Paldea', game: 'Scarlet / Violet', file: 'sv.txt', heading: '# Gym leaders', title: 'Líder de Ginásio', locations: ['Cortondo', 'Artazon', 'Levincia', 'Cascarrafa', 'Medali', 'Montenevera', 'Alfornada', 'Glaseado'] },
]

const accents = { normal: '#8b9299', fire: '#e05b38', water: '#3b8bd5', electric: '#e7b91e', grass: '#47a95b', ice: '#5bb8c6', fighting: '#c3455c', poison: '#9a4db4', ground: '#a66a43', flying: '#6f91ce', psychic: '#e26786', bug: '#7fa33b', rock: '#9b8258', ghost: '#665a9c', dragon: '#526bc2', dark: '#5c5363', steel: '#658e9c', fairy: '#d77bc1' }
const counters = { normal: [56, 57, 66, 67], fire: [7, 54, 74, 194], water: [25, 43, 69, 315], electric: [27, 50, 74, 328], grass: [4, 16, 41, 58], ice: [58, 66, 74, 81], fighting: [16, 63, 92, 177], poison: [50, 63, 96, 177], ground: [7, 43, 60, 220], flying: [25, 74, 81, 220], psychic: [92, 123, 127, 198], bug: [4, 16, 74, 228], rock: [1, 7, 56, 60], ghost: [19, 92, 198, 215], dragon: [35, 124, 220, 333], dark: [35, 56, 123, 280], steel: [4, 50, 56, 58], fairy: [23, 41, 81, 109] }
const pokemonAliases = { jellicent: 'jellicent-male' }

function parseSection(text, config) {
  const normalized = text.replaceAll('\r', '')
  const start = normalized.toLowerCase().indexOf(config.heading.toLowerCase())
  if (start < 0) throw new Error(`Heading not found: ${config.heading}`)
  const afterHeading = normalized.slice(start + config.heading.length).replace(/^\n+/, '')
  const nextHeading = afterHeading.search(/^#\s*(elite four|evil team|round 2|kanto gym leaders)/im)
  const section = nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading
  const battles = []
  let current
  for (const rawLine of section.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#') || line.startsWith('==')) continue
    if (line.startsWith('--')) {
      const [rawId, trainer, specialty = 'normal'] = line.slice(2).split('|')
      const numericOrder = Number(rawId.match(/\d+/)?.[0] ?? battles.length + 1)
      current = { rawId, order: numericOrder, trainer, specialty: specialty || 'normal', party: [] }
      battles.push(current)
      continue
    }
    if (!current) continue
    const [rawPokemon, level, moves = '', ability = '', heldItem = ''] = line.split('|')
    const parsedPokemon = rawPokemon.includes('>') ? rawPokemon.split('>')[0] : rawPokemon
    const pokemon = pokemonAliases[parsedPokemon] ?? parsedPokemon
    current.party.push({ pokemon, level: Number(level), moves: moves.split(',').filter(Boolean), ability: ability || undefined, heldItem: heldItem || undefined })
  }
  return battles.map((battle, index) => {
    const maxLevel = Math.max(...battle.party.map(({ level }) => level))
    const category = /^(c|ca|ec)/i.test(battle.rawId) ? 'champion' : /^e/i.test(battle.rawId) ? 'elite-four' : config.id === 'alola' ? 'trial' : 'gym'
    const title = category === 'champion' ? 'Campeão / Campeã' : category === 'elite-four' ? 'Elite Four' : config.title
    const location = category === 'gym' || category === 'trial' ? config.locations[Math.min(Math.max(battle.order - 1, 0), config.locations.length - 1)] ?? config.name : 'Liga Pokémon'
    return {
      id: `${config.id}-${battle.rawId}`,
      order: battle.order || index + 1,
      trainer: battle.trainer,
      title,
      category,
      specialty: battle.specialty,
      location,
      badge: config.id === 'alola' ? 'Progresso da Prova' : `Insígnia de ${location}`,
      reward: 'Recompensa da campanha',
      recommendedLevel: [Math.max(5, maxLevel - 2), maxLevel + 1],
      description: battle.specialty ? `${battle.trainer} usa uma estratégia centrada no tipo ${battle.specialty}. Analise também os golpes de cobertura antes da batalha.` : `${battle.trainer} utiliza uma equipe variada que exige boa cobertura de tipos.`,
      accent: accents[battle.specialty] ?? '#244bbb',
      party: battle.party.map(({ ability, heldItem, ...member }) => ({ ...member, ability, heldItem })),
      recommendedPokemonIds: counters[battle.specialty] ?? [25, 130, 143, 65],
      tips: [`Priorize golpes que explorem as fraquezas do tipo ${battle.specialty || 'da equipe adversária'}.`, 'Confira os golpes de cobertura: a especialidade do líder não representa todos os ataques disponíveis.'],
    }
  })
}

const regions = await Promise.all(configs.map(async (config) => {
  const response = await fetch(sourceBase + config.file)
  if (!response.ok) throw new Error(`Could not fetch ${config.file}`)
  const text = await response.text()
  const gymBattles = parseSection(text, config)
  const eliteHeading = text.toLowerCase().includes('# elite four') ? '# Elite four' : null
  const eliteBattles = eliteHeading ? parseSection(text, { ...config, heading: eliteHeading, locations: [] }) : []
  const battles = [...gymBattles, ...eliteBattles.filter((elite) => !gymBattles.some(({ id }) => id === elite.id))]
  return { id: config.id, name: config.name, game: config.game, source: `domtronn/nuzlocke.data: leagues/${config.file}`, battles }
}))

await writeFile(new URL('../src/data/generatedBattleRegions.json', import.meta.url), `${JSON.stringify(regions, null, 2)}\n`)
console.log(`Generated ${regions.length} regions and ${regions.reduce((total, region) => total + region.battles.length, 0)} battles.`)
