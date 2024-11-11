// backend/src/services/playerService.ts

import { Player } from '../models/Player';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class PlayerService {
  // Генерация JWT токена
  generateToken(playerId: number) {
    return jwt.sign({ id: playerId }, process.env.JWT_SECRET as string, { 
      expiresIn: '24h' // Увеличено с 1 часа до 24 часов
    });
  }

  // Вход игрока
  async loginPlayer(name: string, password: string) {
    const player = await Player.findOne({ where: { name } });
    if (!player) throw new Error('Неверное имя или пароль.');

    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) throw new Error('Неверное имя или пароль.');

    player.isOnline = true;
    await player.save();

    const token = this.generateToken(player.id);
    return { player, token };
  }

  // Создание нового игрока
  async createPlayer(name: string, password: string) {
    const existingPlayer = await Player.findOne({ where: { name } });
    if (existingPlayer) throw new Error('Игрок с таким именем уже существует.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPlayer = await Player.create({ 
      name, 
      password: hashedPassword,
      location: 'default_location' // Устанавливаем локацию по умолчанию
    });

    const token = this.generateToken(newPlayer.id);
    return { newPlayer, token };
  }

  // Получить игрока по ID
  async getPlayerById(playerId: number) {
    const player = await Player.findByPk(playerId);
    if (!player) throw new Error('Игрок не найден.');

    return player;
  }

  // Обновление данных игрока
  async updatePlayer(playerId: number, updateData: Partial<Player>) {
    const player = await Player.findByPk(playerId);
    if (!player) throw new Error('Игрок не найден.');

    // Если обновляется пароль, хешировать его
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await player.update(updateData);
    return player;
  }

  // Удаление игрока
  async deletePlayer(playerId: number) {
    const player = await Player.findByPk(playerId);
    if (!player) throw new Error('Игрок не найден.');

    await player.destroy();
    return { message: 'Игрок удалён' };
  }

  // Генерация нового JWT токена
  async getNewToken(playerId: number): Promise<string> {
    const player = await this.getPlayerById(playerId);
    if (!player) throw new Error('Игрок не найден.');

    return this.generateToken(player.id);
  }
}

export default new PlayerService();
