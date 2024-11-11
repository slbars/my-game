// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { sequelize, Player, ChatMessage } from './models';
import { Op } from 'sequelize';
import playerRoutes from './routes/playerRoutes';
import monsterRoutes from './routes/monsterRoutes';
import battleRoutes from './routes/battleRoutes';
import { authenticateSocket } from './middleware/authSocket';
import BattleService from './services/battleService';
import http from 'http';
import { Server, Socket } from 'socket.io';
dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, {
  cors: corsOptions,
});

const PORT = process.env.PORT || 5000;

const battleService = new BattleService(io);

app.use('/api/players', playerRoutes);
app.use('/api/monsters', monsterRoutes);
app.use('/api/battles', battleRoutes);

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Обработка ошибок
app.use(errorHandler);

// Аутентификация сокетов
io.use(authenticateSocket);

const connectedPlayers = new Map();

// Обработка подключения сокетов
io.on('connection', async (socket: Socket) => {
  const player = (socket as any).data.player as Player;

  if (player) {
    // Сохраняем подключение игрока
    connectedPlayers.set(player.id, {
      socketId: socket.id,
      location: player.location,
    });

    player.isOnline = true;
    await player.save();

    // Присоединяем к комнате локации
    socket.join(`location_${player.location}`);

    // Отправка последних сообщений за последние 10 минут
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentMessages = await ChatMessage.findAll({
      where: {
        createdAt: {
          [Op.gte]: tenMinutesAgo,
        },
      },
      order: [['createdAt', 'ASC']],
    });
    socket.emit('loadChatHistory', recentMessages);

    // Обработчик сообщения чата
    socket.on('chatMessage', async (messageContent: string) => {
      const message = await ChatMessage.create({
        playerId: player.id,
        playerName: player.name,
        content: messageContent,
        createdAt: new Date(),
      });
      io.to(`location_${player.location}`).emit('chatMessage', message);
    });

    // Обработчик запроса списка игроков
    socket.on('requestPlayerList', async () => {
      await updatePlayerListInLocation(player.location, socket);
    });

    // Обновляем список игроков в локации
    await updatePlayerListInLocation(player.location);

    // Обработка отключения сокета
    socket.on('disconnect', async () => {
      const hasOtherConnections = Array.from(io.sockets.sockets.values()).some(
        (s) => s.id !== socket.id && (s as any).data.player?.id === player.id
      );

      if (!hasOtherConnections) {
        player.isOnline = false;
        await player.save();
        connectedPlayers.delete(player.id);
      }

      await updatePlayerListInLocation(player.location);
    });
  }
});

// Функция обновления списка игроков в локации
async function updatePlayerListInLocation(location: string, socket?: Socket) {
  const playersInLocation = await Player.findAll({
    where: {
      location,
      isOnline: true,
    },
    attributes: ['id', 'name', 'level', 'isOnline'],
  });

  const playerData = playersInLocation.map((player) => ({
    id: player.id,
    name: player.name,
    level: player.level,
    isOnline: player.isOnline,
  }));

  if (socket) {
    socket.emit('updatePlayerList', playerData);
  } else {
    io.to(`location_${location}`).emit('updatePlayerList', playerData);
  }
}

// Подключение к базе данных и запуск сервера
sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение с базой данных установлено.');
  })
  .then(async () => {
    await battleService.initializeTimers();

    server.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Ошибка при подключении к базе данных:', err);
  });

export { battleService };
