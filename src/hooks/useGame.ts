import { useReducer, useCallback, useEffect } from 'react';
import { GameState, GameAction, GameMode } from '../engine/types';
import { initGame, generateResources, playCard, discardCard, deepCloneState } from '../engine/turnManager';
import { executeAiTurn } from '../engine/ai';

const initialState: GameState = {
  players: [
    { castle: 0, wall: 0, bricks: 0, gems: 0, recruits: 0, quarry: 0, magic: 0, dungeon: 0, hand: [] },
    { castle: 0, wall: 0, bricks: 0, gems: 0, recruits: 0, quarry: 0, magic: 0, dungeon: 0, hand: [] },
  ],
  currentPlayer: 0,
  deck: [],
  phase: 'menu',
  winner: null,
  gameMode: 'ai',
  lastPlayedCard: null,
  turnNumber: 0,
  nextUid: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const newState = initGame(action.mode);
      // Generate resources for first player's first turn
      return generateResources(newState);
    }
    case 'PLAY_CARD': {
      let s = deepCloneState(state);
      s = playCard(s, action.cardUid);
      if (s.phase === 'playing') {
        s = generateResources(s);
      }
      return s;
    }
    case 'DISCARD_CARD': {
      let s = deepCloneState(state);
      s = discardCard(s, action.cardUid);
      if (s.phase === 'playing') {
        s = generateResources(s);
      }
      return s;
    }
    case 'AI_TURN': {
      let s = deepCloneState(state);
      s = executeAiTurn(s);
      if (s.phase === 'playing') {
        s = generateResources(s);
      }
      return s;
    }
    case 'RETURN_TO_MENU': {
      return { ...initialState, phase: 'menu' };
    }
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((mode: GameMode) => {
    dispatch({ type: 'START_GAME', mode });
  }, []);

  const handlePlayCard = useCallback((cardUid: number) => {
    dispatch({ type: 'PLAY_CARD', cardUid });
  }, []);

  const handleDiscardCard = useCallback((cardUid: number) => {
    dispatch({ type: 'DISCARD_CARD', cardUid });
  }, []);

  const returnToMenu = useCallback(() => {
    dispatch({ type: 'RETURN_TO_MENU' });
  }, []);

  // AI auto-play
  useEffect(() => {
    if (
      state.phase === 'playing' &&
      state.gameMode === 'ai' &&
      state.currentPlayer === 1
    ) {
      const timer = setTimeout(() => {
        dispatch({ type: 'AI_TURN' });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.gameMode, state.currentPlayer, state.turnNumber]);

  return {
    state,
    startGame,
    playCard: handlePlayCard,
    discardCard: handleDiscardCard,
    returnToMenu,
  };
}
