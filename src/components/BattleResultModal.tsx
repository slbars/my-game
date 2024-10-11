// src/components/BattleResultModal.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveBattleLog } from '../api/api'; // Теперь функция корректно импортируется
import { RootState } from '../store';
import { setBattle, setBattleLog } from '../store/battleSlice';
import '../styles/BattleResultModal.css';

const BattleResultModal: React.FC = () => {
  const dispatch = useDispatch();
  const battle = useSelector((state: RootState) => state.battle.currentBattle);
  const battleLog = useSelector((state: RootState) => state.battle.battleLog);

  const handleClose = async () => {
    if (battle) {
      try {
        // Передаём два аргумента — battleId и battleLog
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
      <div className="modal-content">
        <h3>Результат боя</h3>
        <p>{battle.battleResult}</p>
        <button onClick={handleClose} className="close-button">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default BattleResultModal;
