// backend/src/routes/monsterRoutes.ts

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getAllMonsters,
  createMonster,
  getMonsterById,
  updateMonster,
  deleteMonster,
} from '../controllers/monsterController';
import auth from '../middleware/auth';

const router = Router();

// Получение всех монстров
router.get('/', auth, asyncHandler(getAllMonsters));

// Создание нового монстра
router.post('/', auth, asyncHandler(createMonster));

// Получение монстра по ID
router.get('/:monsterId', auth, asyncHandler(getMonsterById));

// Обновление монстра
router.put('/:monsterId', auth, asyncHandler(updateMonster));

// Удаление монстра
router.delete('/:monsterId', auth, asyncHandler(deleteMonster));

export default router;
