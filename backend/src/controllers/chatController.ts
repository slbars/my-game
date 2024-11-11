// backend/src/controllers/chatController.ts

import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ChatMessage } from '../models/ChatMessage';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../types/types';

/**
 * Получение сообщений чата за последние 10 минут
 */
export const getRecentChatMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 10 минут назад

  const messages = await ChatMessage.findAll({
    where: {
      createdAt: {
        [Op.gte]: tenMinutesAgo,
      },
    },
    order: [['createdAt', 'ASC']],
    limit: 100, // Опционально: ограничение количества сообщений
  });

  res.json(messages);
});
