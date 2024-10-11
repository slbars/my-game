// src/index/battleSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { attack, createBattle } from '../api/api';
import { Battle } from '../types/types';

interface BattleState {
  currentBattle: Battle | null;
  battleLog: string[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: BattleState = {
  currentBattle: null,
  battleLog: [],
  status: 'idle',
  error: null,
};

// Асинхронное действие для начала боя
export const startBattle = createAsyncThunk<Battle, number>(
  'battle/startBattle',
  async (monsterId: number) => {
    const battle = await createBattle({ monsterId });
    return battle;
  }
);

// Асинхронное действие для атаки
export const performAttack = createAsyncThunk<
  {
    battleLog: string[];
    playerHealth: number;
    monsterHealth: number;
    experienceGained: number;
    battleResult: string | null;
    playerTotalDamage: number;
    monsterTotalDamage: number;
    monster: {
      id: number;
      name: string;
      level: number;
      maxHealth: number;
      currentHealth: number;
    };
  },
  number
>(
  'battle/performAttack',
  async (battleId: number) => {
    const response = await attack(battleId);
    return response;
  }
);

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setBattle(state, action: PayloadAction<Battle | null>) {
      state.currentBattle = action.payload;
      state.battleLog = action.payload?.battleLog || [];
      state.status = 'idle';
      state.error = null;
    },
    clearBattle(state) {
      state.currentBattle = null;
      state.battleLog = [];
      state.status = 'idle';
      state.error = null;
    },
    setBattleLog(state, action: PayloadAction<string[]>) {
      state.battleLog = action.payload;
    },
    appendToBattleLog(state, action: PayloadAction<string | string[]>) {
      if (typeof action.payload === 'string') {
        state.battleLog.push(action.payload);
      } else {
        state.battleLog.push(...action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // startBattle
      .addCase(startBattle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startBattle.fulfilled, (state, action: PayloadAction<Battle>) => {
        state.status = 'idle';
        state.currentBattle = action.payload;
        state.battleLog = action.payload.battleLog;
      })
      .addCase(startBattle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка при начале боя';
      })
      // performAttack
      .addCase(performAttack.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        performAttack.fulfilled,
        (
          state,
          action: PayloadAction<{
            battleLog: string[];
            playerHealth: number;
            monsterHealth: number;
            experienceGained: number;
            battleResult: string | null;
            playerTotalDamage: number;
            monsterTotalDamage: number;
            monster: {
              id: number;
              name: string;
              level: number;
              maxHealth: number;
              currentHealth: number;
            };
          }>
        ) => {
          state.battleLog = state.battleLog.concat(action.payload.battleLog);
          state.currentBattle = {
            ...state.currentBattle!,
            playerHealth: action.payload.playerHealth,
            monsterHealth: action.payload.monsterHealth,
            experienceGained: action.payload.experienceGained,
            battleResult: action.payload.battleResult,
            playerTotalDamage: action.payload.playerTotalDamage,
            monsterTotalDamage: action.payload.monsterTotalDamage,
            monster: action.payload.monster,
          };
          state.status = 'idle';
        }
      )
      .addCase(performAttack.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка при атаке';
      });
  },
});

export const { setBattle, clearBattle, setBattleLog, appendToBattleLog } = battleSlice.actions;
export default battleSlice.reducer;
