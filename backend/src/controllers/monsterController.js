"use strict";
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
exports.deleteMonster = exports.updateMonster = exports.getMonsterById = exports.createMonster = exports.getAllMonsters = void 0;
const Monster_1 = __importDefault(require("../models/Monster"));
// Получение всех монстров
const getAllMonsters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const monsters = yield Monster_1.default.findAll();
        res.json(monsters);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Неизвестная ошибка' });
        }
    }
});
exports.getAllMonsters = getAllMonsters;
// Создание нового монстра
const createMonster = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, level, maxHealth, experience } = req.body;
        const newMonster = {
            name,
            level,
            maxHealth,
            currentHealth: maxHealth,
            experience,
        };
        const monster = yield Monster_1.default.create(newMonster);
        res.status(201).json(monster);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Неизвестная ошибка' });
        }
    }
});
exports.createMonster = createMonster;
// Получение монстра по ID
const getMonsterById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monsterId } = req.params;
        const monster = yield Monster_1.default.findByPk(monsterId);
        if (!monster) {
            res.status(404).json({ message: 'Монстр не найден' });
            return;
        }
        res.json(monster);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Неизвестная ошибка' });
        }
    }
});
exports.getMonsterById = getMonsterById;
// Обновление монстра
const updateMonster = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monsterId } = req.params;
        const { name, level, maxHealth, currentHealth, experience } = req.body;
        const monster = yield Monster_1.default.findByPk(monsterId);
        if (!monster) {
            res.status(404).json({ message: 'Монстр не найден' });
            return;
        }
        if (name !== undefined)
            monster.name = name;
        if (level !== undefined)
            monster.level = level;
        if (maxHealth !== undefined)
            monster.maxHealth = maxHealth;
        if (currentHealth !== undefined)
            monster.currentHealth = currentHealth;
        if (experience !== undefined)
            monster.experience = experience;
        yield monster.save();
        res.json(monster);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Неизвестная ошибка' });
        }
    }
});
exports.updateMonster = updateMonster;
// Удаление монстра
const deleteMonster = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monsterId } = req.params;
        const monster = yield Monster_1.default.findByPk(monsterId);
        if (!monster) {
            res.status(404).json({ message: 'Монстр не найден' });
            return;
        }
        yield monster.destroy();
        res.json({ message: 'Монстр удалён' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Неизвестная ошибка' });
        }
    }
});
exports.deleteMonster = deleteMonster;
