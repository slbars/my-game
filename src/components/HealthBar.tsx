// src/components/HealthBar.tsx
import React, { useState } from 'react';
import '../styles/HealthBar.css';

interface HealthBarProps {
  currentHealth: number;
  maxHealth: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ currentHealth, maxHealth }) => {
  const [isHovered, setIsHovered] = useState(false);
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
    <div 
      className="health-bar-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="health-bar-fill"
        style={{
          width: `${healthPercentage}%`,
          backgroundColor: barColor
        }}
      ></div>
      <span className="health-bar-text">
        {isHovered ? 'Здоровье' : `${currentHealth} / ${maxHealth}`}
      </span>
    </div>
  );
};

export default HealthBar;
