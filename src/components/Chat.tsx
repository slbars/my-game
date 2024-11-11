import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../socket';
import { useAppSelector } from '../store';
import '../styles/Chat.css';
import ContextMenu from './ContextMenu';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: number;
  playerId: number;
  playerName: string;
  content: string;
  createdAt: Date;
  targetPlayerId?: number;
  isSystemMessage?: boolean; // Добавлено свойство
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const playerName = useAppSelector((state) => state.player.player?.name);
  const playerId = useAppSelector((state) => state.player.player?.id);
  const socketConnected = useAppSelector((state) => state.socket.connected);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    playerId: number | null;
    playerName: string | null;
  }>({ visible: false, x: 0, y: 0, playerId: null, playerName: null });

  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    console.log('Чат подключен к сокету');

    socket.on('loadChatHistory', (history: ChatMessage[]) => {
      setMessages(history);
    });

    const handleChatMessage = (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('chatMessage', handleChatMessage);

    const handleErrorMessage = (error: string) => {
      alert(`Ошибка чата: ${error}`);
    };

    socket.on('errorMessage', handleErrorMessage);

    return () => {
      socket.off('loadChatHistory');
      socket.off('chatMessage', handleChatMessage);
      socket.off('errorMessage', handleErrorMessage);
    };
  }, [socketConnected]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    const socket = getSocket();
    if (socket) {
      let content = inputMessage.trim();
      let targetPlayerId: number | undefined = undefined;

      const mentionMatch = content.match(/^@(\w+)\s/);
      if (mentionMatch) {
        const mentionedName = mentionMatch[1];
        const targetPlayer = players.find((p) => p.name === mentionedName);
        if (targetPlayer) {
          targetPlayerId = targetPlayer.id;
          content = content.replace(/^@\w+\s/, '');
        } else {
          alert('Указанный игрок не найден.');
          return;
        }
      }

      socket.emit('chatMessage', {
        content,
        targetPlayerId,
      });
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleContextMenu = (event: React.MouseEvent, playerId: number, playerName: string) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      playerId: playerId,
      playerName: playerName,
    });
  };

  const handleInfoClick = () => {
    if (contextMenu.playerId !== null) {
      navigate(`/player_info?id=${encodeURIComponent(contextMenu.playerId.toString())}`);
      setContextMenu({ ...contextMenu, visible: false, playerId: null, playerName: null });
    }
  };

  const handleMentionClick = () => {
    if (contextMenu.playerName !== null) {
      setInputMessage(`@${contextMenu.playerName} `);
      setContextMenu({ ...contextMenu, visible: false, playerId: null, playerName: null });
    }
  };

  const players = useAppSelector((state) => state.playerList.players);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.isSystemMessage ? 'system-message' : ''
            } ${
              msg.targetPlayerId === playerId || msg.playerId === playerId
                ? 'highlighted-message'
                : ''
            }`}
          >
            {msg.isSystemMessage ? (
              <span className="chat-content system-message-content">{msg.content}</span>
            ) : (
              <>
                <span className="chat-time">
                  [{new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}]
                </span>
                <span
                  className="chat-player-name"
                  onContextMenu={(e) => handleContextMenu(e, msg.playerId, msg.playerName)}
                >
                  {msg.playerName}:
                </span>
                <span className="chat-content">{msg.content}</span>
                {msg.targetPlayerId && (
                  <span className="private-indicator"> (Приватное)</span>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">
          Отправить
        </button>
      </div>
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onInfoClick={handleInfoClick}
          onMentionClick={handleMentionClick}
        />
      )}
    </div>
  );
};

export default Chat;
