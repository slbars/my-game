// src/components/BattleResult.tsx

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { clearBattle } from '../store/battleSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/BattleResult.css';
import BattleStatistics from './BattleStatistics';

const BattleResult: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const battle = useAppSelector((state) => state.battle.currentBattle);
  const [showStatistics, setShowStatistics] = useState(false);

  const handleExit = () => {
    setShowStatistics(true);
  };

  if (showStatistics) {
    return <BattleStatistics />;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{battle?.battleResult === 'win' ? 'Победа!' : 'Поражение!'}</h2>
        <button className="btn-exit" onClick={handleExit}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default BattleResult;
