// backend/src/controllers/battleController.ts

import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { battleService } from '../index';
import { AuthenticatedRequest } from '../types/types';
import { BattleLog } from '../models/BattleLog';

/**
 * Создание новой битвы между игроком и монстром.
 */
export const createBattle = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const playerId = req.player?.id;
    const { monsterId } = req.body;

    if (!playerId || !monsterId) {
      res.status(400).json({ message: 'Не указан ID игрока или монстра' });
      return;
    }

    try {
      const battle = await battleService.createBattle(playerId, monsterId);
      res.status(201).json(battle);
    } catch (error: any) {
      console.error('Ошибка при создании битвы:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Обработка атаки игрока в битве.
 */
export const playerAttack = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { battleId } = req.params;

    if (!battleId) {
      res.status(400).json({ message: 'Не указан ID битвы' });
      return;
    }

    try {
      const battle = await battleService.playerAttackAction(Number(battleId));
      res.status(200).json(battle);
    } catch (error: any) {
      console.error('Ошибка при атаке игрока:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Обработка атаки монстра в битве.
 */
export const monsterAttack = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { battleId } = req.params;
    const { ignoreTurnCheck } = req.query;

    if (!battleId) {
      res.status(400).json({ message: 'Не указан ID битвы' });
      return;
    }

    try {
      const battle = await battleService.monsterAttack(
        Number(battleId),
        ignoreTurnCheck === 'true'
      );
      res.status(200).json(battle);
    } catch (error: any) {
      console.error('Ошибка при атаке монстра:', error);

      if (error.message === 'Сейчас не ход монстра') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    }
  }
);

/**
 * Получение информации о битве по её ID.
 */
export const getBattleById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { battleId } = req.params;

    if (!battleId) {
      res.status(400).json({ message: 'Не указан ID битвы' });
      return;
    }

    try {
      const battle = await battleService.getBattleById(Number(battleId));
      if (!battle) {
        res.status(404).json({ message: 'Битва не найдена' });
        return;
      }
      res.status(200).json(battle);
    } catch (error: any) {
      console.error('Ошибка при получении битвы по ID:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Получение активной битвы текущего игрока.
 */
export const getActiveBattleByPlayer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const playerId = req.player?.id;

    if (!playerId) {
      res.status(400).json({ message: 'Не указан ID игрока' });
      return;
    }

    try {
      const battle = await battleService.getActiveBattleByPlayerId(playerId);

      if (!battle) {
        // Возвращаем статус 200 с null, если активная битва не найдена
        res.status(200).json(null);
        return;
      }

      res.status(200).json(battle);
    } catch (error: any) {
      console.error('Ошибка при получении активной битвы:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }
);

/**
 * Получение лога битвы по ID битвы.
 */
export const getBattleLog = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { battleId } = req.params;

    if (!battleId) {
      res.status(400).json({ message: 'Не указан ID битвы' });
      return;
    }

    try {
      const battleLogs = await BattleLog.findAll({
        where: { battleId: Number(battleId) },
        order: [['createdAt', 'ASC']],
      });
      res.status(200).json(battleLogs);
    } catch (error: any) {
      console.error('Ошибка при получении лога битвы:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Удаление битвы по её ID.
 */
export const deleteBattle = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { battleId } = req.params;

    if (!battleId) {
      res.status(400).json({ message: 'Не указан ID битвы' });
      return;
    }

    try {
      const result = await battleService.deleteBattle(Number(battleId));
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Ошибка при удалении битвы:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Удаление всех завершённых битв текущего игрока.
 */
export const deleteCompletedBattles = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const playerId = req.player?.id;

    if (!playerId) {
      res.status(400).json({ message: 'Не указан ID игрока' });
      return;
    }

    try {
      const result = await battleService.deleteCompletedBattles(playerId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Ошибка при удалении завершённых битв:', error);
      res.status(500).json({ message: error.message });
    }
  }
);
