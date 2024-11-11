// backend/src/routes/battleRoutes.ts

import { Router } from 'express';
import {
  createBattle,
  playerAttack,
  monsterAttack,
  getBattleById,
  getActiveBattleByPlayer,
  getBattleLog,
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
router.get('/active/player', auth, getActiveBattleByPlayer);

// Маршрут для получения лога битвы
router.get('/:battleId/log', auth, getBattleLog);

// Удаление битвы
router.delete('/:battleId', auth, deleteBattle);

// Удаление всех завершённых битв игрока
router.delete('/completed/player', auth, deleteCompletedBattles);

export default router;
