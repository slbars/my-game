import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getPlayerById, loginPlayer as apiLoginPlayer } from '../api/api';
import { LoginResponse } from '../types/types';
import { RootState } from './index';

// Интерфейс состояния игрока, представляющий основные свойства игрока
interface Player {
  id: number;
  name: string;
  level: number;
  currentHealth: number;
  maxHealth: number;
  currentExp: number;
  experience: number;
  backpack: any[];
}

interface PlayerState {
  player: Player | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  player: null, // Изначально без игрока
  loading: false,
  error: null,
};

// Асинхронное действие для логина
export const loginPlayer = createAsyncThunk(
  'player/loginPlayer',
  async (credentials: { name: string; password: string }, { rejectWithValue }) => {
    try {
      // Запрос на сервер для логина игрока
      const response: LoginResponse = await apiLoginPlayer(credentials);

      // Преобразуем id игрока из строки в число, чтобы иметь единый формат
      const player = {
        ...response.player,
        id: Number(response.player.id), // Преобразуем id в число
        currentExp: response.player.experience || 0, // Добавляем значение текущего опыта
        backpack: response.player.backpack || [], // Добавляем значение для рюкзака
      };

      return { player, token: response.token }; // Возвращаем данные игрока и токен
    } catch (err: any) {
      // Возвращаем ошибку, если логин не удался
      return rejectWithValue(err.response?.data?.message || 'Ошибка при входе');
    }
  }
);

// Асинхронное действие для получения текущего игрока
export const fetchCurrentPlayer = createAsyncThunk(
  'player/fetchCurrentPlayer',
  async (_, { rejectWithValue }) => {
    try {
      // Запрос на сервер для получения информации о текущем игроке
      const response = await getPlayerById();
      const player = {
        ...response.player,
        currentExp: response.player.experience || 0, // Добавляем значение текущего опыта
        backpack: response.player.backpack || [], // Добавляем значение для рюкзака
      };
      return player; // Возвращаем данные игрока
    } catch (err: any) {
      // Возвращаем ошибку, если не удалось получить данные игрока
      return rejectWithValue(err.response?.data?.message || 'Ошибка при получении игрока');
    }
  }
);

// Создание slice для управления состоянием игрока
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Очистка данных игрока (например, при логауте)
    clearPlayer: (state) => {
      state.player = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token'); // Удаление токена при очистке
    },
    // Установка данных игрока вручную
    setPlayer: (state, action: PayloadAction<Player>) => {
      state.player = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Логин: обработка состояний запроса
    builder.addCase(loginPlayer.pending, (state) => {
      state.loading = true; // Устанавливаем состояние загрузки
      state.error = null; // Сбрасываем ошибки
    });
    builder.addCase(loginPlayer.fulfilled, (state, action) => {
      state.loading = false; // Останавливаем загрузку
      state.player = action.payload.player; // Устанавливаем данные игрока при успешном логине
    });
    builder.addCase(loginPlayer.rejected, (state, action) => {
      state.loading = false; // Останавливаем загрузку
      state.error = action.payload as string; // Устанавливаем ошибку
    });

    // Получение текущего игрока: обработка состояний запроса
    builder.addCase(fetchCurrentPlayer.pending, (state) => {
      state.loading = true; // Устанавливаем состояние загрузки
      state.error = null; // Сбрасываем ошибки
    });
    builder.addCase(fetchCurrentPlayer.fulfilled, (state, action) => {
      state.loading = false; // Останавливаем загрузку
      state.player = action.payload; // Устанавливаем данные текущего игрока
    });
    builder.addCase(fetchCurrentPlayer.rejected, (state, action) => {
      state.loading = false; // Останавливаем загрузку
      state.error = action.payload as string; // Устанавливаем ошибку

      // Добавляем проверку на ошибку авторизации и перенаправляем пользователя на логин
      if (action.payload === 'Ошибка при получении игрока') {
        localStorage.removeItem('token'); // Удаление токена при ошибке авторизации
        window.location.href = '/login'; // Перенаправление на страницу логина
      }
    });
  },
});

// Экспортируем действия для использования в компонентах
export const { clearPlayer, setPlayer } = playerSlice.actions;

// Экспортируем редьюсер для добавления в store
export default playerSlice.reducer;