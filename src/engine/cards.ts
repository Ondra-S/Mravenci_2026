import { CardDefinition, GameState } from './types';
import { MAX_CASTLE, MIN_GENERATOR } from './constants';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function clampPlayer(state: GameState): GameState {
  for (const p of state.players) {
    p.castle = clamp(p.castle, 0, MAX_CASTLE);
    p.wall = Math.max(0, p.wall);
    p.bricks = Math.max(0, p.bricks);
    p.gems = Math.max(0, p.gems);
    p.recruits = Math.max(0, p.recruits);
    p.quarry = Math.max(MIN_GENERATOR, p.quarry);
    p.magic = Math.max(MIN_GENERATOR, p.magic);
    p.dungeon = Math.max(MIN_GENERATOR, p.dungeon);
  }
  return state;
}

function dealDamage(state: GameState, targetIndex: 0 | 1, amount: number): GameState {
  const target = state.players[targetIndex];
  const wallDmg = Math.min(target.wall, amount);
  target.wall -= wallDmg;
  target.castle -= (amount - wallDmg);
  return clampPlayer(state);
}

function opponent(playerIndex: 0 | 1): 0 | 1 {
  return playerIndex === 0 ? 1 : 0;
}

export const CARD_DEFINITIONS: CardDefinition[] = [
  // === BRICK CARDS (cihly) ===
  {
    id: 'wall',
    name: 'Zeď',
    resourceType: 'bricks',
    cost: 1,
    description: '+3 zeď',
    effect: (state, pi) => {
      state.players[pi].wall += 3;
      return clampPlayer(state);
    },
  },
  {
    id: 'base',
    name: 'Základy',
    resourceType: 'bricks',
    cost: 1,
    description: '+2 hrad',
    effect: (state, pi) => {
      state.players[pi].castle += 2;
      return clampPlayer(state);
    },
  },
  {
    id: 'defence',
    name: 'Obrana',
    resourceType: 'bricks',
    cost: 3,
    description: '+6 zeď',
    effect: (state, pi) => {
      state.players[pi].wall += 6;
      return clampPlayer(state);
    },
  },
  {
    id: 'reserve',
    name: 'Rezerva',
    resourceType: 'bricks',
    cost: 3,
    description: '+8 hrad, -4 zeď',
    effect: (state, pi) => {
      state.players[pi].castle += 8;
      state.players[pi].wall -= 4;
      return clampPlayer(state);
    },
  },
  {
    id: 'tower',
    name: 'Věž',
    resourceType: 'bricks',
    cost: 5,
    description: '+5 hrad',
    effect: (state, pi) => {
      state.players[pi].castle += 5;
      return clampPlayer(state);
    },
  },
  {
    id: 'school',
    name: 'Škola',
    resourceType: 'bricks',
    cost: 8,
    description: '+1 lom',
    effect: (state, pi) => {
      state.players[pi].quarry += 1;
      return clampPlayer(state);
    },
  },
  {
    id: 'wain',
    name: 'Povoz',
    resourceType: 'bricks',
    cost: 10,
    description: '+8 hrad, -4 zeď',
    effect: (state, pi) => {
      state.players[pi].castle += 8;
      state.players[pi].wall -= 4;
      return clampPlayer(state);
    },
  },
  {
    id: 'fence',
    name: 'Opevnění',
    resourceType: 'bricks',
    cost: 3,
    description: '+7 zeď',
    effect: (state, pi) => {
      state.players[pi].wall += 7;
      return clampPlayer(state);
    },
  },
  {
    id: 'fort',
    name: 'Pevnost',
    resourceType: 'bricks',
    cost: 18,
    description: '+20 hrad',
    effect: (state, pi) => {
      state.players[pi].castle += 20;
      return clampPlayer(state);
    },
  },
  {
    id: 'babylon',
    name: 'Babylón',
    resourceType: 'bricks',
    cost: 39,
    description: '+32 hrad',
    effect: (state, pi) => {
      state.players[pi].castle += 32;
      return clampPlayer(state);
    },
  },

  // === GEM CARDS (krystaly) ===
  {
    id: 'conjure',
    name: 'Kouzlo',
    resourceType: 'gems',
    cost: 4,
    description: '+8 hrad',
    effect: (state, pi) => {
      state.players[pi].castle += 8;
      return clampPlayer(state);
    },
  },
  {
    id: 'crush',
    name: 'Drcení',
    resourceType: 'gems',
    cost: 2,
    description: '-6 zeď soupeři',
    effect: (state, pi) => {
      state.players[opponent(pi)].wall -= 6;
      return clampPlayer(state);
    },
  },
  {
    id: 'sorcerer',
    name: 'Čaroděj',
    resourceType: 'gems',
    cost: 8,
    description: '+1 magie',
    effect: (state, pi) => {
      state.players[pi].magic += 1;
      return clampPlayer(state);
    },
  },
  {
    id: 'dragon',
    name: 'Drak',
    resourceType: 'gems',
    cost: 21,
    description: '25 poškození soupeři',
    effect: (state, pi) => {
      return dealDamage(state, opponent(pi), 25);
    },
  },
  {
    id: 'pixies',
    name: 'Pixie',
    resourceType: 'gems',
    cost: 1,
    description: '+4 hrad',
    effect: (state, pi) => {
      state.players[pi].castle += 4;
      return clampPlayer(state);
    },
  },
  {
    id: 'curse',
    name: 'Kletba',
    resourceType: 'gems',
    cost: 6,
    description: 'Soupeř: -1 všechny generátory',
    effect: (state, pi) => {
      const opp = state.players[opponent(pi)];
      opp.quarry -= 1;
      opp.magic -= 1;
      opp.dungeon -= 1;
      return clampPlayer(state);
    },
  },
  {
    id: 'innovation',
    name: 'Inovace',
    resourceType: 'gems',
    cost: 2,
    description: '+1 lom, +4 krystaly',
    effect: (state, pi) => {
      state.players[pi].quarry += 1;
      state.players[pi].gems += 4;
      return clampPlayer(state);
    },
  },
  {
    id: 'crystal_shield',
    name: 'Krystalový štít',
    resourceType: 'gems',
    cost: 12,
    description: '+8 zeď, +3 hrad',
    effect: (state, pi) => {
      state.players[pi].wall += 8;
      state.players[pi].castle += 3;
      return clampPlayer(state);
    },
  },
  {
    id: 'eclipse',
    name: 'Zatmění',
    resourceType: 'gems',
    cost: 7,
    description: '5 poškození soupeři, -3 krystaly soupeři',
    effect: (state, pi) => {
      state.players[opponent(pi)].gems -= 3;
      return dealDamage(state, opponent(pi), 5);
    },
  },
  {
    id: 'gem_mine',
    name: 'Důl na krystaly',
    resourceType: 'gems',
    cost: 8,
    description: '+1 magie',
    effect: (state, pi) => {
      state.players[pi].magic += 1;
      return clampPlayer(state);
    },
  },

  // === RECRUIT CARDS (zbraně) ===
  {
    id: 'attack',
    name: 'Útok',
    resourceType: 'recruits',
    cost: 1,
    description: '3 poškození soupeři',
    effect: (state, pi) => {
      return dealDamage(state, opponent(pi), 3);
    },
  },
  {
    id: 'archer',
    name: 'Lučištník',
    resourceType: 'recruits',
    cost: 1,
    description: '2 poškození soupeři',
    playAgain: true,
    effect: (state, pi) => {
      return dealDamage(state, opponent(pi), 2);
    },
  },
  {
    id: 'rider',
    name: 'Jezdec',
    resourceType: 'recruits',
    cost: 2,
    description: '4 poškození soupeři',
    effect: (state, pi) => {
      return dealDamage(state, opponent(pi), 4);
    },
  },
  {
    id: 'platoon',
    name: 'Četa',
    resourceType: 'recruits',
    cost: 4,
    description: '6 poškození soupeři',
    effect: (state, pi) => {
      return dealDamage(state, opponent(pi), 6);
    },
  },
  {
    id: 'recruit',
    name: 'Nábor',
    resourceType: 'recruits',
    cost: 8,
    description: '+1 kasárna',
    effect: (state, pi) => {
      state.players[pi].dungeon += 1;
      return clampPlayer(state);
    },
  },
  {
    id: 'saboteur',
    name: 'Sabotér',
    resourceType: 'recruits',
    cost: 4,
    description: '-4 zdroje soupeři (všechny)',
    effect: (state, pi) => {
      const opp = state.players[opponent(pi)];
      opp.bricks -= 4;
      opp.gems -= 4;
      opp.recruits -= 4;
      return clampPlayer(state);
    },
  },
  {
    id: 'thief',
    name: 'Zloděj',
    resourceType: 'recruits',
    cost: 2,
    description: '-5 krystalů soupeři, +5 krystalů tobě',
    effect: (state, pi) => {
      const stolen = Math.min(state.players[opponent(pi)].gems, 5);
      state.players[opponent(pi)].gems -= stolen;
      state.players[pi].gems += stolen;
      return clampPlayer(state);
    },
  },
  {
    id: 'swat',
    name: 'Přepad',
    resourceType: 'recruits',
    cost: 6,
    description: '6 poškození soupeři, -3 zeď soupeři',
    effect: (state, pi) => {
      state.players[opponent(pi)].wall -= 3;
      return dealDamage(state, opponent(pi), 6);
    },
  },
  {
    id: 'banshee',
    name: 'Banshee',
    resourceType: 'recruits',
    cost: 10,
    description: '8 poškození soupeři, -3 kasárna soupeři',
    effect: (state, pi) => {
      state.players[opponent(pi)].dungeon -= 3;
      return dealDamage(state, opponent(pi), 8);
    },
  },
  {
    id: 'knight',
    name: 'Rytíř',
    resourceType: 'recruits',
    cost: 16,
    description: '12 poškození soupeři',
    effect: (state, pi) => {
      return dealDamage(state, opponent(pi), 12);
    },
  },
];

export const CARD_MAP = new Map<string, CardDefinition>(
  CARD_DEFINITIONS.map(c => [c.id, c])
);

export function getCardDef(id: string): CardDefinition {
  const def = CARD_MAP.get(id);
  if (!def) throw new Error(`Unknown card: ${id}`);
  return def;
}
