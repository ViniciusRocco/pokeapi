import type { TrainerBattle, TrainerPartyMember } from './battleGuide'

const counters: Record<string, number[]> = {
  bug: [4, 16, 74, 228], grass: [4, 16, 41, 58], electric: [27, 50, 74, 328], water: [25, 43, 69, 315],
  normal: [56, 57, 66, 67], ghost: [19, 92, 198, 215], psychic: [92, 123, 127, 198], ice: [58, 66, 74, 81],
}
const accents: Record<string, string> = { bug: '#7fa33b', grass: '#47a95b', electric: '#e7b91e', water: '#3b8bd5', normal: '#8b9299', ghost: '#665a9c', psychic: '#e26786', ice: '#5bb8c6' }

function battle(order: number, trainer: string, specialty: string, location: string, party: TrainerPartyMember[]): TrainerBattle {
  const highest = Math.max(...party.map(({ level }) => level))
  return {
    id: `paldea-${order}`, order, trainer, specialty, location, party, category: 'gym',
    title: 'Líder de Ginásio', badge: `Insígnia de ${location}`, reward: 'TM e progresso da Liga',
    recommendedLevel: [Math.max(5, highest - 2), highest + 1], accent: accents[specialty],
    description: `${trainer} utiliza Terastalização para reforçar sua estratégia de tipo ${specialty}.`,
    recommendedPokemonIds: counters[specialty],
    tips: [`Prepare cobertura contra o tipo ${specialty}.`, 'Considere o tipo Tera do último Pokémon, além de sua tipagem original.'],
  }
}

function league(order: number, trainer: string, specialty: string, party: TrainerPartyMember[], champion = false): TrainerBattle {
  const highest = Math.max(...party.map(({ level }) => level))
  return {
    id: `paldea-league-${order}`, order, trainer, specialty, party,
    category: champion ? 'champion' : 'elite-four', title: champion ? 'Campeã da Liga' : 'Elite Four', location: 'Liga Pokémon de Paldea',
    badge: champion ? 'Avaliação de Campeão' : 'Desafio da Liga', reward: champion ? 'Classificação de Campeão' : 'Acesso à próxima prova',
    recommendedLevel: [highest - 2, highest + 2], accent: champion ? '#d8a62b' : '#665a9c',
    description: `${trainer} integra a avaliação final da Liga de Paldea.`, recommendedPokemonIds: [130, 149, 448, 700, 823, 937],
    tips: ['Leve uma equipe totalmente evoluída e com cobertura de tipos.', 'Revise os golpes de cobertura antes de definir seu Pokémon inicial.'],
  }
}

