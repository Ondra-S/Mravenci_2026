import { GameMode } from '../../engine/types';
import './MainMenu.css';

interface Props {
  onStartGame: (mode: GameMode) => void;
}

export function MainMenu({ onStartGame }: Props) {
  return (
    <div className="menu-container">
      <div className="menu-backdrop" />
      <div className="menu-content">
        <h1 className="menu-title">Mravenci</h1>
        <p className="menu-subtitle">Karetní hra o stavbě hradu</p>
        <div className="menu-buttons">
          <button className="menu-btn" onClick={() => onStartGame('ai')}>
            <span className="menu-btn-icon">&#9876;</span>
            Hra proti počítači
          </button>
          <button className="menu-btn" onClick={() => onStartGame('local')}>
            <span className="menu-btn-icon">&#9878;</span>
            Dva hráči
          </button>
        </div>
        <div className="menu-rules">
          <h3>Pravidla</h3>
          <ul>
            <li>Každý tah zahraj jednu kartu nebo ji odhoď</li>
            <li>Zdroje se generují na začátku každého tahu</li>
            <li>Zeď chrání hrad před poškozením</li>
          </ul>
          <h3>Podmínky výhry</h3>
          <ul>
            <li>Postav hrad na 100 bodů</li>
            <li>Znič soupeřův hrad</li>
            <li>Nasbírej 100 jakéhokoli zdroje</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
