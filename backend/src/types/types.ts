// backend/src/types/types.ts

import { Request } from 'express';
import { Player } from '../models/Player';
import { Monster } from '../models/Monster';
import { Battle } from '../models/Battle';

// Интерфейс атрибутов игрока
export interface PlayerAttributes {
  id: number;
  name: string;
  password: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  experience: number;
  backpack: any[];
  location: string; // Добавлено поле location
  createdAt?: Date;
  updatedAt?: Date;
}

// Интерфейс атрибутов монстра
export interface MonsterAttributes {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  experience: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Интерфейс атрибутов битвы
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
  playerDamage: number;
  monsterDamage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Интерфейс для аутентифицированных запросов
export interface AuthenticatedRequest extends Request {
  player?: Player;
}
