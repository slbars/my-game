// src/components/ButtonMenu.tsx

import React from 'react';
import '../styles/ButtonMenu.css';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { RootState } from '../store';

const ButtonMenu: React.FC = () => {
  const navigate = useNavigate();
  const isInBattle = useAppSelector((state: RootState) => !!state.battle.currentBattle);

  const handleNavigation = (path: string) => {
    if (isInBattle && path !== '/battle') {
      alert('Вы не можете покинуть битву, пока она не завершена!');
      return;
    }
    navigate(path);
  };

  return (
    <div id="button-menu-container" className="button-menu-container">
      <button
        id="location-btn"
        className="btn-primary btn-block mb-3"
        onClick={() => handleNavigation('/location')}
        disabled={isInBattle}
      >
        Локация
      </button>
      <button
        id="backpack-btn"
        className="btn-primary btn-block mb-3"
        onClick={() => handleNavigation('/backpack')}
        disabled={isInBattle}
      >
        Рюкзак
      </button>
      <button
        id="hunt-btn"
        className="btn-primary btn-block"
        onClick={() => handleNavigation('/hunt')}
        disabled={isInBattle}
      >
        Охота
      </button>
    </div>
  );
};

export default ButtonMenu;
