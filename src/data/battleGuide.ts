import generatedBattleRegions from './generatedBattleRegions.json'
import { paldeaBattles } from './paldeaBattles'
import { regionalLeagues } from './regionalLeagues'

export interface TrainerPartyMember {
  pokemon: string
  level: number
  moves: string[]
  ability?: string
  heldItem?: string
}

export interface BattleRegion {
  id: string
  name: string
  game: string
  source: string
  battles: TrainerBattle[]
}

export interface TrainerBattle {
  id: string
  order: number
  trainer: string
  category?: 'gym' | 'trial' | 'elite-four' | 'champion'
  title: string
  specialty: string
  location: string
  badge: string
  reward: string
  recommendedLevel: [number, number]
  description: string
  accent: string
  party: TrainerPartyMember[]
  recommendedPokemonIds: number[]
  tips: string[]
}

function kantoLeague(order: number, trainer: string, specialty: string, party: TrainerPartyMember[], champion = false): TrainerBattle {
  const highest = Math.max(...party.map(({ level }) => level))
  return {
    id: `kanto-league-${order}`, order, trainer, specialty, party,
    category: champion ? 'champion' : 'elite-four', title: champion ? 'Campeão da Liga' : 'Elite Four',
    location: 'Planalto Índigo', badge: champion ? 'Título de Campeão' : 'Desafio da Liga', reward: champion ? 'Hall da Fama' : 'Acesso ao próximo membro',
    recommendedLevel: [highest - 3, highest + 2], accent: champion ? '#d8a62b' : '#665a9c',
    description: `${trainer} é um dos desafios finais da Liga Pokémon de Kanto.`,
    recommendedPokemonIds: [130, 143, 65, 131, 149, 94],
    tips: ['Use uma equipe evoluída, com cobertura variada e itens de recuperação.', 'Não dependa de uma única vantagem de tipo: a equipe adversária possui golpes de cobertura.'],
  }
}

