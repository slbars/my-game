// backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Ошибка:', err); // Логируем полную информацию об ошибке

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // В продакшн-среде лучше не отправлять стек ошибок
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
