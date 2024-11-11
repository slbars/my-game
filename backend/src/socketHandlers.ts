import { Server, Socket } from 'socket.io';
import { Player } from './models/Player';
import { ChatMessage } from './models/ChatMessage';
import { Op } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedSocket extends Socket {
  data: {
    player?: Player;
  };
}

const onlinePlayers = new Map<number, { socketId: string; location: string }>();

export default (io: Server) => {
  io.on('connection', async (socket: AuthenticatedSocket) => {
    const player = socket.data.player;

    if (player) {
      onlinePlayers.set(player.id, {
        socketId: socket.id,
        location: player.location,
      });

      player.isOnline = true;
      await player.save();

      socket.join(`location_${player.location}`);

      // Load last 10 minutes of chat history
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentMessages = await ChatMessage.findAll({
        where: {
          createdAt: {
            [Op.gte]: tenMinutesAgo,
          },
        },
        order: [['createdAt', 'ASC']],
      });
      socket.emit('loadChatHistory', recentMessages);

      // Chat message handler
      socket.on(
        'chatMessage',
        async (messageData: { content: string; targetPlayerId?: number }) => {
          try {
            const { content, targetPlayerId } = messageData;

            // Validate message content
            if (!content || content.trim() === '') {
              socket.emit('errorMessage', 'Message cannot be empty.');
              return;
            }

            // Create a new chat message record
            const chatMessage = await ChatMessage.create({
              playerId: player.id,
              playerName: player.name,
              content: content.trim(),
              targetPlayerId: targetPlayerId ?? undefined,
            });

            // Message to be sent
            const message = {
              id: chatMessage.id,
              playerId: chatMessage.playerId,
              playerName: chatMessage.playerName,
              content: chatMessage.content,
              createdAt: chatMessage.createdAt,
              targetPlayerId: chatMessage.targetPlayerId,
            };

            if (targetPlayerId) {
              // Private message
              const targetPlayerSocket = onlinePlayers.get(targetPlayerId);
              if (targetPlayerSocket) {
                io.to(targetPlayerSocket.socketId).emit('chatMessage', message);
                socket.emit('chatMessage', message); // Echo back to sender
              } else {
                socket.emit('errorMessage', 'Target player is not online.');
              }
            } else {
              // Broadcast message to location
              io.to(`location_${player.location}`).emit('chatMessage', message);
            }
          } catch (error) {
            console.error('Error in chatMessage handler:', error);
            socket.emit('errorMessage', 'An error occurred while sending the message.');
          }
        }
      );

      // Handle disconnection
      socket.on('disconnect', async () => {
        const hasOtherConnections = Array.from(io.sockets.sockets.values()).some(
          (s) =>
            (s as AuthenticatedSocket).id !== socket.id &&
            (s as AuthenticatedSocket).data.player?.id === player.id
        );

        if (!hasOtherConnections) {
          player.isOnline = false;
          await player.save();
          onlinePlayers.delete(player.id);
        }

        updatePlayerListInLocation(io, player.location);
      });
    }
  });
};

async function updatePlayerListInLocation(io: Server, location: string) {
  const playersInLocation = await Player.findAll({
    where: {
      location,
      isOnline: true,
    },
    attributes: ['id', 'name', 'level', 'isOnline'],
  });

  const playerData = playersInLocation.map((player) => ({
    id: player.id,
    name: player.name,
    level: player.level,
    isOnline: player.isOnline,
  }));

  io.to(`location_${location}`).emit('updatePlayerList', playerData);
}
