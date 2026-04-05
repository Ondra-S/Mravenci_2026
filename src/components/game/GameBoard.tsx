import { GameState } from '../../engine/types';
import { PlayerPanel } from './PlayerPanel';
import { Castle } from './Castle';
import { Hand } from './Hand';
import { GameStatus } from './GameStatus';
import './GameBoard.css';

interface Props {
  state: GameState;
  onPlayCard: (uid: number) => void;
  onDiscardCard: (uid: number) => void;
  onReturnToMenu: () => void;
}

export function GameBoard({ state, onPlayCard, onDiscardCard, onReturnToMenu }: Props) {
  const isPlayerTurn = state.phase === 'playing' && (
    state.gameMode === 'local' || state.currentPlayer === 0
  );

  const currentHandPlayer = state.gameMode === 'local'
    ? state.currentPlayer
    : 0;

  const player1Label = state.gameMode === 'ai' ? 'Ty' : 'Hráč 1';
  const player2Label = state.gameMode === 'ai' ? 'Počítač' : 'Hráč 2';

  return (
    <div className="game-board">
      <div className="game-board-backdrop" />

      {/* Top area: status */}
      <GameStatus state={state} onReturnToMenu={onReturnToMenu} />

      {/* Middle area: panels + castles */}
      <div className="game-arena">
        <PlayerPanel
          player={state.players[0]}
          label={player1Label}
          isActive={state.currentPlayer === 0}
          side="left"
        />

        <div className="castles-area">
          <Castle player={state.players[0]} side="left" />
          <div className="vs-divider">
            <span className="vs-text">VS</span>
          </div>
          <Castle player={state.players[1]} side="right" />
        </div>

        <PlayerPanel
          player={state.players[1]}
          label={player2Label}
          isActive={state.currentPlayer === 1}
          side="right"
        />
      </div>

      {/* Bottom area: current player's hand */}
      <div className="hand-area">
        {state.gameMode === 'local' && (
          <div className="hand-label">
            Ruka hráče {state.currentPlayer + 1}
          </div>
        )}
        <Hand
          cards={state.players[currentHandPlayer].hand}
          state={state}
          onPlay={onPlayCard}
          onDiscard={onDiscardCard}
          disabled={!isPlayerTurn}
        />
      </div>
    </div>
  );
}
