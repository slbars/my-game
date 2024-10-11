// backend/models/Battle.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Player from './Player';
import Monster from './Monster';

export interface BattleAttributes {
  id: number;
  playerId: number;
  monsterId: number;
  playerHealth: number;
  monsterHealth: number;
  battleLog: string[];
  isPlayerTurn: boolean;
  battleResult: string | null;
  turnEndTime: Date | null;
  experienceGained: number;
  playerTotalDamage: number;
  monsterTotalDamage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BattleCreationAttributes extends Optional<BattleAttributes, 'id' | 'playerHealth' | 'monsterHealth' | 'battleLog' | 'isPlayerTurn' | 'battleResult' | 'turnEndTime' | 'experienceGained' | 'playerTotalDamage' | 'monsterTotalDamage'> {}

class Battle extends Model<BattleAttributes, BattleCreationAttributes> implements BattleAttributes {
  public id!: number;
  public playerId!: number;
  public monsterId!: number;
  public playerHealth!: number;
  public monsterHealth!: number;
  public battleLog!: string[];
  public isPlayerTurn!: boolean;
  public battleResult!: string | null;
  public turnEndTime!: Date | null;
  public experienceGained!: number;
  public playerTotalDamage!: number;
  public monsterTotalDamage!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Battle.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  monsterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  playerHealth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
  monsterHealth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
  battleLog: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  isPlayerTurn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  battleResult: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  turnEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  experienceGained: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  playerTotalDamage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  monsterTotalDamage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  tableName: 'Battles',
  freezeTableName: true,
  timestamps: true,
});

// Ассоциации (если необходимо)
Battle.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
Battle.belongsTo(Monster, { foreignKey: 'monsterId', as: 'monster' });
Player.hasMany(Battle, { foreignKey: 'playerId', as: 'battles' });
Monster.hasMany(Battle, { foreignKey: 'monsterId', as: 'battles' });

export default Battle;
