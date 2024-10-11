"use strict";
// src/controllers/battleController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTurnTimeouts = exports.deleteCompletedBattles = exports.deleteBattle = exports.saveBattleLog = exports.getActiveBattleByPlayerId = exports.getBattleById = exports.playerAttack = exports.createBattle = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Battle_1 = __importDefault(require("../models/Battle"));
const Monster_1 = __importDefault(require("../models/Monster"));
const Player_1 = __importDefault(require("../models/Player"));
const sequelize_1 = require("sequelize");
// Создание новой битвы
exports.createBattle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { monsterId } = req.body;
    if (!monsterId) {
        res.status(400);
        throw new Error('Не указан ID монстра');
    }
    const monster = yield Monster_1.default.findByPk(monsterId);
    if (!monster) {
        res.status(404);
        throw new Error('Монстр не найден');
    }
    const battle = yield Battle_1.default.create({
        playerId: req.player.id,
        monsterId,
        playerHealth: req.player.currentHealth,
        monsterHealth: monster.currentHealth,
        battleLog: [`Битва началась между игроком ${req.player.name} и монстром ${monster.name}`],
        isPlayerTurn: true,
        battleResult: null,
        turnEndTime: null,
        experienceGained: 0,
        playerTotalDamage: 0,
        monsterTotalDamage: 0,
    });
    res.status(201).json(battle);
}));
// Атака игрока
exports.playerAttack = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId } = req.params;
    const battle = yield Battle_1.default.findByPk(battleId);
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
        const player = yield Player_1.default.findByPk(battle.playerId);
        if (player) {
            player.experience += battle.experienceGained;
            yield player.save();
        }
        yield battle.save();
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
        yield battle.save();
        res.status(200).json(battle);
        return;
    }
    yield battle.save();
    res.status(200).json(battle);
}));
// Получение битвы по ID
exports.getBattleById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId } = req.params;
    const battle = yield Battle_1.default.findByPk(battleId, {
        include: [
            { model: Player_1.default, as: 'player', attributes: ['id', 'name', 'level'] },
            { model: Monster_1.default, as: 'monster', attributes: ['id', 'name', 'level'] },
        ],
    });
    if (!battle) {
        res.status(404);
        throw new Error('Битва не найдена');
    }
    res.status(200).json(battle);
}));
// Получение активной битвы по ID игрока
exports.getActiveBattleByPlayerId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerId = req.player.id;
    const battle = yield Battle_1.default.findOne({
        where: {
            playerId,
            battleResult: null,
        },
        include: [
            { model: Player_1.default, as: 'player', attributes: ['id', 'name', 'level'] },
            { model: Monster_1.default, as: 'monster', attributes: ['id', 'name', 'level'] },
        ],
    });
    if (!battle) {
        res.status(404);
        throw new Error('Активная битва не найдена');
    }
    res.status(200).json(battle);
}));
// Сохранение полного лога битвы после завершения
exports.saveBattleLog = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId } = req.params;
    const { battleLog } = req.body;
    const battle = yield Battle_1.default.findByPk(battleId);
    if (!battle) {
        res.status(404);
        throw new Error('Битва не найдена');
    }
    battle.battleLog = battleLog;
    yield battle.save();
    res.status(200).json({ success: true });
}));
// Удаление битвы
exports.deleteBattle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId } = req.params;
    const battle = yield Battle_1.default.findByPk(battleId);
    if (!battle) {
        res.status(404);
        throw new Error('Битва не найдена');
    }
    yield battle.destroy();
    res.status(200).json({ success: true });
}));
// Удаление завершённых битв
exports.deleteCompletedBattles = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerId = req.player.id;
    yield Battle_1.default.destroy({
        where: {
            playerId,
            battleResult: {
                [sequelize_1.Op.ne]: null,
            },
        },
    });
    res.status(200).json({ success: true });
}));
// Проверка тайм-аутов ходов в битвах (используется в Cron Job)
exports.checkTurnTimeouts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    // Находим битвы, у которых не завершены и чей turnEndTime прошёл
    const battles = yield Battle_1.default.findAll({
        where: {
            battleResult: null,
            turnEndTime: {
                [sequelize_1.Op.lte]: now,
            },
        },
    });
    for (const battle of battles) {
        // Завершение битвы из-за тайм-аута
        battle.battleResult = 'Тайм-аут';
        battle.turnEndTime = now;
        yield battle.save();
        // Можно добавить логику уведомления игрока через Socket.IO
    }
    res.status(200).json({ success: true, checkedBattles: battles.length });
}));
