// src/components/BattleStatistics.tsx

import React from 'react';
import { useAppSelector } from '../store'; // Используем кастомные хуки
import '../styles/BattleStatistics.css';

const BattleStatistics: React.FC = () => {
  const battle = useAppSelector((state) => state.battle.currentBattle);
  const player = useAppSelector((state) => state.player.player);

  if (!battle || !player) {
    return <div>Загрузка статистики боя...</div>;
  }

  const { experienceGained, playerTotalDamage, monsterTotalDamage, monster } = battle;

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
          <h3>Монстр: {monster.name} [Уровень {monster.level}]</h3>
          <p>Урон нанесённый: {monsterTotalDamage}</p>
          <p>Получено урона: {playerTotalDamage}</p>
        </div>
      </div>
      <p>Получено опыта: {experienceGained}</p>
      <button
        className="btn-exit"
        onClick={() => {
          // Логика для закрытия статистики, например, навигация обратно на локацию
          // Если вы используете React Router, можно использовать useNavigate
          // Пример:
          // const navigate = useNavigate();
          // navigate('/location');
        }}
      >
        Закрыть
      </button>
    </div>
  );
};

export default BattleStatistics;
