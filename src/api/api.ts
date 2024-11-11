// src/api/api.ts

import api from './apiClient';
import {
  Credentials,
  BattleData,
  LoginResponse,
  Player,
  Monster,
  Battle,
  BattleLogEntry,
} from '../types/types';

export const createPlayer = async (data: {
  name: string;
  password: string;
}) => {
  const response = await api.post('/players', data);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

export const loginPlayer = async (credentials: {
  name: string;
  password: string;
}) => {
  const response = await api.post('/players/login', credentials);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

export const getCurrentPlayer = async (): Promise<{ player: Player }> => {
  const response = await api.get('/players/me');
  return response.data;
};

export const getMonsters = async (): Promise<Monster[]> => {
  const response = await api.get('/monsters');
  return response.data;
};

export const createBattle = async (data: BattleData): Promise<Battle> => {
  const response = await api.post('/battles', data);
  return response.data;
};

export const getActiveBattleByPlayer = async (): Promise<Battle> => {
  const response = await api.get('/battles/active/player');
  return response.data;
};

export const playerAttack = async (battleId: number): Promise<Battle> => {
  const response = await api.post(`/battles/${battleId}/playerAttack`);
  return response.data;
};

export const monsterAttack = async (
  battleId: number,
  ignoreTurnCheck: boolean = false
): Promise<Battle> => {
  const response = await api.post(`/battles/${battleId}/monsterAttack`, null, {
    params: { ignoreTurnCheck },
  });
  return response.data;
};

// Удалена функция saveBattleLog

// Добавлена функция getBattleLog
export const getBattleLog = async (
  battleId: number
): Promise<BattleLogEntry[]> => {
  const response = await api.get(`/battles/${battleId}/log`);
  return response.data;
};

export const deleteBattle = async (battleId: number): Promise<void> => {
  await api.delete(`/battles/${battleId}`);
};

export const deleteCompletedBattles = async (): Promise<void> => {
  await api.delete('/battles/completed');
};

export const logoutPlayer = (): void => {
  localStorage.removeItem('token');
};
