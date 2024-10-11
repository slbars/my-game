import express from 'express';
import { loginPlayer, createPlayer, getCurrentPlayer, updatePlayer, deletePlayer } from '../controllers/playerController'; // Добавлен import getCurrentPlayer
import auth from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Маршрут для входа игрока
router.post('/login', asyncHandler(loginPlayer));

// Маршрут для создания нового игрока (регистрация)
router.post('/', asyncHandler(createPlayer));

// Маршрут для получения текущего игрока
router.get('/me', auth, asyncHandler(getCurrentPlayer));

// Маршрут для обновления данных игрока по ID
router.put('/:id', auth, asyncHandler(updatePlayer));

// Маршрут для удаления игрока по ID
router.delete('/:id', auth, asyncHandler(deletePlayer));

export default router;
