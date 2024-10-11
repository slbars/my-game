// src/socket.ts

import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000', {
  withCredentials: true, // Позволяет отправлять куки с запросами
  autoConnect: false,    // Отключаем автоматическое подключение
});

export default socket;
