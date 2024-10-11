// src/controllers/battleController.ts

import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Battle from '../models/Battle';
import Monster from '../models/Monster';
import Player from '../models/Player';
import { Op } from 'sequelize';

// Создание новой битвы
export const createBattle = asyncHandler(async (req: Request, res: Response) => {
  const { monsterId } = req.body;

  if (!monsterId) {
    res.status(400);
    throw new Error('Не указан ID монстра');
  }

  const monster = await Monster.findByPk(monsterId);
  if (!monster) {
    res.status(404);
    throw new Error('Монстр не найден');
  }

  const battle = await Battle.create({
    playerId: req.player!.id,
    monsterId,
    playerHealth: req.player!.currentHealth,
    monsterHealth: monster.currentHealth,
    battleLog: [`Битва началась между игроком ${req.player!.name} и монстром ${monster.name}`],
    isPlayerTurn: true,
    battleResult: null,
    turnEndTime: null,
    experienceGained: 0,
    playerTotalDamage: 0,
    monsterTotalDamage: 0,
  });

  // Включаем данные о монстре в ответ
  const battleWithMonster = await Battle.findByPk(battle.id, {
    include: [{ model: Monster, as: 'monster' }],
  });

  res.status(201).json(battleWithMonster);
});

// Атака игрока
export const playerAttack = asyncHandler(async (req: Request, res: Response) => {
  const { battleId } = req.params;

  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    res.status(404);
    throw new Error('Битва не найдена');
  }

  if (battle.battleResult) {
    res.status(400);
    throw new Error('Битва уже завершена');
  }

  const playerDamage = Math.floor(Math.random() * 10) + 1;
  battle.monsterHealth -= playerDamage;
  battle.playerTotalDamage += playerDamage;
  battle.battleLog.push(`Игрок нанес ${playerDamage} урона монстру`);

  if (battle.monsterHealth <= 0) {
    battle.battleResult = 'Победа';
    battle.experienceGained = 10;
    battle.turnEndTime = new Date();

    const player = await Player.findByPk(battle.playerId);
    if (player) {
      player.experience += battle.experienceGained;
      await player.save();
    }

    await battle.save();
    res.status(200).json(battle);
    return;
  }

  const monsterDamage = Math.floor(Math.random() * 10) + 1;
  battle.playerHealth -= monsterDamage;
  battle.monsterTotalDamage += monsterDamage;
  battle.battleLog.push(`Монстр нанес ${monsterDamage} урона игроку`);

  if (battle.playerHealth <= 0) {
    battle.battleResult = 'Поражение';
    battle.turnEndTime = new Date();
    await battle.save();
    res.status(200).json(battle);
    return;
  }

  await battle.save();

  res.status(200).json(battle);
});

// Получение битвы по ID
export const getBattleById = asyncHandler(async (req: Request, res: Response) => {
  const { battleId } = req.params;

  const battle = await Battle.findByPk(battleId, {
    include: [
      { model: Player, as: 'player', attributes: ['id', 'name', 'level'] },
      { model: Monster, as: 'monster', attributes: ['id', 'name', 'level', 'maxHealth'] }, // Включаем maxHealth
    ],
  });

  if (!battle) {
    res.status(404);
    throw new Error('Битва не найдена');
  }

  res.status(200).json(battle);
});

// Получение активной битвы по ID игрока
export const getActiveBattleByPlayerId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const playerId = req.player!.id;

  const battle = await Battle.findOne({
    where: {
      playerId,
      battleResult: null, // Проверка на незавершённые битвы
    },
    include: [
      { model: Player, as: 'player', attributes: ['id', 'name', 'level'] },
      {
        model: Monster,
        as: 'monster',
        attributes: ['id', 'name', 'level', 'maxHealth', 'currentHealth'],
      },
    ],
  });

  if (!battle) {
    res.status(404).json({ message: 'Активная битва не найдена' });
    return; // Возвращаем void, завершив выполнение
  }

  res.status(200).json(battle);
});


// Сохранение полного лога битвы после завершения
export const saveBattleLog = asyncHandler(async (req: Request, res: Response) => {
  const { battleId } = req.params;
  const { battleLog } = req.body;

  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    res.status(404);
    throw new Error('Битва не найдена');
  }

  battle.battleLog = battleLog;
  await battle.save();

  res.status(200).json({ success: true });
});

// Удаление битвы
export const deleteBattle = asyncHandler(async (req: Request, res: Response) => {
  const { battleId } = req.params;

  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    res.status(404);
    throw new Error('Битва не найдена');
  }

  await battle.destroy();

  res.status(200).json({ success: true });
});

// Удаление завершённых битв
export const deleteCompletedBattles = asyncHandler(async (req: Request, res: Response) => {
  const playerId = req.player!.id;

  await Battle.destroy({
    where: {
      playerId,
      battleResult: {
        [Op.ne]: null,
      },
    },
  });

  res.status(200).json({ success: true });
});

// Проверка тайм-аутов ходов в битвах (используется в Cron Job)
export const checkTurnTimeouts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();

  // Находим битвы, у которых не завершены и чей turnEndTime прошёл
  const battles = await Battle.findAll({
    where: {
      battleResult: null,
      turnEndTime: {
        [Op.lte]: now,
      },
    },
  });

  for (const battle of battles) {
    // Завершение битвы из-за тайм-аута
    battle.battleResult = 'Тайм-аут';
    battle.turnEndTime = now;
    await battle.save();

    // Можно добавить логику уведомления игрока через Socket.IO
  }

  res.status(200).json({ success: true, checkedBattles: battles.length });
});
