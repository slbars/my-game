"use strict";
// backend/middleware/auth.ts
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Player_1 = __importDefault(require("../models/Player"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token || '';
    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const player = yield Player_1.default.findByPk(decoded.id);
        if (!player) {
            return res.status(401).json({ message: 'Игрок не найден' });
        }
        req.player = player;
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Токен недействителен' });
    }
});
exports.default = auth;
