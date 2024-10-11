// controllers/monsterController.ts
import { Request, Response, NextFunction } from 'express';
import Monster from '../models/Monster';
import { MonsterCreationAttributes } from '../models/Monster';

// Получение всех монстров
export const getAllMonsters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const monsters = await Monster.findAll();
    res.json(monsters);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Неизвестная ошибка' });
    }
  }
};

// Создание нового монстра
export const createMonster = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, level, maxHealth, experience } = req.body;
    const newMonster: MonsterCreationAttributes = {
      name,
      level,
      maxHealth,
      currentHealth: maxHealth,
      experience,
    };
    const monster = await Monster.create(newMonster);
    res.status(201).json(monster);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Неизвестная ошибка' });
    }
  }
};

// Получение монстра по ID
export const getMonsterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { monsterId } = req.params;
    const monster = await Monster.findByPk(monsterId);
    if (!monster) {
      res.status(404).json({ message: 'Монстр не найден' });
      return;
    }
    res.json(monster);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Неизвестная ошибка' });
    }
  }
};

// Обновление монстра
export const updateMonster = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { monsterId } = req.params;
    const { name, level, maxHealth, currentHealth, experience } = req.body;
    const monster = await Monster.findByPk(monsterId);
    if (!monster) {
      res.status(404).json({ message: 'Монстр не найден' });
      return;
    }
    if (name !== undefined) monster.name = name;
    if (level !== undefined) monster.level = level;
    if (maxHealth !== undefined) monster.maxHealth = maxHealth;
    if (currentHealth !== undefined) monster.currentHealth = currentHealth;
    if (experience !== undefined) monster.experience = experience;
    await monster.save();
    res.json(monster);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Неизвестная ошибка' });
    }
  }
};

// Удаление монстра
export const deleteMonster = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { monsterId } = req.params;
    const monster = await Monster.findByPk(monsterId);
    if (!monster) {
      res.status(404).json({ message: 'Монстр не найден' });
      return;
    }
    await monster.destroy();
    res.json({ message: 'Монстр удалён' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Неизвестная ошибка' });
    }
  }
};
