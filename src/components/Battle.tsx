// src/components/Battle.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { performPlayerAttackAction, performMonsterAttackAction, startBattle } from '../store/battleSlice';
import MonsterInfo from './MonsterInfo';
import HealthBar from './HealthBar';
import '../styles/Battle.css';

const Battle: React.FC = () => {
    const dispatch = useAppDispatch();
    const { currentBattle, status, battleLog, error } = useAppSelector((state) => state.battle);
    const { player } = useAppSelector((state) => state.player);
    const [isLoading, setIsLoading] = useState(false);
    const battleInitialized = useRef(false);

    // Инициализация битвы только один раз
    useEffect(() => {
        if (!battleInitialized.current && !currentBattle) {
            dispatch(startBattle(1)); // Начать битву с монстром с ID 1
            battleInitialized.current = true;
            console.log('Battle initialized');
        }
    }, [dispatch, currentBattle]);

    // Логи состояния при изменении currentBattle
    useEffect(() => {
        if (currentBattle) {
            console.log("Player Health:", currentBattle.playerHealth);
            console.log("Monster Health:", currentBattle.monsterHealth);
            console.log("Player:", currentBattle.player); // Логирование игрока
            console.log("Monster:", currentBattle.monster); // Логирование монстра
            console.log("Battle Log:", battleLog); // Логирование battleLog
        }
    }, [currentBattle, battleLog]);

    const handleAttack = async () => {
        console.log('handleAttack called');
        if (currentBattle && status === 'inBattle') {
            console.log('Player is attacking. Battle ID:', currentBattle.id);

            setIsLoading(true);
            try {
                // Атака игрока
                const updatedBattleAfterPlayerAttack = await dispatch(performPlayerAttackAction(currentBattle.id)).unwrap();
                console.log('Player attack successful:', updatedBattleAfterPlayerAttack);

                // Проверка урона игрока
                if (updatedBattleAfterPlayerAttack.playerDamage !== undefined) {
                    console.log(`Игрок нанес ${updatedBattleAfterPlayerAttack.playerDamage} урона`);
                }

                // Проверяем, не закончилась ли битва после атаки игрока
                if (updatedBattleAfterPlayerAttack.battleResult) {
                    console.log('Battle ended after player attack');
                    setIsLoading(false);
                    return;
                }

                // Задержка перед атакой монстра
                console.log('Waiting before monster attack');
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Атака монстра
                const updatedBattleAfterMonsterAttack = await dispatch(performMonsterAttackAction(currentBattle.id)).unwrap();
                console.log('Monster attack performed:', updatedBattleAfterMonsterAttack);

                // Проверка урона монстра
                if (updatedBattleAfterMonsterAttack.monsterDamage !== undefined) {
                    console.log(`Монстр нанес ${updatedBattleAfterMonsterAttack.monsterDamage} урона`);
                }

                // Проверяем, не закончилась ли битва после атаки монстра
                if (updatedBattleAfterMonsterAttack.battleResult) {
                    console.log('Battle ended after monster attack');
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Error during attack:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log('Cannot attack. Current status:', status);
        }
    };

    return (
        <div className="battle-container">
            <div className="battle-header">
                {player && currentBattle && (
                    <div className="player-card">
                        <h3>{player.name} [Уровень {player.level}]</h3>
                        <HealthBar currentHealth={currentBattle.playerHealth} maxHealth={player.maxHealth} />
                    </div>
                )}

                <div className="spacer"></div>

                {currentBattle && currentBattle.monster && (
                    <div className="monster-card">
                        <MonsterInfo
                            name={currentBattle.monster.name || 'Неизвестный монстр'}
                            level={currentBattle.monster.level}
                            currentHealth={currentBattle.monsterHealth > 0 ? currentBattle.monsterHealth : 0}
                            maxHealth={currentBattle.monster.maxHealth}
                        />
                    </div>
                )}
            </div>

            <div className="battle-log">
                {battleLog.length > 0 ? (
                    battleLog.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))
                ) : (
                    <div>Лог боя пуст</div>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {currentBattle?.battleResult ? (
                <div className="battle-result">
                    <h2>{currentBattle.battleResult}</h2>
                    {/* Карточка монстра остаётся на экране даже после завершения боя */}
                </div>
            ) : (
                <button
                    className="attack-button"
                    onClick={handleAttack}
                    disabled={status !== 'inBattle' || !currentBattle || isLoading}
                >
                    {isLoading ? 'Атакуем...' : 'Атаковать'}
                </button>
            )}
        </div>
    );
};

export default Battle;
