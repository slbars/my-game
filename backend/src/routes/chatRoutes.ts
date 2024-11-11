// backend/src/routes/chatRoutes.ts

import { Router } from 'express';
import { getRecentChatMessages } from '../controllers/chatController';
import auth from '../middleware/auth';

const router = Router();

// Получение последних сообщений чата
router.get('/recent', auth, getRecentChatMessages);

export default router;
