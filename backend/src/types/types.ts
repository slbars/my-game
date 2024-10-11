// backend/types/types.ts

import Player from '../models/Player';
import Monster from '../models/Monster';
import Battle from '../models/Battle';

export interface PlayerAttributes {
  id: number;
  name: string;
  password: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  experience: number;
  backpack: any[];
}

export interface MonsterAttributes {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  experience: number;
}

export interface BattleAttributes {
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
}

export interface AuthenticatedRequest extends Request {
  player?: Player;
}
