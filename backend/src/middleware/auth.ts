// src/middleware/auth.ts

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Player } from '../models/Player';
import { AuthenticatedRequest } from '../types/types';

const auth = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    if (process.env.NODE_ENV === 'development' && !req.isTokenLogged) {
      console.log('Токен извлечен из заголовка Authorization:', token);
      req.isTokenLogged = true;
    }
  }

  if (!token) {
    console.log('Токен не предоставлен');
    res.status(401).json({ message: 'Не авторизован, токен не предоставлен' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    if (process.env.NODE_ENV === 'development' && !req.isTokenDecoded) {
      console.log('Токен декодирован:', decoded);
      req.isTokenDecoded = true;
    }

    const player = await Player.findByPk(decoded.id);

    if (!player) {
      console.log('Игрок не найден');
      res.status(401).json({ message: 'Пользователь не найден' });
      return;
    }

    req.player = player;

    if (process.env.NODE_ENV === 'development' && !req.isPlayerLogged) {
      console.log('Игрок авторизован:', player.name);
      req.isPlayerLogged = true;
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Ошибка при верификации токена:', error);
    }
    res.status(401).json({ message: 'Не авторизован, неверный токен' });
  }
});

export default auth;