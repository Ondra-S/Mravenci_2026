import { useGame } from './hooks/useGame';
import { MainMenu } from './components/menu/MainMenu';
import { GameBoard } from './components/game/GameBoard';

export default function App() {
  const game = useGame();

  if (game.state.phase === 'menu') {
    return <MainMenu onStartGame={game.startGame} />;
  }

  return (
    <GameBoard
      state={game.state}
      onPlayCard={game.playCard}
      onDiscardCard={game.discardCard}
      onReturnToMenu={game.returnToMenu}
    />
  );
}
