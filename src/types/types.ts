// src/types/types.ts

export interface LoginResponse {
  player: {
    id: string; // Если бэкенд возвращает строку, оставьте string
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
  id: number; // Числовой ID
  name: string;
  level: number;
  experience: number;
  maxHealth: number;
  currentHealth: number;
  backpack: any[]; // Можно уточнить тип элементов
}

// Интерфейс монстра
export interface Monster {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
}

// src/types/types.ts

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

  player: Player; // Добавляем свойство player
  monster: Monster;

  playerDamage?: number; // Добавлено
  monsterDamage?: number; // Добавлено
}

// Интерфейс состояния битвы
export interface BattleState {
  currentBattle: Battle | null;
  battleLog: string[];
  status: 'idle' | 'loading' | 'failed' | 'inBattle';
  error: string | null;
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

// Интерфейс ответа на атаку
export interface AttackResponse {
  battleLog: string[];
  playerHealth: number;
  monsterHealth: number;
  experienceGained: number;
  battleResult: string | null;
  playerTotalDamage: number;
  monsterTotalDamage: number;
  monster: Monster;
}
