// src/types/types.ts

export interface LoginResponse {
  player: {
    id: string; // Если бэкенд возвращает строку, измените на string
    name: string;
    level: number;
    experience: number;
    maxHealth: number;
    currentHealth: number;
    backpack: any[];
  };
  token: string;
}

// Интерфейс игрока
export interface Player {
  id: number; // Измените на number, если ожидается числовое значение
  name: string;
  level: number;
  experience: number;
  maxHealth: number;
  currentHealth: number;
  backpack: any[]; // Можете задать более точный тип для элементов рюкзака
}

// Интерфейс монстра
export interface Monster {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
}

export interface Battle {
  id: number;
  playerId: number;
  monsterId: number;
  playerHealth: number;
  monsterHealth: number;
  battleLog: string[];
  isPlayerTurn: boolean;
  battleResult: string | null;
  turnEndTime: Date | null;
  experienceGained: number;
  playerTotalDamage: number;
  monsterTotalDamage: number;
  createdAt?: Date;
  updatedAt?: Date;

  monster: Monster;
}

// Дополнительные типы для API
export interface Credentials {
  name: string;
  password: string;
}

export interface BattleData {
  monsterId: number;
}

export interface BattleLogData {
  battleId: number;
  battleLog: string[];
}
