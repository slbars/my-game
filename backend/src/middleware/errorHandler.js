"use strict";
// src/middleware/errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        // stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        // Опционально: убрать стек в продакшене
    });
};
exports.errorHandler = errorHandler;
