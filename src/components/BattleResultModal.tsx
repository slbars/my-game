// src/components/BattleResultModal.tsx

import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { saveBattleLog } from '../api/api';
import { setBattle, setBattleLog } from '../store/battleSlice';
import '../styles/BattleResultModal.css';

const BattleResultModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const battle = useAppSelector(state => state.battle.currentBattle);
  const battleLog = useAppSelector(state => state.battle.battleLog);

  const handleClose = async () => {
    if (battle) {
      try {
        await saveBattleLog(battle.id, battleLog);
        dispatch(setBattle(null));
        dispatch(setBattleLog([]));
      } catch (error) {
        console.error('Ошибка при сохранении лога боя:', error);
      }
    }
  };

  if (!battle || !battle.battleResult) {
    return null;
  }

  return (
      <div className="battle-result-modal">
        <h2>{battle.battleResult === 'win' ? 'Победа!' : 'Поражение!'}</h2>
        <button onClick={handleClose} className="btn-exit">
          Закрыть
        </button>
      </div>
  );
};

export default BattleResultModal;
