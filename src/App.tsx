// src/App.tsx

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch } from './store'; // Импортируем кастомный хук для отправки действий
import { fetchCurrentPlayer } from './store/playerSlice';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentPlayer());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
