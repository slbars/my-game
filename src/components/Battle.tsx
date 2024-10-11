// src/components/Battle.tsx

import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../index';
import { startBattle, performAttack } from '../store/battleSlice';
import MonsterInfo from './MonsterInfo';
import '../styles/Battle.css';

const Battle: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const { currentBattle, status, error } = useAppSelector((state) => state.battle);
  const { player } = useAppSelector((state) => state.player);
  const logEndRef = useRef<HTMLDivElement>(null);

  const monsterId = 1; // Замените на реальный ID монстра

  useEffect(() => {
    if (!currentBattle && status !== 'loading') {
      dispatch(startBattle(monsterId));
    }
  }, [dispatch, currentBattle, status, monsterId]);

  useEffect(() => {
    if (currentBattle && currentBattle.monster) {
      console.log('Monster data:', currentBattle.monster);
    }
  }, [currentBattle]);

  useEffect(() => {
    // Прокрутка лога к последнему сообщению
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentBattle?.battleLog]);

  const handleAttack = () => {
    if (currentBattle) {
      console.log('Атакуем монстра');
      dispatch(performAttack(currentBattle.id));
    }
  };

  if (status === 'loading') {
    return <div>Бой начинается...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!currentBattle) {
    return <div>Нет активного боя.</div>;
  }

  const monster = currentBattle.monster;

  return (
    <div className="battle-container">
      <div className="battle-header">
        <div className="player-section">
          <h3>{player?.name} [Уровень {player?.level}]</h3>
          <div className="health-bar">
            <div
              className="health-bar-fill"
              style={{ width: `${(player?.currentHealth! / player?.maxHealth!) * 100}%` }}
            ></div>
          </div>
          <p>{player?.currentHealth} / {player?.maxHealth} HP</p>
        </div>
        <div className="monster-section">
          <MonsterInfo
            name={monster.name}
            level={monster.level}
            currentHealth={monster.currentHealth}
            maxHealth={monster.maxHealth}
          />
        </div>
      </div>

      <div className="battle-log">
        {currentBattle.battleLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
        <div ref={logEndRef} />
      </div>

      <button className="attack-button" onClick={handleAttack} disabled={status === 'loading'}>
        Атаковать
      </button>
    </div>
  );
});

export default Battle;