export const fireRedLeafGreenGyms: TrainerBattle[] = [
  {
    id: 'brock', order: 1, trainer: 'Brock', title: 'Líder de Ginásio', specialty: 'rock', location: 'Cidade de Pewter', badge: 'Insígnia Rocha', reward: 'TM39 — Rock Tomb', recommendedLevel: [12, 16], accent: '#9b8258',
    description: 'A primeira batalha de ginásio testa sua resposta contra Pokémon resistentes fisicamente.',
    party: [
      { pokemon: 'geodude', level: 12, moves: ['tackle', 'defense-curl'] },
      { pokemon: 'onix', level: 14, moves: ['tackle', 'bind', 'rock-tomb'] },
    ],
    recommendedPokemonIds: [1, 7, 56, 12],
    tips: ['Água e Grama causam dano 4× nos dois adversários.', 'Mankey aprende golpes Lutadores cedo e é uma alternativa para quem escolheu Charmander.'],
  },
  {
    id: 'misty', order: 2, trainer: 'Misty', title: 'Líder de Ginásio', specialty: 'water', location: 'Cidade de Cerulean', badge: 'Insígnia Cascata', reward: 'TM03 — Water Pulse', recommendedLevel: [18, 22], accent: '#3b8bd5',
    description: 'Starmie é rápida, se recupera e pressiona equipes sem resistência a Água.',
    party: [
      { pokemon: 'staryu', level: 18, moves: ['tackle', 'harden', 'recover', 'water-pulse'] },
      { pokemon: 'starmie', level: 21, moves: ['swift', 'recover', 'rapid-spin', 'water-pulse'] },
    ],
    recommendedPokemonIds: [25, 43, 69, 46],
    tips: ['Elétrico e Grama atingem os dois Pokémon com vantagem.', 'Evite depender apenas de Pokémon de Pedra ou Fogo nesta batalha.'],
  },
  {
    id: 'lt-surge', order: 3, trainer: 'Lt. Surge', title: 'Líder de Ginásio', specialty: 'electric', location: 'Cidade de Vermilion', badge: 'Insígnia Trovão', reward: 'TM34 — Shock Wave', recommendedLevel: [21, 25], accent: '#e7b91e',
    description: 'Paralisia, evasão e golpes Elétricos consistentes tornam Raichu a principal ameaça.',
    party: [
      { pokemon: 'voltorb', level: 21, moves: ['sonic-boom', 'tackle', 'screech', 'shock-wave'] },
      { pokemon: 'pikachu', level: 18, moves: ['quick-attack', 'thunder-wave', 'double-team', 'shock-wave'] },
      { pokemon: 'raichu', level: 24, moves: ['quick-attack', 'thunder-wave', 'double-team', 'shock-wave'] },
    ],
    recommendedPokemonIds: [50, 51, 27, 74],
    tips: ['Pokémon Terrestres são imunes a golpes Elétricos.', 'Diglett e Dugtrio podem ser encontrados na Diglett’s Cave antes da luta.'],
  },
  {
    id: 'erika', order: 4, trainer: 'Erika', title: 'Líder de Ginásio', specialty: 'grass', location: 'Cidade de Celadon', badge: 'Insígnia Arco-Íris', reward: 'TM19 — Giga Drain', recommendedLevel: [27, 31], accent: '#47a95b',
    description: 'Erika combina condições de status com recuperação e dano de Grama.',
    party: [
      { pokemon: 'victreebel', level: 29, moves: ['stun-spore', 'acid', 'poison-powder', 'giga-drain'] },
      { pokemon: 'tangela', level: 24, moves: ['poison-powder', 'constrict', 'ingrain', 'giga-drain'] },
      { pokemon: 'vileplume', level: 29, moves: ['sleep-powder', 'acid', 'stun-spore', 'giga-drain'] },
    ],
    recommendedPokemonIds: [58, 37, 22, 64, 12],
    tips: ['Fogo, Voador e Psíquico oferecem ótima cobertura.', 'Leve recursos contra Sono, Veneno e Paralisia.'],
  },
  {
    id: 'koga', order: 5, trainer: 'Koga', title: 'Líder de Ginásio', specialty: 'poison', location: 'Cidade de Fuchsia', badge: 'Insígnia Alma', reward: 'TM06 — Toxic', recommendedLevel: [38, 43], accent: '#9a4db4',
    description: 'Toxic, redução de precisão e Self-Destruct punem batalhas muito longas.',
    party: [
      { pokemon: 'koffing', level: 37, moves: ['self-destruct', 'sludge', 'smokescreen', 'toxic'] },
      { pokemon: 'muk', level: 39, moves: ['minimize', 'sludge', 'acid-armor', 'toxic'] },
      { pokemon: 'koffing', level: 37, moves: ['self-destruct', 'sludge', 'smokescreen', 'toxic'] },
      { pokemon: 'weezing', level: 43, moves: ['tackle', 'sludge', 'smokescreen', 'toxic'] },
    ],
    recommendedPokemonIds: [64, 97, 121, 51, 65],
    tips: ['Psíquico é a resposta mais consistente para toda a equipe.', 'Koffing e Weezing possuem Levitate; golpes Terrestres não são uma solução universal.'],
  },
  {
    id: 'sabrina', order: 6, trainer: 'Sabrina', title: 'Líder de Ginásio', specialty: 'psychic', location: 'Cidade de Saffron', badge: 'Insígnia Pântano', reward: 'TM04 — Calm Mind', recommendedLevel: [40, 44], accent: '#e26786',
    description: 'Uma equipe rápida e ofensiva, com Calm Mind e ferramentas de recuperação.',
    party: [
      { pokemon: 'kadabra', level: 38, moves: ['psybeam', 'reflect', 'future-sight', 'calm-mind'] },
      { pokemon: 'mr-mime', level: 37, moves: ['barrier', 'psybeam', 'baton-pass', 'calm-mind'] },
      { pokemon: 'venomoth', level: 38, moves: ['psybeam', 'gust', 'leech-life', 'supersonic'] },
      { pokemon: 'alakazam', level: 43, moves: ['psychic', 'recover', 'future-sight', 'calm-mind'] },
    ],
    recommendedPokemonIds: [143, 127, 123, 20, 93],
    tips: ['Ataques físicos fortes exploram a Defesa menor de Kadabra e Alakazam.', 'Snorlax suporta bem golpes especiais e pode usar Shadow Ball.'],
  },
  {
    id: 'blaine', order: 7, trainer: 'Blaine', title: 'Líder de Ginásio', specialty: 'fire', location: 'Ilha Cinnabar', badge: 'Insígnia Vulcão', reward: 'TM38 — Fire Blast', recommendedLevel: [43, 48], accent: '#e05b38',
    description: 'Fire Blast causa dano alto; Arcanine é o adversário mais resistente da equipe.',
    party: [
      { pokemon: 'growlithe', level: 42, moves: ['bite', 'roar', 'take-down', 'fire-blast'] },
      { pokemon: 'ponyta', level: 40, moves: ['stomp', 'bounce', 'fire-spin', 'fire-blast'] },
      { pokemon: 'rapidash', level: 42, moves: ['stomp', 'bounce', 'fire-spin', 'fire-blast'] },
      { pokemon: 'arcanine', level: 47, moves: ['bite', 'roar', 'take-down', 'fire-blast'] },
    ],
    recommendedPokemonIds: [9, 130, 121, 51, 134],
    tips: ['Água, Pedra e Terrestre são as melhores coberturas.', 'Evite Pokémon de Grama, Gelo, Inseto e Metal sem uma estratégia defensiva.'],
  },
  {
    id: 'giovanni', order: 8, trainer: 'Giovanni', title: 'Líder de Ginásio', specialty: 'ground', location: 'Cidade de Viridian', badge: 'Insígnia Terra', reward: 'TM26 — Earthquake', recommendedLevel: [46, 51], accent: '#a66a43',
    description: 'A equipe final de Giovanni utiliza Earthquake em todos os seus principais atacantes.',
    party: [
      { pokemon: 'rhyhorn', level: 45, moves: ['take-down', 'rock-blast', 'scary-face', 'earthquake'] },
      { pokemon: 'dugtrio', level: 42, moves: ['slash', 'sand-tomb', 'mud-slap', 'earthquake'] },
      { pokemon: 'nidoqueen', level: 44, moves: ['body-slam', 'double-kick', 'poison-sting', 'earthquake'] },
      { pokemon: 'nidoking', level: 45, moves: ['thrash', 'double-kick', 'poison-sting', 'earthquake'] },
      { pokemon: 'rhyhorn', level: 50, moves: ['take-down', 'rock-blast', 'scary-face', 'earthquake'] },
    ],
    recommendedPokemonIds: [9, 131, 103, 121, 134, 65],
    tips: ['Água e Grama destroem Rhyhorn, mas exigem cuidado contra cobertura adversária.', 'Gelo e Psíquico ajudam contra Nidoqueen e Nidoking.'],
  },
]

