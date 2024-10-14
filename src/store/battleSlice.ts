// src/store/battleSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { playerAttack, monsterAttack, createBattle } from '../api/api';
import { Battle } from '../types/types';

interface BattleState {
    currentBattle: Battle | null;
    battleLog: string[];
    status: 'idle' | 'loading' | 'failed' | 'inBattle';
    error: string | null;
}

const initialState: BattleState = {
    currentBattle: null,
    battleLog: [],
    status: 'idle',
    error: null,
};

// Создание битвы
export const startBattle = createAsyncThunk<Battle, number>(
    'battle/startBattle',
    async (monsterId: number, { rejectWithValue }) => {
        try {
            const battle = await createBattle({ monsterId });
            return battle;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to start battle');
        }
    }
);

// Атака игрока
export const performPlayerAttackAction = createAsyncThunk<
    Battle,
    number,
    { state: { battle: BattleState }, rejectValue: string }
>(
    'battle/performPlayerAttack',
    async (battleId: number, { rejectWithValue }) => {
        try {
            const battle = await playerAttack(battleId);
            return battle;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to perform player attack');
        }
    }
);

// Атака монстра
export const performMonsterAttackAction = createAsyncThunk<
    Battle,
    number,
    { state: { battle: BattleState }, rejectValue: string }
>(
    'battle/performMonsterAttack',
    async (battleId: number, { rejectWithValue }) => {
        try {
            const battle = await monsterAttack(battleId);
            return battle;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to perform monster attack');
        }
    }
);

const battleSlice = createSlice({
    name: 'battle',
    initialState,
    reducers: {
        setBattle: (state, action: PayloadAction<Battle | null>) => {
            state.currentBattle = action.payload;
            state.battleLog = action.payload?.battleLog ?? [];
            state.status = 'idle';
            state.error = null;
            console.log('setBattle called:', action.payload);
        },
        clearBattle: (state) => {
            state.currentBattle = null;
            state.battleLog = [];
            state.status = 'idle';
            state.error = null;
            console.log('clearBattle called');
        },
        setBattleLog: (state, action: PayloadAction<string[]>) => {
            state.battleLog = action.payload;
            console.log('setBattleLog called:', action.payload);
        },
    },
    extraReducers: (builder) => {
        // startBattle
        builder
            .addCase(startBattle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                console.log('startBattle pending');
            })
            .addCase(startBattle.fulfilled, (state, action: PayloadAction<Battle>) => {
                state.status = 'inBattle';
                state.currentBattle = action.payload;
                state.battleLog = action.payload.battleLog;
                state.error = null;
                console.log('startBattle fulfilled:', action.payload);
            })
            .addCase(startBattle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                console.log('startBattle rejected:', action.payload);
            });

        // performPlayerAttackAction
        builder
            .addCase(performPlayerAttackAction.fulfilled, (state, action: PayloadAction<Battle>) => {
                state.status = 'inBattle';
                state.currentBattle = action.payload;

                if (action.payload.player && action.payload.monster) {
                    state.battleLog = [
                        ...state.battleLog,
                        `Игрок ${action.payload.player.name} атаковал монстра ${action.payload.monster.name} и нанес ${action.payload.playerDamage} урона.`,
                        ...action.payload.battleLog
                    ];

                    // Если битва не закончилась, переход хода к монстру
                    if (!action.payload.battleResult) {
                        state.status = 'loading'; // Обновляем статус для хода монстра
                    }
                } else {
                    console.error('Ошибка: отсутствуют данные об игроке или монстре', action.payload);
                    state.error = 'Ошибка в данных битвы';
                }

                if (action.payload.battleResult) {
                    state.status = 'idle';
                }
            });

        // performMonsterAttackAction
        builder
            .addCase(performMonsterAttackAction.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                console.log('performMonsterAttackAction pending');
            })
            .addCase(performMonsterAttackAction.fulfilled, (state, action: PayloadAction<Battle>) => {
                state.status = 'inBattle';
                state.currentBattle = action.payload;

                console.log('Monster attacking:', action.payload.monster);

                if (action.payload.monster) {
                    state.battleLog = [
                        ...state.battleLog,
                        `Монстр ${action.payload.monster.name} атаковал игрока ${action.payload.player.name} и нанес ${action.payload.monsterDamage} урона.`,
                        ...action.payload.battleLog
                    ];
                } else {
                    console.error('Ошибка: данные о монстре отсутствуют', action.payload);
                    state.error = 'Ошибка в данных о монстре';
                }

                if (action.payload.battleResult) {
                    state.status = 'idle';
                }
            })
            .addCase(performMonsterAttackAction.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                console.log('performMonsterAttackAction rejected:', action.payload);
            });
    },
});

export const { setBattle, clearBattle, setBattleLog } = battleSlice.actions;

export default battleSlice.reducer;
