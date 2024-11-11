// src/components/ProtectedRoute.tsx

import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { clearPlayer, fetchCurrentPlayer } from '../store/playerSlice';
import { clearBattle } from '../store/battleSlice';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { player, token } = useAppSelector((state) => state.player);

  useEffect(() => {
    if (!token) {
      dispatch(clearPlayer());
      dispatch(clearBattle());
    } else if (!player) {
      dispatch(fetchCurrentPlayer());
    }
  }, [token, player, dispatch]);

  // Проверяем, если путь - это "login" или "register", не перенаправляем
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  if (!token && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