export const fireRedLeafGreenLeague: TrainerBattle[] = [
  kantoLeague(9, 'Lorelei', 'ice', [
    { pokemon: 'dewgong', level: 52, moves: ['surf', 'ice-beam', 'hail', 'safeguard'] }, { pokemon: 'cloyster', level: 51, moves: ['spikes', 'dive', 'hail', 'protect'] },
    { pokemon: 'slowbro', level: 52, moves: ['surf', 'ice-beam', 'yawn', 'amnesia'] }, { pokemon: 'jynx', level: 54, moves: ['double-slap', 'ice-punch', 'attract', 'lovely-kiss'] }, { pokemon: 'lapras', level: 54, moves: ['body-slam', 'confuse-ray', 'ice-beam', 'surf'] },
  ]),
  kantoLeague(10, 'Bruno', 'fighting', [
    { pokemon: 'onix', level: 51, moves: ['rock-tomb', 'roar', 'iron-tail', 'earthquake'] }, { pokemon: 'hitmonchan', level: 53, moves: ['sky-uppercut', 'mach-punch', 'rock-tomb', 'counter'] },
    { pokemon: 'hitmonlee', level: 53, moves: ['brick-break', 'focus-energy', 'facade', 'foresight'] }, { pokemon: 'onix', level: 54, moves: ['iron-tail', 'sand-tomb', 'rock-tomb', 'double-edge'] }, { pokemon: 'machamp', level: 56, moves: ['bulk-up', 'cross-chop', 'scary-face', 'rock-tomb'] },
  ]),
  kantoLeague(11, 'Agatha', 'ghost', [
    { pokemon: 'gengar', level: 54, moves: ['shadow-punch', 'confuse-ray', 'toxic', 'double-team'] }, { pokemon: 'golbat', level: 54, moves: ['confuse-ray', 'air-cutter', 'bite', 'poison-fang'] },
    { pokemon: 'haunter', level: 53, moves: ['hypnosis', 'dream-eater', 'curse', 'mean-look'] }, { pokemon: 'arbok', level: 56, moves: ['bite', 'sludge-bomb', 'screech', 'iron-tail'] }, { pokemon: 'gengar', level: 58, moves: ['shadow-ball', 'sludge-bomb', 'hypnosis', 'nightmare'] },
  ]),
  kantoLeague(12, 'Lance', 'dragon', [
    { pokemon: 'gyarados', level: 56, moves: ['bite', 'dragon-rage', 'twister', 'hyper-beam'] }, { pokemon: 'dragonair', level: 54, moves: ['safeguard', 'outrage', 'hyper-beam', 'dragon-rage'] },
    { pokemon: 'dragonair', level: 54, moves: ['safeguard', 'outrage', 'hyper-beam', 'dragon-rage'] }, { pokemon: 'aerodactyl', level: 58, moves: ['wing-attack', 'ancient-power', 'scary-face', 'hyper-beam'] }, { pokemon: 'dragonite', level: 60, moves: ['outrage', 'safeguard', 'wing-attack', 'hyper-beam'] },
  ]),
  kantoLeague(13, 'Blue', 'mixed', [
    { pokemon: 'pidgeot', level: 59, moves: ['aerial-ace', 'sand-attack', 'whirlwind', 'feather-dance'] }, { pokemon: 'alakazam', level: 57, moves: ['psychic', 'reflect', 'future-sight', 'recover'] },
    { pokemon: 'rhydon', level: 59, moves: ['take-down', 'earthquake', 'rock-tomb', 'scary-face'] }, { pokemon: 'exeggutor', level: 59, moves: ['giga-drain', 'egg-bomb', 'sleep-powder', 'light-screen'] },
    { pokemon: 'gyarados', level: 61, moves: ['hydro-pump', 'bite', 'thrash', 'dragon-rage'] }, { pokemon: 'charizard', level: 63, moves: ['fire-blast', 'aerial-ace', 'slash', 'fire-spin'] },
  ], true),
]

export const battleRegions: BattleRegion[] = [
  {
    id: 'kanto',
    name: 'Kanto',
    game: 'FireRed / LeafGreen',
    source: 'pret/pokefirered',
    battles: [...fireRedLeafGreenGyms.map((battle) => ({ ...battle, category: 'gym' as const })), ...fireRedLeafGreenLeague],
  },
  ...(generatedBattleRegions as unknown as BattleRegion[]).map((region) => region.id === 'paldea' ? { ...region, battles: paldeaBattles } : { ...region, battles: [...region.battles.map((battle) => ({ ...battle, category: battle.category ?? (region.id === 'alola' ? 'trial' as const : 'gym' as const) })), ...(regionalLeagues[region.id] ?? [])] }),
]
