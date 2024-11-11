// src/store/playerSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentPlayer, loginPlayer as apiLoginPlayer } from '../api/api';
import { LoginResponse, Player } from '../types/types';

interface PlayerState {
  player: Player | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  player: null,
  token: localStorage.getItem('token'), // Инициализируем из localStorage
  loading: false,
  error: null,
};

// Асинхронный thunk для входа игрока
export const loginPlayer = createAsyncThunk(
  'player/loginPlayer',
  async (credentials: { name: string; password: string }, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await apiLoginPlayer(credentials);
      const player: Player = {
        ...response.player,
        id: Number(response.player.id),
        backpack: response.player.backpack || [],
      };
      const token = response.token;
      return { player, token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка при входе');
    }
  }
);

// Асинхронный thunk для получения текущего игрока
export const fetchCurrentPlayer = createAsyncThunk(
  'player/fetchCurrentPlayer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentPlayer();
      const player: Player = {
        ...response.player,
        backpack: response.player.backpack || [],
      };
      return player;
    } catch (err: any) {
      console.error('Ошибка в fetchCurrentPlayer:', err);
      return rejectWithValue(err.response?.data?.message || 'Ошибка при получении игрока');
    }
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    clearPlayer: (state) => {
      state.player = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token'); // Удаляем токен из localStorage при выходе
      localStorage.removeItem('userId'); // Удаляем userId из localStorage при выходе
    },
    setPlayer: (state, action: PayloadAction<Player>) => {
      state.player = action.payload;
      localStorage.setItem('userId', action.payload.id.toString()); // Сохраняем userId
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload); // Сохраняем токен в localStorage
    },
  },
  extraReducers: (builder) => {
    // Обработка состояния loginPlayer
    builder.addCase(loginPlayer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginPlayer.fulfilled, (state, action) => {
      state.loading = false;
      state.player = action.payload.player;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.player.id.toString());
    });
    builder.addCase(loginPlayer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Обработка состояния fetchCurrentPlayer
    builder.addCase(fetchCurrentPlayer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentPlayer.fulfilled, (state, action) => {
      state.loading = false;
      state.player = action.payload;
      localStorage.setItem('userId', action.payload.id.toString());
    });
    builder.addCase(fetchCurrentPlayer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.player = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    });
  },
});

export const { clearPlayer, setPlayer, setToken } = playerSlice.actions;
export default playerSlice.reducer;
