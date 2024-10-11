import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Player from '../models/Player';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedSocket extends Socket {
  data: {
    player?: Player;
  };
}

const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: any) => void) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split(';')
      .find((c) => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('Токен не предоставлен');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    const player = await Player.findByPk(decoded.id);
    if (!player) {
      throw new Error('Игрок не найден');
    }

    socket.data.player = player;
    next();
  } catch (err) {
    console.error('Ошибка авторизации сокета:', err);
    next(new Error('Неверный токен'));
  }
};

export default authenticateSocket;
