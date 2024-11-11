// backend/src/routes/playerRoutes.ts

import express from 'express';
import { 
  loginPlayer, 
  createPlayer, 
  getCurrentPlayer, 
  updatePlayer, 
  deletePlayer, 
  getPlayerInfoById,
  getPlayerList // Импортируем новый контроллер
} from '../controllers/playerController';
import auth from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Публичные маршруты
router.post('/login', asyncHandler(loginPlayer));
router.post('/', asyncHandler(createPlayer));

// Защищённые маршруты
router.get('/me', auth, asyncHandler(getCurrentPlayer));
router.get('/info/:id', auth, asyncHandler(getPlayerInfoById)); // Объявлен до '/:id'
router.get('/list', auth, asyncHandler(getPlayerList)); // Новый маршрут для списка игроков
router.put('/:id', auth, asyncHandler(updatePlayer));
router.delete('/:id', auth, asyncHandler(deletePlayer));

// Экспорт маршрутов
export default router;
