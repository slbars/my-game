// src/components/PlayerInfo.tsx

import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { clearPlayer } from '../store/playerSlice';
import '../styles/PlayerInfo.css';
import { useNavigate } from 'react-router-dom';

const PlayerInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { player, loading, error } = useAppSelector((state) => state.player);

  const handleLogout = () => {
    dispatch(clearPlayer());
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div>Загрузка информации игрока...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!player) {
    return <div>Ошибка: данные игрока не загружены.</div>;
  }

  const healthPercentage = (player.currentHealth / player.maxHealth) * 100;

  return (
    <div className="player-info-container">
      <div className="player-info-header">
        <h3>{player.name} [Уровень {player.level}]</h3>
        <button className="logout-button" onClick={handleLogout}>
          &times;
        </button>
      </div>
      <div className="health-bar">
        <div
          className="health-bar-fill"
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
      <p>{player.currentHealth} / {player.maxHealth} HP</p>
    </div>
  );
};

export default PlayerInfo;
