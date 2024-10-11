"use strict";
// src/routes/battleRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const battleController_1 = require("../controllers/battleController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
// Маршрут для создания битвы
router.post('/', auth_1.default, battleController_1.createBattle);
// Маршрут для атаки в битве
router.post('/:battleId/attack', auth_1.default, battleController_1.playerAttack);
// Маршрут для получения битвы по ID
router.get('/:battleId', auth_1.default, battleController_1.getBattleById);
// Маршрут для получения активной битвы игрока
router.get('/active', auth_1.default, battleController_1.getActiveBattleByPlayerId);
// Маршрут для сохранения лога битвы
router.post('/:battleId/log', auth_1.default, battleController_1.saveBattleLog);
// Маршрут для удаления битвы
router.delete('/:battleId', auth_1.default, battleController_1.deleteBattle);
// Маршрут для удаления всех завершённых битв игрока
router.delete('/completed', auth_1.default, battleController_1.deleteCompletedBattles);
exports.default = router;
