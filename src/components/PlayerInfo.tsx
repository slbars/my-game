// src/components/PlayerInfo.tsx

import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { clearPlayer } from '../store/playerSlice';
import { clearBattle } from '../store/battleSlice';
import HealthBar from './HealthBar';
import ExperienceBar from './ExperienceBar';
import { useNavigate } from 'react-router-dom';
import '../styles/PlayerInfo.css';
import { disconnectSocket } from '../socket';

const PlayerInfoComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const player = useAppSelector((state) => state.player.player);
  const navigate = useNavigate();

  if (!player) {
    return null;
  }

  // Функция для обработки выхода из системы
  const handleLogout = async () => {
    // Сначала отключаем сокет
    disconnectSocket();
  
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
  
    // Очищаем состояние Redux
    dispatch(clearPlayer());
    dispatch(clearBattle());
  
    // Принудительно перенаправляем на страницу логина
    window.location.href = '/login';
  };

  // Функция для открытия страницы информации о персонаже в новом окне
  const openPlayerInfo = () => {
    const idEncoded = encodeURIComponent(player.id.toString());
    window.open(`http://localhost:3000/player_info?id=${idEncoded}`, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="player-info">
      <div className="player-info-header">
        <h3>
          {player.name} [{player.level}]
        </h3>
        <button className="info-button" onClick={openPlayerInfo} title="Информация об игроке">
          ℹ️
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      </div>
      <HealthBar currentHealth={player.currentHealth} maxHealth={player.maxHealth} />
      {player.experience !== undefined && (
        <ExperienceBar currentExp={player.experience} level={player.level} />
      )}
    </div>
  );
};

export default PlayerInfoComponent;
