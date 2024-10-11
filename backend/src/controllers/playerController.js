"use strict";
// src/controllers/playerController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlayer = exports.updatePlayer = exports.createPlayer = exports.getPlayerById = exports.loginPlayer = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Player_1 = __importDefault(require("../models/Player"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Вход игрока
const loginPlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    try {
        const player = yield Player_1.default.findOne({ where: { name } });
        if (!player) {
            return res.status(400).json({ message: 'Неверное имя или пароль.' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, player.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверное имя или пароль.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: player.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'lax',
            path: '/', // Доступно на всех маршрутах
        });
        const _a = player.toJSON(), { password: _ } = _a, playerData = __rest(_a, ["password"]);
        res.json({ player: playerData });
    }
    catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
    }
});
exports.loginPlayer = loginPlayer;
// Получение информации о текущем игроке
const getPlayerById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const player = req.player;
        if (!player) {
            return res.status(401).json({ message: 'Неавторизованный запрос.' });
        }
        const _b = player.toJSON(), { password: _ } = _b, playerData = __rest(_b, ["password"]);
        res.json({ player: playerData });
    }
    catch (error) {
        console.error('Ошибка при получении игрока:', error);
        res.status(500).json({ message: 'Не удалось получить игрока.' });
    }
});
exports.getPlayerById = getPlayerById;
// Создание нового игрока (регистрация)
const createPlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    try {
        const existingPlayer = yield Player_1.default.findOne({ where: { name } });
        if (existingPlayer) {
            return res.status(400).json({ message: 'Игрок с таким именем уже существует.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newPlayer = yield Player_1.default.create({ name, password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ id: newPlayer.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'lax',
            path: '/',
        });
        const _c = newPlayer.toJSON(), { password: _ } = _c, playerData = __rest(_c, ["password"]);
        res.status(201).json({ player: playerData });
    }
    catch (error) {
        console.error('Ошибка при создании игрока:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
    }
});
exports.createPlayer = createPlayer;
// Обновление данных игрока
const updatePlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, maxHealth, currentHealth, level, experience, backpack } = req.body;
        const player = yield Player_1.default.findByPk(id);
        if (!player) {
            return res.status(404).json({ message: 'Игрок не найден.' });
        }
        if (name !== undefined)
            player.name = name;
        if (maxHealth !== undefined)
            player.maxHealth = maxHealth;
        if (currentHealth !== undefined)
            player.currentHealth = currentHealth;
        if (level !== undefined)
            player.level = level;
        if (experience !== undefined)
            player.experience = experience;
        if (backpack !== undefined)
            player.backpack = backpack;
        yield player.save();
        const _d = player.toJSON(), { password: _ } = _d, playerData = __rest(_d, ["password"]);
        res.json({ player: playerData });
    }
    catch (error) {
        console.error('Ошибка при обновлении игрока:', error);
        res.status(500).json({ message: 'Не удалось обновить игрока.' });
    }
});
exports.updatePlayer = updatePlayer;
// Удаление игрока
const deletePlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const player = yield Player_1.default.findByPk(id);
        if (!player) {
            return res.status(404).json({ message: 'Игрок не найден.' });
        }
        yield player.destroy();
        res.json({ message: 'Игрок удалён.' });
    }
    catch (error) {
        console.error('Ошибка при удалении игрока:', error);
        res.status(500).json({ message: 'Не удалось удалить игрока.' });
    }
});
exports.deletePlayer = deletePlayer;
