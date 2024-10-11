// src/components/BattleResult.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearBattle } from '../store/battleSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/BattleResult.css';

const BattleResult: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const battle = useSelector((state: RootState) => state.battle.currentBattle);

  const handleExit = () => {
    dispatch(clearBattle());
    navigate('/location');
  };

  if (!battle || !battle.battleResult) {
    return <div>Загрузка результатов...</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{battle.battleResult}</h2>
        {battle.experienceGained > 0 && (
          <p>Вы получили {battle.experienceGained} опыта!</p>
        )}
        <p>Всего нанесено урона: {battle.playerTotalDamage}</p>
        <p>Получено урона от монстра: {battle.monsterTotalDamage}</p>
        <button className="btn-exit" onClick={handleExit}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default BattleResult;
