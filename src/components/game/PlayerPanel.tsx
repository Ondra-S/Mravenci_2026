import { PlayerState } from '../../engine/types';
import './PlayerPanel.css';

interface Props {
  player: PlayerState;
  label: string;
  isActive: boolean;
  side: 'left' | 'right';
}

export function PlayerPanel({ player, label, isActive, side }: Props) {
  return (
    <div className={`player-panel panel-${side} ${isActive ? 'panel-active' : ''}`}>
      <h2 className="panel-label">{label}</h2>

      <div className="panel-structure">
        <div className="structure-item">
          <span className="structure-icon">🏰</span>
          <span className="structure-value">{player.castle}</span>
          <span className="structure-name">Hrad</span>
        </div>
        <div className="structure-item">
          <span className="structure-icon">🧱</span>
          <span className="structure-value">{player.wall}</span>
          <span className="structure-name">Zeď</span>
        </div>
      </div>

      <div className="panel-resources">
        <div className="resource-row resource-brick">
          <div className="resource-gen">
            <span className="gen-label">Lom</span>
            <span className="gen-value">{player.quarry}</span>
          </div>
          <div className="resource-amount">
            <span className="res-icon">🧱</span>
            <span className="res-value">{player.bricks}</span>
          </div>
        </div>

        <div className="resource-row resource-gem">
          <div className="resource-gen">
            <span className="gen-label">Magie</span>
            <span className="gen-value">{player.magic}</span>
          </div>
          <div className="resource-amount">
            <span className="res-icon">💎</span>
            <span className="res-value">{player.gems}</span>
          </div>
        </div>

        <div className="resource-row resource-recruit">
          <div className="resource-gen">
            <span className="gen-label">Kasárna</span>
            <span className="gen-value">{player.dungeon}</span>
          </div>
          <div className="resource-amount">
            <span className="res-icon">⚔️</span>
            <span className="res-value">{player.recruits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
