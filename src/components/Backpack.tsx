// src/components/Backpack.tsx

import React from 'react';
import '../styles/Backpack.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Backpack: React.FC = () => {
  const player = useSelector((state: RootState) => state.player.player);

  if (!player) {
    return <div>Ошибка: данные игрока не загружены.</div>;
  }

  return (
    <div className="backpack-container">
      <h3>Рюкзак</h3>
      <div className="backpack-grid">
        {player.backpack.map((item, index) => (
          <div key={index} className="backpack-cell">
            {item ? item : 'Пусто'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Backpack;
