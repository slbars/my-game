// src/components/Battle.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchActiveBattle,
  performPlayerAttackAction,
  setBattle,
} from '../store/battleSlice';
import HealthBar from './HealthBar';
import MonsterInfo from './MonsterInfo';
import BattleResult from './BattleResult';
import Timer from './Timer';
import '../styles/Battle.css';
import { getSocket } from '../socket'; // Используем getSocket
import type { Battle as BattleType } from '../types/types';

const Battle: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const battleInitialized = useRef<boolean>(false);
  const currentBattle = useAppSelector((state) => state.battle.currentBattle);
  const battleLogs = currentBattle?.battleLogs?.message || [];
  const player = useAppSelector((state) => state.player.player);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeBattle = async () => {
      if (!battleInitialized.current) {
        battleInitialized.current = true;
        try {
          await dispatch(fetchActiveBattle()).unwrap();
        } catch (error) {
          console.error('Ошибка при инициализации битвы:', error);
          navigate('/hunt');
        }
      }
    };

    initializeBattle();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [battleLogs]);

  useEffect(() => {
    if (!currentBattle || !currentBattle.id) return;

    const socket = getSocket();

    if (socket) {
      socket.emit('joinBattle', currentBattle.id);

      socket.on('battleUpdated', (updatedBattle: BattleType) => {
        console.log('Получено обновление битвы:', updatedBattle);
        dispatch(setBattle(updatedBattle));
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveBattle', currentBattle.id);
        socket.off('battleUpdated');
      }
    };
  }, [currentBattle?.id, dispatch]);

  const handleAttack = async () => {
    if (currentBattle && currentBattle.id) {
      setIsLoading(true);
      try {
        const result = await dispatch(performPlayerAttackAction(currentBattle.id)).unwrap();
        if (!result.battleResult) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await dispatch(fetchActiveBattle()).unwrap();
        }
      } catch (error: any) {
        console.error('Ошибка во время атаки:', error);
        alert(error.response?.data?.message || 'Произошла ошибка при атаке');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!currentBattle) {
    return <div>Загрузка битвы...</div>;
  }

  if (currentBattle.battleResult) {
    return <BattleResult />;
  }

  if (!currentBattle.monster) {
    return <div>Загрузка битвы...</div>;
  }

  return (
    <div className="battle-container">
      <div className="battle-id">Битва id: {currentBattle.id}</div>
      <div className="battle-header">
        {player && (
          <div className="player-card">
            <h3>
              {player.name} [Уровень {player.level}]
            </h3>
            <HealthBar currentHealth={currentBattle.playerHealth} maxHealth={player.maxHealth} />
          </div>
        )}

        {currentBattle.isPlayerTurn && currentBattle.turnEndTime && (
          <div className="timer-container">
            <Timer turnEndTime={currentBattle.turnEndTime} onTimeUp={() => {}} />
          </div>
        )}

        {currentBattle.monster && (
          <div className="monster-card">
            <MonsterInfo
              name={currentBattle.monster.name}
              level={currentBattle.monster.level}
              currentHealth={currentBattle.monsterHealth}
              maxHealth={currentBattle.monster.maxHealth}
            />
          </div>
        )}
      </div>
      <div className="battle-log">
        {battleLogs.map((log: string, index: number) => (
          <p key={index}>{log}</p>
        ))}
        <div ref={logEndRef}></div>
      </div>
      <div className="battle-controls">
        <button
          className="attack-button"
          onClick={handleAttack}
          disabled={isLoading || !currentBattle.isPlayerTurn}
        >
          Атаковать
        </button>
      </div>
    </div>
  );
};
export default Battle;
