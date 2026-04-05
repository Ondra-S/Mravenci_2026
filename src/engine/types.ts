export type ResourceType = 'bricks' | 'gems' | 'recruits';

export interface PlayerState {
  castle: number;
  wall: number;
  bricks: number;
  gems: number;
  recruits: number;
  quarry: number;
  magic: number;
  dungeon: number;
  hand: CardInstance[];
}

export interface CardDefinition {
  id: string;
  name: string;
  resourceType: ResourceType;
  cost: number;
  description: string;
  playAgain?: boolean;
  effect: (state: GameState, playerIndex: 0 | 1) => GameState;
}

export interface CardInstance {
  uid: number;
  definitionId: string;
}

export type GameMode = 'ai' | 'local';
export type GamePhase = 'menu' | 'playing' | 'gameOver';

export interface GameState {
  players: [PlayerState, PlayerState];
  currentPlayer: 0 | 1;
  deck: CardInstance[];
  phase: GamePhase;
  winner: 0 | 1 | null;
  gameMode: GameMode;
  lastPlayedCard: { card: CardInstance; playerIndex: 0 | 1 } | null;
  turnNumber: number;
  nextUid: number;
}

export type GameAction =
  | { type: 'START_GAME'; mode: GameMode }
  | { type: 'PLAY_CARD'; cardUid: number }
  | { type: 'DISCARD_CARD'; cardUid: number }
  | { type: 'AI_TURN' }
  | { type: 'RETURN_TO_MENU' };
