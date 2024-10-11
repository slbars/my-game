import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Player from '../models/Player'; // Модель игрока

// Интерфейс для декодированного токена
interface DecodedToken {
  id: number; // Поле id, которое должно быть числом
}

// Интерфейс для расширенного запроса, включающего игрока
interface AuthenticatedRequest extends Request {
  player?: Player;
}

// Middleware для аутентификации запросов
const auth = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // Извлечение токена из заголовка Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    if (process.env.NODE_ENV === 'development') {
      console.log('Токен извлечен из заголовка Authorization:', token);
    }
  }

  // Если токен отсутствует, возвращаем 401 ошибку
  if (!token) {
    console.log('Токен не предоставлен');
    res.status(401).json({ message: 'Не авторизован, токен не предоставлен' });
    return;
  }

  try {
    // Проверка и декодирование токена с использованием секретного ключа
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (process.env.NODE_ENV === 'development') {
      console.log('Токен декодирован:', decoded);
    }

    // Поиск игрока по id из токена
    const player = await Player.findByPk(decoded.id);
    if (!player) {
      console.log('Игрок не найден');
      res.status(401).json({ message: 'Пользователь не найден' });
      return;
    }

    // Добавляем игрока в объект запроса
    req.player = player;
    if (process.env.NODE_ENV === 'development') {
      console.log('Игрок авторизован:', player.name);
    }

    // Передаем управление следующему middleware
    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Ошибка при верификации токена:', error);
    }
    res.status(401).json({ message: 'Не авторизован, неверный токен' });
  }
});

export default auth;
