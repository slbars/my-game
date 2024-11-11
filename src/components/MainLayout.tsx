// src/components/MainLayout.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PlayerInfo from './PlayerInfo';
import ButtonMenu from './ButtonMenu';
import GameContent from './GameContent';
import PlayerList from './PlayerList';
import Chat from './Chat';
import '../styles/MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout-container">
      <header className="game-header">
        <h1 className="game-title">Браузерная игра</h1>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="player-info-container">
            <PlayerInfo />
          </div>
          <div className="button-menu-container">
            <ButtonMenu />
          </div>
        </aside>

        <main className="game-content-container">
          <div className="game-content">
            <Routes>
              <Route path="location" element={<GameContent view="location" />} />
              <Route path="backpack" element={<GameContent view="backpack" />} />
              <Route path="hunt" element={<GameContent view="hunt" />} />
              <Route path="battle" element={<GameContent view="battle" />} />
              <Route path="*" element={<Navigate to="location" />} />
            </Routes>
          </div>
        </main>
      </div>

      <div className="bottom-panel">
        <div className="player-list-container">
          <PlayerList />
        </div>
        <div className="chat-container">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
