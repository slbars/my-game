// src/components/BattleStatistics.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Player } from '../types/types';
import '../styles/BattleStatistics.css';

const BattleStatistics: React.FC = () => {
  const battle = useSelector((state: RootState) => state.battle.currentBattle);
  const player = useSelector((state: RootState) => state.player.player);

  if (!battle || !player) {
    return <div>Загрузка статистики боя...</div>;
  }

  const { experienceGained, playerTotalDamage, monsterTotalDamage } = battle;

  return (
    <div className="battle-statistics-container">
      <h2>Статистика боя</h2>
      <div className="battle-statistics">
        <div className="statistics-player">
          <h3>Игрок: {player.name}</h3>
          <p>Уровень: {player.level}</p>
          <p>Опыт: {player.experience}</p>
          <p>Общий урон: {playerTotalDamage}</p>
        </div>
        <div className="statistics-monster">
          <h3>Монстр: ID {battle.monsterId}</h3>
          <p>Уровень: {/* Если есть информация о монстре, замените на его уровень */}</p>
          <p>Опыт за победу: {battle.experienceGained}</p>
          <p>Общий урон: {monsterTotalDamage}</p>
        </div>
      </div>
      <p>Получено опыта: {experienceGained}</p>
      <button className="btn-exit" onClick={() => {/* реализуйте логику закрытия */}}>
        Закрыть
      </button>
    </div>
  );
};

export default BattleStatistics;
