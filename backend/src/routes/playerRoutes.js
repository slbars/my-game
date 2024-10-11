"use strict";
// src/routes/playerRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playerController_1 = require("../controllers/playerController");
const auth_1 = __importDefault(require("../middleware/auth"));
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
// Маршрут для входа игрока
router.post('/login', (0, asyncHandler_1.asyncHandler)(playerController_1.loginPlayer));
// Маршрут для создания нового игрока (регистрация)
router.post('/', (0, asyncHandler_1.asyncHandler)(playerController_1.createPlayer));
// Маршрут для получения данных текущего игрока
router.get('/me', auth_1.default, (0, asyncHandler_1.asyncHandler)(playerController_1.getPlayerById));
// Маршрут для обновления данных игрока по ID
router.put('/:id', auth_1.default, (0, asyncHandler_1.asyncHandler)(playerController_1.updatePlayer));
// Маршрут для удаления игрока по ID
router.delete('/:id', auth_1.default, (0, asyncHandler_1.asyncHandler)(playerController_1.deletePlayer));
exports.default = router;
