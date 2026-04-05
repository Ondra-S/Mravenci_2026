import { PlayerState } from '../../engine/types';
import { WIN_CASTLE } from '../../engine/constants';
import './Castle.css';

interface Props {
  player: PlayerState;
  side: 'left' | 'right';
}

export function Castle({ player, side }: Props) {
  const castlePct = Math.max(0, Math.min(100, (player.castle / WIN_CASTLE) * 100));
  const wallPct = Math.max(0, Math.min(100, (player.wall / 60) * 100));
  const castleHeight = 20 + castlePct * 1.3; // 20-150px range
  const wallHeight = 10 + wallPct * 0.8; // 10-90px range

  return (
    <div className={`castle-container castle-${side}`}>
      <div className="castle-scene">
        {/* Castle structure */}
        <div className="castle-building" style={{ height: `${castleHeight}px` }}>
          {/* Towers */}
          <div className="castle-tower castle-tower-left">
            <div className="tower-top" />
            <div className="tower-body">
              {castlePct > 30 && <div className="tower-window" />}
            </div>
          </div>
          <div className="castle-tower castle-tower-right">
            <div className="tower-top" />
            <div className="tower-body">
              {castlePct > 30 && <div className="tower-window" />}
            </div>
          </div>

          {/* Main keep */}
          <div className="castle-keep">
            <div className="keep-battlements">
              <div className="merlon" />
              <div className="merlon" />
              <div className="merlon" />
              <div className="merlon" />
              <div className="merlon" />
            </div>
            <div className="keep-body">
              {castlePct > 20 && <div className="keep-window" />}
              {castlePct > 40 && <div className="keep-window" />}
              {castlePct > 60 && (
                <div className="keep-window-row">
                  <div className="keep-window" />
                  <div className="keep-window" />
                </div>
              )}
              <div className="keep-gate" />
            </div>
          </div>
        </div>

        {/* Wall */}
        <div
          className={`castle-wall ${side === 'left' ? 'wall-right' : 'wall-left'}`}
          style={{ height: `${wallHeight}px` }}
        >
          <div className="wall-battlements">
            <div className="wall-merlon" />
            <div className="wall-merlon" />
            <div className="wall-merlon" />
          </div>
          <div className="wall-body" />
        </div>

        {/* Ground */}
        <div className="castle-ground" />
      </div>

      {/* HP labels */}
      <div className="castle-labels">
        <span className="castle-hp">
          🏰 {player.castle}
        </span>
        <span className="wall-hp">
          🛡️ {player.wall}
        </span>
      </div>
    </div>
  );
}
