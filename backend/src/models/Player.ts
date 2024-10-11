// backend/models/Player.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PlayerAttributes {
  id: number;
  name: string;
  password: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  experience: number;
  backpack: any[];
}

export interface PlayerCreationAttributes extends Optional<PlayerAttributes, 'id' | 'currentHealth' | 'experience' | 'backpack' | 'maxHealth' | 'level'> {}

class Player extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
  public id!: number;
  public name!: string;
  public password!: string;
  public maxHealth!: number;
  public currentHealth!: number;
  public level!: number;
  public experience!: number;
  public backpack!: any[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Player.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
  password: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  maxHealth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
  currentHealth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  backpack: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  sequelize,
  tableName: 'Players', // Используем существующую таблицу
  freezeTableName: true,  // Не изменяем название таблицы
  timestamps: true,
});

export default Player;
