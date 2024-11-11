// src/types/types.ts

export interface LoginResponse {
  player: {
    id: string;
    name: string;
    level: number;
    experience: number;
    maxHealth: number;
    currentHealth: number;
    backpack: any[];
    location: string; // Добавлено поле location
  };
  token: string;
}

export interface Player {
  id: number;
  name: string;
  level: number;
  experience: number;
  maxHealth: number;
  currentHealth: number;
  backpack: any[];
  location: string; // Добавлено поле location
  currentExp?: number;
}

export interface Monster {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
}

export interface BattleLogEntry {
  id: number;
  battleId: number;
  messages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Battle {
  id: number;
  playerId: number;
  monsterId: number;
  playerHealth: number;
  monsterHealth: number;
  battleLogs: {
    message: string[];
  };
  isPlayerTurn: boolean;
  battleResult: string | null;
  turnEndTime: string | null;
  experienceGained: number;
  playerTotalDamage: number;
  monsterTotalDamage: number;
  player: Player;
  monster: Monster;
}

export interface BattleLog {
  id: number;
  battleId: number;
  message: string;
  createdAt: string;
}

export interface BattleState {
  currentBattle: Battle | null;
  battleLog: BattleLogEntry[];
  status: 'idle' | 'loading' | 'failed' | 'inBattle';
  error: string | null;
}

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

export interface AttackResponse {
  battleLog: string[];
  playerHealth: number;
  monsterHealth: number;
  experienceGained: number;
  battleResult: 'win' | 'lose' | null;
  playerTotalDamage: number;
  monsterTotalDamage: number;
  monster: Monster;
  playerDamage: number;
  monsterDamage: number;
}

export interface PlayerInfo {
  name: string;
  level: number;
  createdAt: string;
  wins: number;
  loses: number;
}

export interface BattleLogs {
  messages: string[];
}
