// src/components/MainLayout.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PlayerInfo from './PlayerInfo';
import { useAppSelector } from '../store';
import ButtonMenu from './ButtonMenu';
import GameContent from './GameContent';
import ProtectedRoute from './ProtectedRoute';
import '../styles/MainLayout.css'; // Подключаем стили

const MainLayout: React.FC = () => {
  const player = useAppSelector((state) => state.player.player);

  if (!player) {
    return <div>Загрузка...</div>;
  }
  return (
    <div className="main-layout-container">
      {/* Заголовок игры */}
      <header className="game-header">
        <h1 className="game-title">Браузерная игра</h1>
      </header>

      {/* Основной контент */}
      <div className="main-content">
        {/* Левая панель */}
        <aside className="sidebar">
          <div className="player-info-container">
            <PlayerInfo player={player} />
          </div>
          <div className="button-menu-container">
            <ButtonMenu />
          </div>
        </aside>

        {/* Центральное окно игры */}
        <main className="game-content-container">
          <div className="game-content">
            <Routes>
              <Route
                path="/location"
                element={
                  <ProtectedRoute>
                    <GameContent view="location" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backpack"
                element={
                  <ProtectedRoute>
                    <GameContent view="backpack" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hunt"
                element={
                  <ProtectedRoute>
                    <GameContent view="hunt" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battle"
                element={
                  <ProtectedRoute>
                    <GameContent view="battle" />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/location" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

