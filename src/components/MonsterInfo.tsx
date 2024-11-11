// src/components/MonsterInfo.tsx

import React from 'react';
import HealthBar from './HealthBar';
import '../styles/MonsterInfo.css';

interface MonsterInfoProps {
    name: string;
    level: number;
    currentHealth: number;
    maxHealth: number;
}

const MonsterInfo: React.FC<MonsterInfoProps> = ({ name, level, currentHealth, maxHealth }) => {
    const displayedHealth = currentHealth >= 0 ? currentHealth : 0;
    const displayedMaxHealth = maxHealth > 0 ? maxHealth : 1;

    return (
        <div className="monster-info-container">
            <h3>{name} [{level}]</h3>
            <HealthBar currentHealth={displayedHealth} maxHealth={displayedMaxHealth} />
        </div>
    );
};

export default MonsterInfo;
