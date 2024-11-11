// backend/src/controllers/playerController.ts

import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import PlayerService from '../services/playerService';
import { AuthenticatedRequest } from '../types/types';
import { Player } from '../models/Player';

/**
 * Контроллер для входа игрока в систему
 * Обрабатывает POST запрос с именем и паролем
 */
export const loginPlayer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, password } = req.body;
    const { player, token } = await PlayerService.loginPlayer(name, password);
    res.json({ player, token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Контроллер для создания нового игрока (регистрация)
 * Обрабатывает POST запрос с данными нового игрока
 */
export const createPlayer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, password } = req.body;
    const { newPlayer, token } = await PlayerService.createPlayer(name, password);

    const { password: _, ...playerData } = newPlayer.toJSON();
    res.status(201).json({ player: playerData, token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Контроллер для получения данных текущего игрока
 * Использует токен авторизации для идентификации игрока
 */
export const getCurrentPlayer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.player) {
    res.status(401).json({ message: 'Неавторизованный запрос.' });
    return;
  }

  const player = await PlayerService.getPlayerById(req.player.id);

  if (!player) {
    res.status(404).json({ message: 'Игрок не найден.' });
    return;
  }

  const { password, ...playerData } = player.toJSON();
  res.json({ player: playerData });
});

/**
 * Контроллер для получения игрока по ID
 * Используется для получения данных любого игрока по его идентификатору
 */
export const getPlayerById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const player = await PlayerService.getPlayerById(Number(req.params.id));
    const { password, ...playerData } = player.toJSON();
    res.json({ player: playerData });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * Контроллер для обновления данных игрока
 * Позволяет изменять информацию об игроке
 */
export const updatePlayer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const player = await PlayerService.updatePlayer(Number(req.params.id), req.body);
    const { password, ...playerData } = player.toJSON();
    res.json({ player: playerData });
  } catch (error: any) {
    if (error.message === 'Игрок не найден.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

/**
 * Контроллер для удаления игрока
 * Полностью удаляет игрока из системы
 */
export const deletePlayer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await PlayerService.deletePlayer(Number(req.params.id));
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Игрок не найден.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

/**
 * Контроллер для получения информации об игроке по его ID
 * Возвращает публичную информацию о игроке
 */
export const getPlayerInfoById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const player = await Player.findOne({
      where: { id },
      attributes: ['id', 'name', 'level', 'createdAt', 'wins', 'loses', 'isOnline'],
    });
    if (!player) {
      res.status(404).json({ message: 'Игрок не найден.' });
      return;
    }
    console.log('Получен статус игрока:', player.isOnline);
    res.status(200).json(player);
  } catch (error) {
    console.error('Ошибка при получении информации об игроке:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

/**
 * Контроллер для получения списка игроков в текущей локации
 */
export const getPlayerList = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const player = req.player;

  if (!player) {
    res.status(401).json({ message: 'Не авторизованный запрос.' });
    return;
  }

  const playersInLocation = await Player.findAll({
    where: {
      location: player.location,
      isOnline: true,
    },
    attributes: ['id', 'name', 'level', 'isOnline'],
  });

  res.json({ players: playersInLocation });
});