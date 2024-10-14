import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Player from '../models/Player';

// Переименовываем интерфейс для устранения конфликта
export interface AuthRequest extends Request {
  player?: Player;
  isTokenLogged?: boolean;
  isTokenDecoded?: boolean;
  isPlayerLogged?: boolean;
}

// Middleware для аутентификации запросов
const auth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // Извлечение токена из заголовка Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    // Логируем токен, если среда разработки и токен еще не был залогирован
    if (process.env.NODE_ENV === 'development' && !req.isTokenLogged) {
      console.log('Токен извлечен из заголовка Authorization:', token);
      req.isTokenLogged = true;
    }
  }

  // Если токен отсутствует, возвращаем ошибку 401
  if (!token) {
    console.log('Токен не предоставлен');
    res.status(401).json({ message: 'Не авторизован, токен не предоставлен' });
    return;
  }

  try {
    // Проверка и декодирование токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Логируем декодированный токен, если это среда разработки и еще не был залогирован
    if (process.env.NODE_ENV === 'development' && !req.isTokenDecoded) {
      console.log('Токен декодирован:', decoded);
      req.isTokenDecoded = true;
    }

    // Поиск игрока по ID, извлеченному из токена
    const player = await Player.findByPk((decoded as any).id);

    if (!player) {
      console.log('Игрок не найден');
      res.status(401).json({ message: 'Пользователь не найден' });
      return;
    }

    // Добавляем игрока в запрос
    req.player = player;

    // Логируем авторизованного игрока
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

