import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getPlayerById, loginPlayer as apiLoginPlayer } from '../api/api';
import { Player, LoginResponse } from '../types/types';
import { RootState } from './index';

// Интерфейс состояния игрока
interface PlayerState {
  player: Player | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  player: null,
  loading: false,
  error: null,
};

// Асинхронное действие для логина
export const loginPlayer = createAsyncThunk(
  'player/loginPlayer',
  async (credentials: { name: string; password: string }, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await apiLoginPlayer(credentials);

      // Преобразуем id игрока из строки в число
      const player = {
        ...response.player,
        id: Number(response.player.id), // Преобразуем id в число
      };

      return { player, token: response.token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка при входе');
    }
  }
);

// Асинхронное действие для получения текущего игрока
export const fetchCurrentPlayer = createAsyncThunk(
  'player/fetchCurrentPlayer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPlayerById();
      return response.player;
    } catch (err: any) {
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
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token'); // Удаление токена при очистке
    },
    setPlayer: (state, action: PayloadAction<Player>) => {
      state.player = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Логин
    builder.addCase(loginPlayer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginPlayer.fulfilled, (state, action) => {
      state.loading = false;
      state.player = action.payload.player; // Здесь уже будет число
    });
    builder.addCase(loginPlayer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Получение текущего игрока
    builder.addCase(fetchCurrentPlayer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentPlayer.fulfilled, (state, action) => {
      state.loading = false;
      state.player = action.payload;
    });
    builder.addCase(fetchCurrentPlayer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;

      // Добавляем проверку на ошибку авторизации и перенаправляем пользователя на логин
      if (action.payload === 'Ошибка при получении игрока') {
        localStorage.removeItem('token'); // Удаление токена
        window.location.href = '/login'; // Перенаправление на страницу логина
      }
    });
  },
});

export const { clearPlayer, setPlayer } = playerSlice.actions;

export default playerSlice.reducer;
