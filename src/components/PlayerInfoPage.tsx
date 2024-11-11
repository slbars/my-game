// src/components/PlayerInfoPage.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // используем useSearchParams
import axios from 'axios';
import { getSocket } from '../socket';
import '../styles/PlayerInfoPage.css';

interface PlayerInfo {
  id: number;
  name: string;
  level: number;
  createdAt: string;
  wins: number;
  loses: number;
  isOnline: boolean;
}

const PlayerInfoPage: React.FC = () => {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const playerId = searchParams.get('id');

  useEffect(() => {
    if (!playerId) {
      setError("ID игрока не найден");
      setLoading(false);
      return;
    }

    const fetchPlayerInfo = async () => {
      try {
        const token = localStorage.getItem('token');  // Получаем токен
        const response = await axios.get(`http://localhost:5000/api/players/info/${playerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlayerInfo(response.data);
      } catch (error) {
        console.error('Ошибка при получении информации об игроке:', error);
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerInfo();

    const socket = getSocket();
    if (!socket) return;

    socket.on('playerStatusUpdated', (updatedPlayer: { id: number; name: string; isOnline: boolean }) => {
      if (updatedPlayer.id === Number(playerId)) {
        setPlayerInfo((prev) => prev ? { ...prev, isOnline: updatedPlayer.isOnline } : prev);
      }
    });

    return () => {
      socket.off('playerStatusUpdated');
    };
  }, [playerId]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!playerInfo) {
    return <div>Информация о персонаже не найдена</div>;
  }
    return (
      <div className="player-info-page">
        <div className="player-header">
          <h1>{playerInfo.name} [{playerInfo.level}]</h1>
        </div>
      
        <div className="player-stats-table">
          <table>
            <tbody>
              <tr>
                <td>Побед:</td>
                <td>{playerInfo.wins}</td>
              </tr>
              <tr>
                <td>Поражений:</td>
                <td>{playerInfo.loses}</td>
              </tr>
              <tr>
                <td>Дата регистрации:</td>
                <td>{formatDate(playerInfo.createdAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={`player-status ${playerInfo.isOnline ? 'online' : 'offline'}`}>
          {playerInfo.isOnline ? 'В сети' : 'Не в сети'}
        </div>
      </div>
    );
  };

export default PlayerInfoPage;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
