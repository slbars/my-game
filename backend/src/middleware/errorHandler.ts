// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    // Опционально: убрать стек в продакшене
  });
};
