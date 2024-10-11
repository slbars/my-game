// src/components/GameContent.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Hunt from './Hunt';
import Backpack from './Backpack';
import Location from './Location';
import Battle from './Battle';

interface GameContentProps {
  view: 'location' | 'backpack' | 'hunt' | 'battle';
}

const GameContent: React.FC<GameContentProps> = ({ view }) => {
  const player = useSelector((state: RootState) => state.player.player);

  if (!player) {
    return <div>Ошибка: данные игрока не загружены.</div>;
  }

  switch (view) {
    case 'location':
      return <Location />;
    case 'backpack':
      return <Backpack />;
    case 'hunt':
      return <Hunt />;
    case 'battle':
      return <Battle />;
    default:
      return <div>Ошибка: Некорректное представление</div>;
  }
};

export default GameContent;
