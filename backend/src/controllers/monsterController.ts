// src/controllers/monsterController.ts

import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import MonsterService from '../services/monsterService';

// Получение всех монстров
export const getAllMonsters = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const monsters = await MonsterService.getAllMonsters();
    res.json(monsters);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Создание нового монстра
export const createMonster = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, level, maxHealth, experience } = req.body;
    const newMonster = await MonsterService.createMonster({ name, level, maxHealth, experience });
    res.status(201).json(newMonster);
  } catch (error: any) {
    if (error.message === 'Монстр не найден') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Получение монстра по ID
export const getMonsterById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { monsterId } = req.params;
    const monster = await MonsterService.getMonsterById(Number(monsterId));
    res.json(monster);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

// Обновление монстра
export const updateMonster = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { monsterId } = req.params;
    const updateData = req.body;
    const updatedMonster = await MonsterService.updateMonster(Number(monsterId), updateData);
    res.json(updatedMonster);
  } catch (error: any) {
    if (error.message === 'Монстр не найден') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Удаление монстра
export const deleteMonster = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { monsterId } = req.params;
    const result = await MonsterService.deleteMonster(Number(monsterId));
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Монстр не найден') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});
