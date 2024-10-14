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

  const player = req.player; // Получаем игрока из middleware аутентификации
  if (!player) {
    res.status(401);
    throw new Error('Игрок не авторизован');
  }

  const battle = await Battle.create({
    playerId: player.id,
    monsterId,
    playerHealth: player.currentHealth,
    monsterHealth: monster.currentHealth,
    battleLog: [`Битва началась между ${player.name} и ${monster.name}`],
    isPlayerTurn: true,
    battleResult: null,
    turnEndTime: null,
    experienceGained: 0,
    playerTotalDamage: 0,
    monsterTotalDamage: 0,
  });

  // Включаем данные о игроке и монстре в ответ
  const battleWithDetails = await Battle.findByPk(battle.id, {
    include: [
      { model: Player, as: 'player', attributes: ['id', 'name', 'level', 'currentHealth', 'maxHealth'] },
      { model: Monster, as: 'monster', attributes: ['id', 'name', 'level', 'currentHealth', 'maxHealth'] },
    ],
  });

  res.status(201).json(battleWithDetails);
});

// Атака игрока
export const playerAttack = asyncHandler(async (req: Request, res: Response) => {
  const { battleId } = req.params;

  const battle = await Battle.findByPk(battleId, {
    include: [
      { model: Player, as: 'player' },
      { model: Monster, as: 'monster' },
    ],
  });

  if (!battle) {
    res.status(404);
    throw new Error('Битва не найдена');
  }

  if (!battle.isPlayerTurn) {
    res.status(400);
    throw new Error('Сейчас ход монстра, игрок не может атаковать');
  }

  const player = battle.player;
  const monster = battle.monster;

  if (!player || !monster) {
    res.status(404);
    throw new Error('Игрок или монстр не найдены');
  }

  // Вычисляем урон игрока
  const playerDamage = Math.floor(Math.random() * 10) + 1; // От 1 до 10
  battle.monsterHealth -= playerDamage;
  battle.playerTotalDamage += playerDamage;
  battle.battleLog.push(`${player.name} нанес ${playerDamage} урона ${monster.name}`);

  // Проверка на победу
  if (battle.monsterHealth <= 0) {
    battle.battleResult = 'Победа';
    battle.experienceGained = 10;
    battle.turnEndTime = new Date();

    // Обновляем опыт игрока
    player.experience += battle.experienceGained;
    await player.save();

    await battle.save();

    const battleWithDetails = await Battle.findByPk(battle.id, {
      include: [
        { model: Player, as: 'player', attributes: ['id', 'name', 'level', 'currentHealth', 'maxHealth'] },
        { model: Monster, as: 'monster', attributes: ['id', 'name', 'level', 'currentHealth', 'maxHealth'] },
      ],
    });

    // Возвращаем данные о нанесённом уроне и статусе битвы
    res.status(200).json({
      ...battleWithDetails.toJSON(),
      playerDamage,
    });
    return;
  }

  // Переход хода к монстру
  battle.isPlayerTurn = false;
  await battle.save();

  const battleWithDetails = await Battle.findByPk(battle.id, {
    include: [
      { model: Player, as: 'player', attributes: ['id', 'name', 'level', 'currentHealth', 'maxHealth'] },
      { model: Monster, as: 'monster', attributes: ['id', 'name', 'level', 'currentHealth', 'maxHealth'] },
    ],
  });

  // Возвращаем данные о нанесённом уроне
  res.status(200).json({
    ...battleWithDetails.toJSON(),
    playerDamage,
  });
});

// Получение битвы по ID
export const getBattleById = asyncHandler(async (req: Request, res: Response) => {
  const { battleId } = req.params;

  const battle = await Battle.findByPk(battleId, {
    include: [
      { model: Player, as: 'player', attributes: ['id', 'name', 'level'] },
      { model: Monster, as: 'monster', attributes: ['id', 'name', 'level', 'maxHealth'] },
    ],
  });

  if (!battle) {
    res.status(404);
    throw new Error('Битва не найдена');
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
    console.log(`Battle ID ${battle.id} завершена из-за тайм-аута`);
  }

  res.status(200).json({ success: true, checkedBattles: battles.length });
});

