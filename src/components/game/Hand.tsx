import { CardInstance } from '../../engine/types';
import { canPlayCard } from '../../engine/turnManager';
import { GameState } from '../../engine/types';
import { CardComponent } from './CardComponent';
import './Hand.css';

interface Props {
  cards: CardInstance[];
  state: GameState;
  onPlay: (uid: number) => void;
  onDiscard: (uid: number) => void;
  disabled: boolean;
}

export function Hand({ cards, state, onPlay, onDiscard, disabled }: Props) {
  return (
    <div className="hand">
      {cards.map((card) => (
        <CardComponent
          key={card.uid}
          card={card}
          canPlay={canPlayCard(state, card.uid)}
          onPlay={onPlay}
          onDiscard={onDiscard}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
