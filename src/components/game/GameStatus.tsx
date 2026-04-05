import { GameState } from '../../engine/types';
import { getCardDef } from '../../engine/cards';
import './GameStatus.css';

interface Props {
  state: GameState;
  onReturnToMenu: () => void;
}

export function GameStatus({ state, onReturnToMenu }: Props) {
  if (state.phase === 'gameOver') {
    const winnerLabel = state.gameMode === 'ai'
      ? (state.winner === 0 ? 'Vyhrál jsi!' : 'Počítač vyhrál!')
      : `Hráč ${(state.winner ?? 0) + 1} vyhrál!`;

    return (
      <div className="game-over-overlay">
        <div className="game-over-dialog">
          <h2 className="game-over-title">{winnerLabel}</h2>
          <p className="game-over-subtitle">
            {state.players[state.winner ?? 0].castle >= 100 && 'Hrad dosáhl 100 bodů!'}
            {state.players[state.winner === 0 ? 1 : 0]?.castle <= 0 && 'Soupeřův hrad byl zničen!'}
            {(() => {
              const w = state.players[state.winner ?? 0];
              if (w.bricks >= 100) return 'Nashromážděno 100 cihel!';
              if (w.gems >= 100) return 'Nashromážděno 100 krystalů!';
              if (w.recruits >= 100) return 'Nashromážděno 100 zbraní!';
              return '';
            })()}
          </p>
          <button className="game-over-btn" onClick={onReturnToMenu}>
            Zpět do menu
          </button>
        </div>
      </div>
    );
  }

  // Turn indicator
  const currentLabel = state.gameMode === 'ai'
    ? (state.currentPlayer === 0 ? 'Tvůj tah' : 'Soupeř přemýšlí...')
    : `Hráč ${state.currentPlayer + 1} – tvůj tah`;

  const lastCard = state.lastPlayedCard
    ? getCardDef(state.lastPlayedCard.card.definitionId)
    : null;

  const lastPlayerLabel = state.lastPlayedCard
    ? (state.gameMode === 'ai'
      ? (state.lastPlayedCard.playerIndex === 0 ? 'Ty' : 'Počítač')
      : `Hráč ${state.lastPlayedCard.playerIndex + 1}`)
    : null;

  return (
    <div className="game-status">
      <div className={`turn-indicator ${state.gameMode === 'ai' && state.currentPlayer === 1 ? 'turn-ai' : ''}`}>
        {currentLabel}
      </div>
      {lastCard && (
        <div className="last-played">
          {lastPlayerLabel} zahrál: <strong>{lastCard.name}</strong>
        </div>
      )}
    </div>
  );
}
