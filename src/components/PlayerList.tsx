// frontend/src/components/PlayerList.tsx

import React, { useEffect } from 'react';
import { getSocket } from '../socket';
import '../styles/PlayerList.css';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchPlayerList } from '../store/playerListSlice';

interface PlayerInfo {
  name: string;
  level: number;
  id: number;
}

const PlayerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { players, loading, error } = useAppSelector((state) => state.playerList);
  const socketConnected = useAppSelector((state) => state.socket.connected);

  useEffect(() => {
    dispatch(fetchPlayerList());

    const socket = getSocket();
    if (!socket) return;

    // Обновление списка игроков при изменении
    socket.on('updatePlayerList', (updatedPlayers: PlayerInfo[]) => {
      dispatch(fetchPlayerList()); // Перезагружаем список из Redux
    });

    return () => {
      socket.off('updatePlayerList');
    };
  }, [dispatch, socketConnected]);

  const handleInfoClick = (playerId: number) => {
    // Генерируем корректный URL с параметром id
    const url = `/player_info?id=${encodeURIComponent(playerId.toString())}`;
    const windowFeatures =
      'width=800,height=600,left=200,top=200,resizable=yes,scrollbars=yes,toolbar=no,menubar=no';

    // Открываем новое окно
    window.open(url, '_blank', windowFeatures);
  };

  return (
    <div className="player-list">
      <h3>Игроки в локации</h3>
      {loading && <p>Загрузка...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul>
        {players.map((player) => (
          <li key={player.id} className="player-list-item">
            <span className="player-name">
              {player.name} [{player.level}]
            </span>
            <button
              className="info-button"
              title="Информация об игроке"
              onClick={() => handleInfoClick(player.id)}
            >
              ℹ️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
