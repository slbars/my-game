import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchCurrentPlayer } from '../store/playerSlice';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { player, loading } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  // Проверка на наличие токена в localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Если токен есть, но игрок не загружен, пытаемся загрузить его
    if (token && !player) {
      dispatch(fetchCurrentPlayer());
    }
  }, [token, player, dispatch]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если игрока нет и токен не найден, перенаправляем на страницу логина
  if (!player && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
