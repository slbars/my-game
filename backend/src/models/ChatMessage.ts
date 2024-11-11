// backend/src/models/ChatMessage.ts

import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Player } from './Player';

interface ChatMessageAttributes {
  id: number;
  playerId: number;
  playerName: string;
  content: string;
  targetPlayerId?: number; // Новое поле для приватных сообщений
  createdAt?: Date;
}

export interface ChatMessageCreationAttributes extends Partial<ChatMessageAttributes> {}

@Table({
  tableName: 'ChatMessages',
  timestamps: true,
  updatedAt: false,
})
export class ChatMessage extends Model<ChatMessageAttributes, ChatMessageCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @ForeignKey(() => Player)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public playerId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public playerName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  public content!: string;

  @ForeignKey(() => Player)
  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Приватные сообщения могут быть направлены конкретному игроку
  })
  public targetPlayerId?: number;

  @BelongsTo(() => Player, { foreignKey: 'targetPlayerId', as: 'targetPlayer' })
  public targetPlayer?: Player;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  public readonly createdAt!: Date;
}
