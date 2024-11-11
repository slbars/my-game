// src/components/Hunt.tsx

import React, { useState, useEffect } from 'react';
import { getMonsters, createBattle, getActiveBattleByPlayer } from '../api/api';import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { setBattle } from '../store/battleSlice';
import '../styles/Hunt.css';
import { Monster } from '../types/types';

const Hunt: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Используйте тип состояния `RootState` для `state`
  const battleStatus = useAppSelector((state) => state.battle.status);
  const isInBattle = battleStatus === 'inBattle' || battleStatus === 'loading';

  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loadingMonsters, setLoadingMonsters] = useState(true);

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const data = await getMonsters();
        setMonsters(data);
      } catch (error) {
        console.error('Ошибка при получении монстров:', error);
        alert('Не удалось загрузить список монстров. Попробуйте снова.');
      } finally {
        setLoadingMonsters(false);
      }
    };

    fetchMonsters();
  }, []);
    const handleAttackMonster = async (monsterId: number) => {
      try {
        const newBattle = await createBattle({ monsterId });
        dispatch(setBattle(newBattle));
        navigate('/battle');
      } catch (error: any) {
        if (error.response?.status === 500) {
          const activeBattle = await getActiveBattleByPlayer();
          if (activeBattle) {
            dispatch(setBattle(activeBattle));
            navigate('/battle');
            return;
          }
        }
        console.error('Ошибка при создании битвы:', error);
        alert('Не удалось начать битву. Попробуйте снова.');
      }
    };
  if (loadingMonsters) {
    return <div>Загрузка монстров...</div>;
  }

  return (
    <div className="hunt-container">
      <h2>Доступные Монстры</h2>
      <div className="monsters-list">
        {monsters.map((monster: Monster) => (
          <button
            key={monster.id}
            className="btn-hunt btn-block"
            onClick={() => handleAttackMonster(monster.id)}
            disabled={isInBattle} // Здесь `isInBattle` теперь имеет тип `boolean`
          >
            {monster.name} (Уровень {monster.level})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hunt;
