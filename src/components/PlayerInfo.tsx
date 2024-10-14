// src/components/PlayerInfo.tsx

import React from 'react';
import { useAppDispatch } from '../store';
import { clearPlayer } from '../store/playerSlice';
import HealthBar from './HealthBar';
import ExperienceBar from './ExperienceBar';
import '../styles/PlayerInfo.css';

interface PlayerInfoProps {
  player: {
    name: string;
    level: number;
    currentHealth: number;
    maxHealth: number;
    currentExp: number;
  };
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearPlayer());
  };

  return (
      <div className="player-info">
        <div className="player-info-header">
          <h3>{player.name} [Уровень {player.level}]</h3>
          <button className="logout-button small-logout-button" onClick={handleLogout}>X</button>
        </div>
        <HealthBar currentHealth={player.currentHealth} maxHealth={player.maxHealth} />
        <ExperienceBar currentExp={player.currentExp} level={player.level} />
      </div>
  );
};

export default PlayerInfo;
