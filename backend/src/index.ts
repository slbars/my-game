// src/index.ts (сервер)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import database from './config/database';
import playerRoutes from './routes/playerRoutes';
import monsterRoutes from './routes/monsterRoutes';
import battleRoutes from './routes/battleRoutes';
import authenticateSocket from './middleware/authSocket';
import initializeCronJobs from './cron/battleCron';
import http from 'http';
import { Server } from 'socket.io';
import { playerAttack } from './controllers/battleController';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS с поддержкой заголовков Authorization
const corsOptions = {
  origin: 'http://localhost:3000', // Замените на URL вашего фронтенда
  credentials: true, // Разрешает отправку куков (если используете)
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
};

app.use(cors(corsOptions));
app.use(express.json());

// Другие middleware
app.use('/api/battles', battleRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/monsters', monsterRoutes);

// Маршрут для несуществующих путей
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Обработка ошибок
app.use(errorHandler);

// Создание HTTP сервера и настройка Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

// Аутентификация сокетов
io.use(authenticateSocket);

// Обработка событий подключения через сокеты
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.data.player?.name || 'Unknown'}`);

  // Обработка события атаки
  socket.on('attack', async (battleId: number) => {
    try {
      const battle = await playerAttack(
        { params: { battleId }, body: {} } as any,
        { json: (data: any) => data } as any,
        () => {} // Передаём пустую функцию для 'next'
      );
      io.to(`battle_${battleId}`).emit('battleUpdate', battle);
    } catch (error) {
      console.error('Ошибка при атаке:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.data.player?.name || 'Unknown'}`);
  });
});

// Инициализация Cron Jobs
initializeCronJobs(io);

// Подключение к базе данных и запуск сервера
database
  .sync()
  .then(() => {
    console.log('Database connected successfully.');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Error connecting to the database:', err);
  });
