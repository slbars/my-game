// src/components/HealthBar.tsx

import React from 'react';
import '../styles/HealthBar.css';

interface HealthBarProps {
  currentHealth: number;
  maxHealth: number;
  type?: 'player' | 'monster';
}

const HealthBar: React.FC<HealthBarProps> = ({ currentHealth, maxHealth, type = 'player' }) => {
  const healthPercentage = currentHealth
    ? Math.min((currentHealth / maxHealth) * 100, 100)
    : 0;

  let healthClass = 'high-health';

  if (healthPercentage <= 30) {
    healthClass = 'low-health';
  } else if (healthPercentage <= 70) {
    healthClass = 'normal-health';
  }

  // Дополнительный класс для монстра
  const barClass = type === 'monster' ? 'monster-health-bar' : '';

  return (
    <div className="health-bar-container">
      <div
        className={`health-bar ${healthClass} ${barClass}`}
        style={{ width: `${healthPercentage}%` }}
      ></div>
      <div className="health-bar-text">
        {currentHealth || 0} / {maxHealth}
      </div>
    </div>
  );
};

export default HealthBar;
