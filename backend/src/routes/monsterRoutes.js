"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/monsterRoutes.ts
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const monsterController_1 = require("../controllers/monsterController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
// Получение всех монстров
router.get('/', auth_1.default, (0, express_async_handler_1.default)(monsterController_1.getAllMonsters));
// Создание нового монстра
router.post('/', auth_1.default, (0, express_async_handler_1.default)(monsterController_1.createMonster));
// Получение монстра по ID
router.get('/:monsterId', auth_1.default, (0, express_async_handler_1.default)(monsterController_1.getMonsterById));
// Обновление монстра
router.put('/:monsterId', auth_1.default, (0, express_async_handler_1.default)(monsterController_1.updateMonster));
// Удаление монстра
router.delete('/:monsterId', auth_1.default, (0, express_async_handler_1.default)(monsterController_1.deleteMonster));
exports.default = router;
