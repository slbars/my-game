// src/components/ButtonMenu.tsx

import React from 'react';
import '../styles/ButtonMenu.css';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';

const ButtonMenu: React.FC = () => {
    const navigate = useNavigate();
    const battle = useAppSelector(state => state.battle.currentBattle);
    const isInBattle = !!(battle && !battle.battleResult); // Convert to boolean with !!

    const handleNavigation = (path: string) => {
        if (isInBattle && path !== 'battle') {
            alert('Вы не можете покинуть битву, пока она не завершена!');
            return;
        }
        navigate(path);
    };

    return (
        <div className="button-menu-container">
            <button
                className="btn-primary"
                onClick={() => handleNavigation('location')}
                disabled={isInBattle}
            >
                Локация
            </button>
            <button
                className="btn-primary"
                onClick={() => handleNavigation('backpack')}
                disabled={isInBattle}
            >
                Рюкзак
            </button>
            <button
                className="btn-primary"
                onClick={() => handleNavigation('hunt')}
                disabled={isInBattle}
            >
                Охота
            </button>
        </div>
    );
};

export default ButtonMenu;
