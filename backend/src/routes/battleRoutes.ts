// src/routes/battleRoutes.ts

import { Router } from 'express';
import {
  createBattle,
  playerAttack,
  getBattleById,
  getActiveBattleByPlayerId,
  saveBattleLog,
  deleteBattle,
  deleteCompletedBattles,
} from '../controllers/battleController';
import auth from '../middleware/auth';

const router = Router();

// Маршрут для создания битвы
router.post('/', auth, createBattle);

// Маршрут для атаки в битве
router.post('/:battleId/attack', auth, playerAttack);

// Маршрут для получения битвы по ID
router.get('/:battleId', auth, getBattleById);

// Маршрут для получения активной битвы игрока
router.get('/active', auth, getActiveBattleByPlayerId); // Заменили protect на auth

// Маршрут для сохранения лога битвы
router.post('/:battleId/log', auth, saveBattleLog);

// Маршрут для удаления битвы
router.delete('/:battleId', auth, deleteBattle);

// Маршрут для удаления всех завершённых битв игрока
router.delete('/completed', auth, deleteCompletedBattles);

export default router;
