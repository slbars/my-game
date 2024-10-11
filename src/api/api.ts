// frontend/src/api/api.ts

import { Player, Monster, Battle, LoginResponse } from '../types/types';
import axios from 'axios';

// Создаём экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Замените на ваш URL бэкенда
});

// Добавляем interceptor для включения токена в заголовок Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Проверяем, что config.headers существует
    if (config.headers && token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Добавляем токен в заголовок
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обрабатываем ответы с ошибками, включая 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Ошибка 401: Неавторизован');
      localStorage.removeItem('token'); // Удаляем токен, если 401 ошибка
      window.location.href = '/login'; // Перенаправляем на страницу логина
    }
    return Promise.reject(error);
  }
);

// Интерфейсы для запросов и ответов
interface LoginCredentials {
  name: string;
  password: string;
}

interface CreatePlayerData {
  name: string;
  password: string;
}

interface CreateBattleData {
  monsterId: number;
}

interface SaveBattleLogData {
  battleLog: string[];
}

// Получить данные текущего игрока
export const getPlayerById = async (): Promise<{ player: Player }> => {
  const response = await api.get('/players/me');
  return response.data;
};

// Вход игрока с токеном в ответе
export const loginPlayer = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post('/players/login', credentials);
    // Сохраните токен в localStorage, если он присутствует в ответе
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data as LoginResponse; // Явно указываем, что это LoginResponse
  } catch (error) {
    throw error;
  }
};

// Создать нового игрока (для регистрации)
export const createPlayer = async (playerData: CreatePlayerData): Promise<{ player: Player }> => {
  const response = await api.post('/players', playerData);
  // Если сервер возвращает токен при регистрации, сохраните его
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Получить всех монстров (для экрана охоты)
export const getMonsters = async (): Promise<Monster[]> => {
  const response = await api.get('/monsters');
  return response.data;
};

// Получить активную битву
export const getActiveBattle = async (): Promise<Battle> => {
  const response = await api.get('/battles/active');
  return response.data;
};

// Создать новый бой (для начала боя)
export const createBattle = async (battleData: CreateBattleData): Promise<Battle> => {
  const response = await api.post('/battles', battleData);
  return response.data;
};

// Атака в бою
export const attack = async (battleId: number): Promise<{
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
}> => {
  const response = await api.post(`/battles/${battleId}/attack`);
  return response.data;
};

// Сохранить полный лог боя после завершения
export const saveBattleLog = async (battleId: number, battleLog: string[]): Promise<{ success: boolean }> => {
  const response = await api.post(`/battles/${battleId}/log`, { battleLog });
  return response.data;
};

// Экспортируем экземпляр axios как экспорт по умолчанию
export default api;
