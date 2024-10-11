import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Player from '../models/Player'; // Импортируем модель игрока
import dotenv from 'dotenv';
import AuthenticatedRequest from '../middleware/auth';

dotenv.config(); // Загружаем переменные среды из файла .env

// Функция для генерации JWT токена
const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

// Вход игрока
export const loginPlayer = async (req: Request, res: Response, next: NextFunction) => {
  const { name, password } = req.body;

  try {
    // Найти игрока по имени
    const player = await Player.findOne({ where: { name } });
    if (!player) {
      return res.status(400).json({ message: 'Неверное имя или пароль.' });
    }

    // Проверить пароль
    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверное имя или пароль.' });
    }

    // Генерация токена после успешной проверки
    const token = jwt.sign({ id: player.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Возвращаем токен в ответе
    res.json({ player, token });
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

// Создание нового игрока (регистрация)
export const createPlayer = async (req: Request, res: Response, next: NextFunction) => {
  const { name, password } = req.body;

  try {
    const existingPlayer = await Player.findOne({ where: { name } }); // Проверяем, существует ли игрок
    if (existingPlayer) {
      return res.status(400).json({ message: 'Игрок с таким именем уже существует.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Хешируем пароль
    const newPlayer = await Player.create({ name, password: hashedPassword }); // Создаём нового игрока

    const token = generateToken(newPlayer.id); // Генерируем токен

    // Устанавливаем токен в cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'lax',
      path: '/',
    });

    const { password: _, ...playerData } = newPlayer.toJSON(); // Убираем пароль из возвращаемых данных
    res.status(201).json({ player: playerData });
  } catch (error) {
    console.error('Ошибка при создании игрока:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

// Определяем кастомный тип для Request, где есть поле user с id
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

// Получить текущего игрока
export const getCurrentPlayer = async (req: AuthenticatedRequest, res: Response) => {
  console.log('req.player:', req.player);

  if (!req.player) {
    return res.status(401).json({ message: 'Неавторизованный запрос.' });
  }

  const { password, ...playerData } = req.player.toJSON();
  res.json({ player: playerData });
};

// Поиск игрока по ID
export const getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Извлекаем ID игрока из параметров запроса
    const player = await Player.findByPk(id); // Ищем игрока по ID

    if (!player) {
      return res.status(404).json({ message: 'Игрок не найден.' });
    }

    const { password: _, ...playerData } = player.toJSON(); // Убираем пароль из возвращаемых данных
    res.json({ player: playerData });
  } catch (error) {
    console.error('Ошибка при получении игрока:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

// Обновление данных игрока
export const updatePlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Извлекаем ID из параметров запроса
    const { name, maxHealth, currentHealth, level, experience, backpack } = req.body;

    const player = await Player.findByPk(id); // Ищем игрока по ID
    if (!player) {
      return res.status(404).json({ message: 'Игрок не найден.' });
    }

    // Обновляем данные игрока, если они присутствуют в запросе
    if (name !== undefined) player.name = name;
    if (maxHealth !== undefined) player.maxHealth = maxHealth;
    if (currentHealth !== undefined) player.currentHealth = currentHealth;
    if (level !== undefined) player.level = level;
    if (experience !== undefined) player.experience = experience;
    if (backpack !== undefined) player.backpack = backpack;

    await player.save(); // Сохраняем изменения

    const { password: _, ...playerData } = player.toJSON(); // Убираем пароль из возвращаемых данных
    res.json({ player: playerData });
  } catch (error) {
    console.error('Ошибка при обновлении игрока:', error);
    res.status(500).json({ message: 'Не удалось обновить игрока.' });
  }
};

// Удаление игрока
export const deletePlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Извлекаем ID из параметров запроса
    const player = await Player.findByPk(id); // Ищем игрока по ID
    if (!player) {
      return res.status(404).json({ message: 'Игрок не найден.' });
    }

    await player.destroy(); // Удаляем игрока
    res.json({ message: 'Игрок удалён.' });
  } catch (error) {
    console.error('Ошибка при удалении игрока:', error);
    res.status(500).json({ message: 'Не удалось удалить игрока.' });
  }
};
