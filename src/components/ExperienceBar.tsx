// src/components/ExperienceBar.tsx

import React from 'react';
import '../styles/ExperienceBar.css';

interface ExperienceBarProps {
  currentExp: number;
  level: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ currentExp, level }) => {
  const expForNextLevel = level * 100; // 100 опыта для каждого уровня
  const expPercentage = Math.min((currentExp / expForNextLevel) * 100, 100);

  return (
    <div className="experience-bar-container">
      <div
        className="experience-bar"
        style={{ width: `${expPercentage}%` }}
      ></div>
      <div className="experience-bar-text">
        {currentExp} / {expForNextLevel}
      </div>
    </div>
  );
};

export default ExperienceBar;
