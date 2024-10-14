// src/routes/battleRoutes.ts

import { Router } from 'express';
import {
  createBattle,
  playerAttack,
  monsterAttack, // Добавьте импорт monsterAttack
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

// Маршрут для атаки игрока
router.post('/:battleId/playerAttack', auth, playerAttack);

// Маршрут для атаки монстра
router.post('/:battleId/monsterAttack', auth, monsterAttack);

// Маршрут для получения битвы по ID
router.get('/:battleId', auth, getBattleById);

// Маршрут для получения активной битвы игрока
router.get('/active/player', auth, getActiveBattleByPlayerId);

// Маршрут для сохранения лога битвы
router.post('/:battleId/log', auth, saveBattleLog);

// Маршрут для удаления битвы
router.delete('/:battleId', auth, deleteBattle);

// Маршрут для удаления всех завершённых битв игрока
router.delete('/completed/player', auth, deleteCompletedBattles);

export default router;
