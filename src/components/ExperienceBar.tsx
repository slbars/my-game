// src/components/ExperienceBar.tsx

// src/components/ExperienceBar.tsx
import React, { useState } from 'react';
import '../styles/ExperienceBar.css';

interface ExperienceBarProps {
  currentExp: number;
  level: number;
}
  const ExperienceBar: React.FC<ExperienceBarProps> = ({ currentExp, level }) => {
    const [isHovered, setIsHovered] = useState(false);
    const expForNextLevel = level * 100;
    const expPercentage = Math.min((currentExp / expForNextLevel) * 100, 100);

    return (
      <div 
        className="experience-bar-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="experience-bar"
          style={{ width: `${expPercentage}%` }}
        ></div>
        <span className="experience-bar-text">
          {isHovered ? 'Опыт' : `${currentExp} / ${expForNextLevel}`}
        </span>
      </div>
    );
  };export default ExperienceBar;


