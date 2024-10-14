// src/components/ExperienceBar.tsx

import React from 'react';
import '../styles/ExperienceBar.css';

interface ExperienceBarProps {
  currentExp: number;
  level: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ currentExp, level }) => {
  const expForNextLevel = level * 100;
  const expPercentage = Math.min((currentExp / expForNextLevel) * 100, 100);

  return (
    <div className="experience-bar-container">
      <div
        className="experience-bar"
        style={{ width: `${expPercentage}%` }}
      ></div>
    </div>
  );
};

export default ExperienceBar;


