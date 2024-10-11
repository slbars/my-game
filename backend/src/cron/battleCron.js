"use strict";
// src/cron/battleCron.ts
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
const battleController_1 = require("../controllers/battleController");
const node_cron_1 = __importDefault(require("node-cron"));
const initializeCronJobs = (io) => {
    // Проверять тайм-ауты ходов каждые 5 минут
    node_cron_1.default.schedule('*/5 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Создаём фиктивные req и res объекты
            const req = {};
            const res = {
                status: (code) => ({
                    json: (data) => data,
                }),
            };
            const next = () => { };
            yield (0, battleController_1.checkTurnTimeouts)(req, res, next);
            console.log('Тайм-ауты ходов проверены');
        }
        catch (error) {
            console.error('Ошибка при проверке тайм-аутов ходов:', error);
        }
    }));
};
exports.default = initializeCronJobs;
