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

        if (config.headers && token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Обрабатываем ответы с ошибками, включая 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Ошибка 401: Неавторизован');
            localStorage.removeItem('token');
            window.location.href = '/login';
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
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data as LoginResponse;
    } catch (error) {
        throw error;
    }
};

// Создать нового игрока (для регистрации)
export const createPlayer = async (playerData: CreatePlayerData): Promise<{ player: Player }> => {
    const response = await api.post('/players', playerData);
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
    const response = await api.get('/battles/active/player');
    return response.data;
};

// Создать новый бой (для начала боя)
export const createBattle = async (battleData: CreateBattleData): Promise<Battle> => {
    const response = await api.post('/battles', battleData);
    return response.data;
};

// Атака игрока в бою
export const playerAttack = async (battleId: number): Promise<Battle> => {
    const response = await api.post(`/battles/${battleId}/playerAttack`);
    return response.data as Battle;
};

// Атака монстра в бою
export const monsterAttack = async (battleId: number): Promise<Battle> => {
    const response = await api.post(`/battles/${battleId}/monsterAttack`);
    return response.data as Battle;
};

// Сохранить полный лог боя после завершения
export const saveBattleLog = async (battleId: number, battleLog: string[]): Promise<{ success: boolean }> => {
    const response = await api.post(`/battles/${battleId}/log`, { battleLog });
    return response.data;
};

// Экспортируем экземпляр axios как экспорт по умолчанию
export default api;
