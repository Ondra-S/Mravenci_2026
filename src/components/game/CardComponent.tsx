import { CardInstance } from '../../engine/types';
import { getCardDef } from '../../engine/cards';
import './CardComponent.css';

interface Props {
  card: CardInstance;
  canPlay: boolean;
  onPlay: (uid: number) => void;
  onDiscard: (uid: number) => void;
  disabled: boolean;
}

const RESOURCE_COLORS: Record<string, string> = {
  bricks: 'card-brick',
  gems: 'card-gem',
  recruits: 'card-recruit',
};

const RESOURCE_ICONS: Record<string, string> = {
  bricks: '🧱',
  gems: '💎',
  recruits: '⚔️',
};

const RESOURCE_LABELS: Record<string, string> = {
  bricks: 'Cihly',
  gems: 'Krystaly',
  recruits: 'Zbraně',
};

export function CardComponent({ card, canPlay, onPlay, onDiscard, disabled }: Props) {
  const def = getCardDef(card.definitionId);
  const colorClass = RESOURCE_COLORS[def.resourceType];

  return (
    <div className={`card ${colorClass} ${canPlay ? 'card-playable' : 'card-unplayable'} ${disabled ? 'card-disabled' : ''}`}>
      <div className="card-header">
        <span className="card-name">{def.name}</span>
        <span className="card-cost">
          {def.cost} {RESOURCE_ICONS[def.resourceType]}
        </span>
      </div>
      <div className="card-body">
        <p className="card-description">{def.description}</p>
        {def.playAgain && <p className="card-extra">Hraj znovu!</p>}
      </div>
      <div className="card-resource-label">{RESOURCE_LABELS[def.resourceType]}</div>
      <div className="card-actions">
        <button
          className="card-btn card-btn-play"
          disabled={!canPlay || disabled}
          onClick={() => onPlay(card.uid)}
        >
          Zahraj
        </button>
        <button
          className="card-btn card-btn-discard"
          disabled={disabled}
          onClick={() => onDiscard(card.uid)}
        >
          Odhoď
        </button>
      </div>
    </div>
  );
}
