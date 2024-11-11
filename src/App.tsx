// src/App.tsx

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from './store';
import { createSocket, disconnectSocket } from './socket';
import MainLayout from './components/MainLayout';
import { useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.player.token);
  const socketConnected = useSelector((state: RootState) => state.socket.connected);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      createSocket(token, dispatch);
    }

    return () => {
      disconnectSocket();
    };
  }, [token, navigate, dispatch]);

  // Рендерим MainLayout только при наличии токена и подключения сокета
  return (
    <div className="App">
      {token && socketConnected && <MainLayout />}
    </div>
  );
};

export default App;
