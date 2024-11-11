// src/socket.ts

import { io, Socket } from 'socket.io-client';
import apiClient from './api/apiClient';
import { AppDispatch } from './store';
import { setSocketConnected } from './store/socketSlice';

let socket: Socket | null = null;

export const createSocket = (token: string, dispatch: AppDispatch): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io('http://localhost:5000', {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    dispatch(setSocketConnected(true));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    dispatch(setSocketConnected(false));
  });

  socket.on('connect_error', async (error) => {
    if (error.message === 'jwt expired') {
      const response = await apiClient.get('/players/refresh-token');
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      if (socket) {
        socket.auth = { token: newToken };
        socket.connect();
      }
    } else {
      console.error('Socket connection error:', error);
    }
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};
