// src/components/Hunt.tsx

import React, { useState, useEffect } from 'react';
import { getMonsters, createBattle } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { setBattle, setBattleLog } from '../store/battleSlice';
import '../styles/Hunt.css';
import { Monster } from '../types/types';

const Hunt: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [loadingMonsters, setLoadingMonsters] = useState(true);
    const isLoading = useAppSelector(state => state.battle.status === 'loading' || state.battle.status === 'inBattle');

    useEffect(() => {
        const fetchMonsters = async () => {
            try {
                const data = await getMonsters();
                setMonsters(data);
            } catch (error) {
                console.error('Ошибка при получении монстров:', error);
            } finally {
                setLoadingMonsters(false);
            }
        };

        fetchMonsters();
    }, []);

    const handleAttackMonster = async (monsterId: number) => {
        try {
            const newBattle = await createBattle({ monsterId });
            dispatch(setBattle(newBattle)); // Передаём объект типа Battle
            dispatch(setBattleLog(newBattle.battleLog || []));
            navigate('/battle');
        } catch (error: any) {
            console.error('Ошибка при создании битвы:', error);
            // Можно добавить отображение ошибки пользователю
        }
    };

    if (loadingMonsters) {
        return <div>Загрузка монстров...</div>;
    }

    return (
        <div className="hunt-container">
            <h2>Доступные Монстры</h2>
            <div className="monsters-list">
                {monsters.map((monster: Monster) => (
                    <button
                        key={monster.id}
                        className="btn-hunt btn-block"
                        onClick={() => handleAttackMonster(monster.id)}
                        disabled={isLoading}
                    >
                        {monster.name} (Уровень {monster.level})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Hunt;
