// src/components/MonsterInfo.tsx

import React from 'react';
import '../styles/MonsterInfo.css';

interface MonsterInfoProps {
  name: string;
  level: number;
  currentHealth: number;
  maxHealth: number;
}

const MonsterInfo: React.FC<MonsterInfoProps> = ({ name, level, currentHealth, maxHealth }) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <div className="monster-info-container">
      <h3>{name} [Уровень {level}]</h3>
      <div className="health-bar">
        <div
          className="health-bar-fill"
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
      <p>{currentHealth} / {maxHealth} HP</p>
    </div>
  );
};

export default MonsterInfo;
