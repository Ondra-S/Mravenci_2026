import { GameState, PlayerState, CardInstance, GameMode } from './types';
import { getCardDef } from './cards';
import { createDeck, drawCards, drawOne, resetUid } from './deck';
import {
  STARTING_CASTLE, STARTING_WALL, STARTING_RESOURCES,
  STARTING_GENERATORS, HAND_SIZE, WIN_CASTLE, WIN_RESOURCES,
} from './constants';

function createPlayer(hand: CardInstance[]): PlayerState {
  return {
    castle: STARTING_CASTLE,
    wall: STARTING_WALL,
    bricks: STARTING_RESOURCES,
    gems: STARTING_RESOURCES,
    recruits: STARTING_RESOURCES,
    quarry: STARTING_GENERATORS,
    magic: STARTING_GENERATORS,
    dungeon: STARTING_GENERATORS,
    hand,
  };
}

export function initGame(mode: GameMode): GameState {
  resetUid();
  let deck = createDeck();

  const { drawn: hand1, remaining: deck1 } = drawCards(deck, HAND_SIZE);
  deck = deck1;
  const { drawn: hand2, remaining: deck2 } = drawCards(deck, HAND_SIZE);
  deck = deck2;

  return {
    players: [createPlayer(hand1), createPlayer(hand2)],
    currentPlayer: 0,
    deck,
    phase: 'playing',
    winner: null,
    gameMode: mode,
    lastPlayedCard: null,
    turnNumber: 0,
    nextUid: 0,
  };
}

export function generateResources(state: GameState): GameState {
  const p = state.players[state.currentPlayer];
  p.bricks += p.quarry;
  p.gems += p.magic;
  p.recruits += p.dungeon;
  return state;
}

function getResourceForType(player: PlayerState, type: string): number {
  switch (type) {
    case 'bricks': return player.bricks;
    case 'gems': return player.gems;
    case 'recruits': return player.recruits;
    default: return 0;
  }
}

function payResource(player: PlayerState, type: string, cost: number): void {
  switch (type) {
    case 'bricks': player.bricks -= cost; break;
    case 'gems': player.gems -= cost; break;
    case 'recruits': player.recruits -= cost; break;
  }
}

export function canPlayCard(state: GameState, cardUid: number): boolean {
  const player = state.players[state.currentPlayer];
  const cardInst = player.hand.find(c => c.uid === cardUid);
  if (!cardInst) return false;
  const def = getCardDef(cardInst.definitionId);
  return getResourceForType(player, def.resourceType) >= def.cost;
}

export function playCard(state: GameState, cardUid: number): GameState {
  const pi = state.currentPlayer;
  const player = state.players[pi];
  const cardIdx = player.hand.findIndex(c => c.uid === cardUid);
  if (cardIdx === -1) return state;

  const cardInst = player.hand[cardIdx];
  const def = getCardDef(cardInst.definitionId);

  if (getResourceForType(player, def.resourceType) < def.cost) {
    return state;
  }

  // Pay cost
  payResource(player, def.resourceType, def.cost);

  // Remove from hand
  player.hand.splice(cardIdx, 1);

  // Apply effect (deep clone to avoid mutation issues)
  state = def.effect(state, pi);

  // Record last played
  state.lastPlayedCard = { card: cardInst, playerIndex: pi };
  state.turnNumber++;

  // Draw replacement
  const { card, remaining } = drawOne(state.deck);
  state.deck = remaining;
  player.hand.push(card);

  // Check win conditions
  state = checkWinConditions(state);

  // Switch turn (unless playAgain)
  if (state.phase === 'playing' && !def.playAgain) {
    state.currentPlayer = pi === 0 ? 1 : 0;
  }

  return state;
}

export function discardCard(state: GameState, cardUid: number): GameState {
  const pi = state.currentPlayer;
  const player = state.players[pi];
  const cardIdx = player.hand.findIndex(c => c.uid === cardUid);
  if (cardIdx === -1) return state;

  const cardInst = player.hand[cardIdx];

  // Remove from hand
  player.hand.splice(cardIdx, 1);

  state.lastPlayedCard = { card: cardInst, playerIndex: pi };
  state.turnNumber++;

  // Draw replacement
  const { card, remaining } = drawOne(state.deck);
  state.deck = remaining;
  player.hand.push(card);

  // Switch turn
  state.currentPlayer = pi === 0 ? 1 : 0;

  return state;
}

export function checkWinConditions(state: GameState): GameState {
  for (let i = 0; i < 2; i++) {
    const p = state.players[i];
    // Castle destroyed
    if (p.castle <= 0) {
      state.phase = 'gameOver';
      state.winner = (i === 0 ? 1 : 0) as 0 | 1;
      return state;
    }
  }
  for (let i = 0; i < 2; i++) {
    const p = state.players[i];
    // Castle reached max
    if (p.castle >= WIN_CASTLE) {
      state.phase = 'gameOver';
      state.winner = i as 0 | 1;
      return state;
    }
    // Resource victory
    if (p.bricks >= WIN_RESOURCES || p.gems >= WIN_RESOURCES || p.recruits >= WIN_RESOURCES) {
      state.phase = 'gameOver';
      state.winner = i as 0 | 1;
      return state;
    }
  }
  return state;
}

export function deepCloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}
