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
  const { player, loading, error } = useSelector((state: RootState) => state.player);

  if (loading) {
    return <div>Загрузка данных игрока...</div>;
  }

  if (error) {
    return <div>Ошибка при загрузке данных: {error}</div>;
  }

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
