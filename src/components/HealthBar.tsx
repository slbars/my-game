// src/components/HealthBar.tsx

import React from 'react';
import '../styles/HealthBar.css';

interface HealthBarProps {
  currentHealth: number;
  maxHealth: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ currentHealth, maxHealth }) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  let barColor;
  if (healthPercentage > 50) {
    barColor = 'green';
  } else if (healthPercentage > 20) {
    barColor = 'yellow';
  } else {
    barColor = 'red';
  }

  return (
    <div className="health-bar-container">
      <div
        className="health-bar-fill"
        style={{
          width: `${healthPercentage}%`,
          backgroundColor: barColor
        }}
      ></div>
      <span className="health-bar-text">
        {currentHealth} / {maxHealth}
      </span>
    </div>
  );
};

export default HealthBar;
