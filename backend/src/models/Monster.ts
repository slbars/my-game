// backend/models/Monster.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface MonsterAttributes {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  experience: number;
}

export interface MonsterCreationAttributes extends Optional<MonsterAttributes, 'id' | 'currentHealth' | 'experience'> {}

class Monster extends Model<MonsterAttributes, MonsterCreationAttributes> implements MonsterAttributes {
  public id!: number;
  public name!: string;
  public level!: number;
  public maxHealth!: number;
  public currentHealth!: number;
  public experience!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Monster.init({
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
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
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
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
}, {
  sequelize,
  tableName: 'Monsters',
  freezeTableName: true,
  timestamps: true,
});

export default Monster;
