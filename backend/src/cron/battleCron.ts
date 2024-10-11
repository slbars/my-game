// src/cron/battleCron.ts

import { checkTurnTimeouts } from '../controllers/battleController';
import { Server } from 'socket.io';
import cron from 'node-cron';

const initializeCronJobs = (io: Server) => {
  // Проверять тайм-ауты ходов каждые 5 минут
  cron.schedule('*/5 * * * *', async () => {
    try {
      // Создаём фиктивные req, res и next объекты
      const req = {} as any;
      const res = {
        status: (code: number) => ({
          json: (data: any) => data,
        }),
      } as any;
      const next = () => {};

      await checkTurnTimeouts(req, res, next);

      console.log('Тайм-ауты ходов проверены');
    } catch (error) {
      console.error('Ошибка при проверке тайм-аутов ходов:', error);
    }
  });
};

export default initializeCronJobs;