export const paldeaBattles: TrainerBattle[] = [
  battle(1, 'Katy', 'bug', 'Cortondo', [
    { pokemon: 'nymble', level: 14, moves: ['struggle-bug', 'double-kick'], ability: 'swarm' },
    { pokemon: 'tarountula', level: 14, moves: ['bug-bite', 'assurance'], ability: 'insomnia' },
    { pokemon: 'teddiursa', level: 15, moves: ['fury-cutter', 'fury-swipes'], ability: 'pickup' },
  ]),
  battle(2, 'Brassius', 'grass', 'Artazon', [
    { pokemon: 'petilil', level: 16, moves: ['sleep-powder', 'mega-drain'], ability: 'own-tempo' },
    { pokemon: 'smoliv', level: 16, moves: ['tackle', 'razor-leaf'], ability: 'early-bird' },
    { pokemon: 'sudowoodo', level: 17, moves: ['trailblaze', 'rock-throw'], ability: 'sturdy' },
  ]),
  battle(3, 'Iono', 'electric', 'Levincia', [
    { pokemon: 'wattrel', level: 23, moves: ['pluck', 'quick-attack', 'spark'], ability: 'wind-power' },
    { pokemon: 'bellibolt', level: 23, moves: ['water-gun', 'spark'], ability: 'electromorphosis' },
    { pokemon: 'luxio', level: 23, moves: ['spark', 'bite'], ability: 'intimidate' },
    { pokemon: 'mismagius', level: 24, moves: ['charge-beam', 'hex', 'confuse-ray'], ability: 'levitate' },
  ]),
  battle(4, 'Kofu', 'water', 'Cascarrafa', [
    { pokemon: 'veluza', level: 29, moves: ['slash', 'pluck', 'aqua-cutter'], ability: 'mold-breaker' },
    { pokemon: 'wugtrio', level: 29, moves: ['mud-slap', 'water-pulse', 'headbutt'], ability: 'gooey' },
    { pokemon: 'crabominable', level: 30, moves: ['crabhammer', 'rock-smash', 'slam'], ability: 'iron-fist' },
  ]),
  battle(5, 'Larry', 'normal', 'Medali', [
    { pokemon: 'komala', level: 35, moves: ['yawn', 'sucker-punch', 'slam'], ability: 'comatose' },
    { pokemon: 'dudunsparce', level: 35, moves: ['hyper-drill', 'drill-run', 'glare'], ability: 'serene-grace' },
    { pokemon: 'staraptor', level: 36, moves: ['facade', 'aerial-ace'], ability: 'intimidate' },
  ]),
  battle(6, 'Ryme', 'ghost', 'Montenevera', [
    { pokemon: 'banette', level: 41, moves: ['icy-wind', 'sucker-punch', 'shadow-sneak'], ability: 'insomnia' },
    { pokemon: 'mimikyu-disguised', level: 41, moves: ['light-screen', 'shadow-sneak', 'slash'], ability: 'disguise' },
    { pokemon: 'houndstone', level: 41, moves: ['play-rough', 'crunch', 'phantom-force'], ability: 'sand-rush' },
    { pokemon: 'toxtricity-low-key', level: 42, moves: ['discharge', 'hex', 'hyper-voice'], ability: 'punk-rock' },
  ]),
  battle(7, 'Tulip', 'psychic', 'Alfornada', [
    { pokemon: 'farigiraf', level: 44, moves: ['crunch', 'zen-headbutt', 'reflect'], ability: 'armor-tail' },
    { pokemon: 'gardevoir', level: 44, moves: ['psychic', 'dazzling-gleam', 'energy-ball'], ability: 'synchronize' },
    { pokemon: 'espathra', level: 44, moves: ['psychic', 'quick-attack', 'shadow-ball'], ability: 'opportunist' },
    { pokemon: 'florges', level: 45, moves: ['psychic', 'moonblast', 'petal-blizzard'], ability: 'flower-veil' },
  ]),
  battle(8, 'Grusha', 'ice', 'Glaseado', [
    { pokemon: 'frosmoth', level: 47, moves: ['blizzard', 'bug-buzz', 'tailwind'], ability: 'shield-dust' },
    { pokemon: 'beartic', level: 47, moves: ['aqua-jet', 'icicle-crash', 'earthquake'], ability: 'snow-cloak' },
    { pokemon: 'cetitan', level: 47, moves: ['ice-spinner', 'liquidation', 'ice-shard'], ability: 'thick-fat' },
    { pokemon: 'altaria', level: 48, moves: ['ice-beam', 'dragon-pulse', 'moonblast', 'hurricane'], ability: 'natural-cure' },
  ]),
  league(9, 'Rika', 'ground', [
    { pokemon: 'whiscash', level: 57, moves: ['muddy-water', 'earth-power', 'blizzard', 'future-sight'] }, { pokemon: 'camerupt', level: 57, moves: ['earth-power', 'fire-blast', 'flash-cannon', 'yawn'] }, { pokemon: 'donphan', level: 57, moves: ['earthquake', 'stone-edge', 'iron-head', 'poison-jab'] }, { pokemon: 'dugtrio', level: 57, moves: ['earthquake', 'rock-slide', 'sucker-punch', 'sandstorm'] }, { pokemon: 'clodsire', level: 58, moves: ['earthquake', 'liquidation', 'toxic', 'protect'] },
  ]),
  league(10, 'Poppy', 'steel', [
    { pokemon: 'copperajah', level: 58, moves: ['high-horsepower', 'play-rough', 'heavy-slam', 'stealth-rock'] }, { pokemon: 'magnezone', level: 58, moves: ['discharge', 'flash-cannon', 'light-screen', 'tri-attack'] }, { pokemon: 'bronzong', level: 58, moves: ['iron-head', 'zen-headbutt', 'rock-blast', 'earthquake'] }, { pokemon: 'corviknight', level: 58, moves: ['brave-bird', 'iron-head', 'body-press', 'iron-defense'] }, { pokemon: 'tinkaton', level: 58, moves: ['play-rough', 'gigaton-hammer', 'brick-break', 'stone-edge'] },
  ]),
  league(11, 'Larry', 'flying', [
    { pokemon: 'tropius', level: 59, moves: ['air-slash', 'solar-beam', 'dragon-pulse', 'sunny-day'] }, { pokemon: 'oricorio-pom-pom', level: 59, moves: ['revelation-dance', 'air-slash', 'teeter-dance', 'icy-wind'] }, { pokemon: 'altaria', level: 59, moves: ['moonblast', 'flamethrower', 'ice-beam', 'dragon-pulse'] }, { pokemon: 'staraptor', level: 59, moves: ['facade', 'brave-bird', 'close-combat', 'thief'] }, { pokemon: 'flamigo', level: 60, moves: ['brave-bird', 'close-combat', 'throat-chop', 'liquidation'] },
  ]),
  league(12, 'Hassel', 'dragon', [
    { pokemon: 'noivern', level: 60, moves: ['air-slash', 'dragon-pulse', 'super-fang', 'hyper-voice'] }, { pokemon: 'haxorus', level: 60, moves: ['dragon-claw', 'crunch', 'iron-head', 'rock-tomb'] }, { pokemon: 'dragalge', level: 60, moves: ['sludge-bomb', 'dragon-pulse', 'hydro-pump', 'thunderbolt'] }, { pokemon: 'flapple', level: 60, moves: ['dragon-rush', 'seed-bomb', 'aerial-ace', 'leech-seed'] }, { pokemon: 'baxcalibur', level: 61, moves: ['icicle-crash', 'brick-break', 'glaive-rush'] },
  ]),
  league(13, 'Geeta', 'mixed', [
    { pokemon: 'espathra', level: 61, moves: ['lumina-crash', 'dazzling-gleam', 'quick-attack', 'reflect'] }, { pokemon: 'gogoat', level: 61, moves: ['horn-leech', 'zen-headbutt', 'play-rough', 'bulk-up'] }, { pokemon: 'veluza', level: 61, moves: ['aqua-jet', 'liquidation', 'psycho-cut', 'ice-fang'] }, { pokemon: 'avalugg', level: 61, moves: ['avalanche', 'crunch', 'earthquake', 'body-press'] }, { pokemon: 'kingambit', level: 61, moves: ['iron-head', 'kowtow-cleave', 'zen-headbutt', 'stone-edge'] }, { pokemon: 'glimmora', level: 62, moves: ['tera-blast', 'sludge-wave', 'earth-power', 'dazzling-gleam'] },
  ], true),
]
