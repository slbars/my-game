"use strict";
// src/middleware/authSocket.ts
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
const authenticateSocket = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_b = (_a = socket.handshake.headers.cookie) === null || _a === void 0 ? void 0 : _a.split(';').find((c) => c.trim().startsWith('token='))) === null || _b === void 0 ? void 0 : _b.split('=')[1];
        if (!token) {
            throw new Error('Токен не предоставлен');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const player = yield Player_1.default.findByPk(decoded.id);
        if (!player) {
            throw new Error('Игрок не найден');
        }
        socket.data.player = player;
        next();
    }
    catch (err) {
        next(new Error('Неверный токен'));
    }
});
exports.default = authenticateSocket;
