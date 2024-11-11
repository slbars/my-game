// src/store/battleSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { playerAttack, monsterAttack, createBattle, getActiveBattleByPlayer } from '../api/api';
import { Battle } from '../types/types';

interface BattleState {
  currentBattle: Battle | null;
  battleLogs: string[];  // Массив строк для логов
  status: 'idle' | 'loading' | 'failed' | 'inBattle';
  error: string | null;
}

const initialState: BattleState = {
  currentBattle: null,
  battleLogs: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const startBattle = createAsyncThunk<Battle, number, { rejectValue: string }>(
  'battle/startBattle',
  async (monsterId, { rejectWithValue }) => {
    try {
      const battle = await createBattle({ monsterId });
      console.log('Battle created:', battle);
      return battle;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось начать битву');
    }
  }
);

export const performPlayerAttackAction = createAsyncThunk<Battle, number, { rejectValue: string }>(
  'battle/performPlayerAttack',
  async (battleId, { rejectWithValue }) => {
    try {
      const battle = await playerAttack(battleId);
      return battle;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось выполнить атаку');
    }
  }
);

export const performMonsterAttackAction = createAsyncThunk<Battle, number, { rejectValue: string }>(
  'battle/performMonsterAttack',
  async (battleId, { rejectWithValue }) => {
    try {
      const battle = await monsterAttack(battleId);
      return battle;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось выполнить атаку монстра');
    }
  }
);

export const fetchActiveBattle = createAsyncThunk<Battle, void, { rejectValue: string }>(
  'battle/fetchActiveBattle',
  async (_, { rejectWithValue }) => {
    try {
      const battle = await getActiveBattleByPlayer();
      return battle;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось получить активную битву');
    }
  }
);

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setBattle: (state, action: PayloadAction<Battle | null>) => {
      state.currentBattle = action.payload;
      state.battleLogs = action.payload?.battleLogs?.message || [];
      console.log('Battle logs set:', state.battleLogs);
      state.status = action.payload && !action.payload.battleResult ? 'inBattle' : 'idle';
      state.error = null;
    },
    clearBattle: (state) => {
      state.currentBattle = null;
      state.battleLogs = [];
      state.status = 'idle';
      state.error = null;
    },
    setBattleLog: (state, action: PayloadAction<string[]>) => {
      state.battleLogs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startBattle.fulfilled, (state, action) => {
        state.currentBattle = action.payload;
        state.battleLogs = action.payload.battleLogs?.message || [];
        console.log('Battle logs in reducer:', state.battleLogs);
        state.status = 'inBattle';
        state.error = null;
      })
      .addCase(performPlayerAttackAction.fulfilled, (state, action) => {
        state.currentBattle = action.payload;
        state.battleLogs = action.payload.battleLogs?.message || [];
        console.log('Обновление после атаки игрока:', state.battleLogs);
      })
      .addCase(performMonsterAttackAction.fulfilled, (state, action) => {
        state.currentBattle = action.payload;
        state.battleLogs = action.payload.battleLogs?.message || [];
        console.log('Обновление после атаки монстра:', state.battleLogs);
      })
      .addCase(fetchActiveBattle.fulfilled, (state, action) => {
        state.currentBattle = action.payload;
        state.battleLogs = action.payload.battleLogs?.message ?? [];
        state.status = action.payload.battleResult ? 'idle' : 'inBattle';
        state.error = null;
      });
  },
});

export const { setBattle, clearBattle, setBattleLog } = battleSlice.actions;
export default battleSlice.reducer;
