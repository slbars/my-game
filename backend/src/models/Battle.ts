// backend/src/models/Battle.ts

import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Player } from './Player';
import { Monster } from './Monster';
import { BattleLog } from './BattleLog';

export interface BattleAttributes {
  id: number;
  playerId: number;
  monsterId: number;
  playerHealth: number;
  monsterHealth: number;
  isPlayerTurn: boolean;
  battleResult: 'win' | 'lose' | null;
  turnEndTime: Date | null;
  experienceGained: number;
  playerTotalDamage: number;
  monsterTotalDamage: number;
  playerDamage: number;
  monsterDamage: number;
  monsterHasAttacked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BattleCreationAttributes
  extends Optional<
    BattleAttributes,
    | 'id'
    | 'battleResult'
    | 'turnEndTime'
    | 'experienceGained'
    | 'playerTotalDamage'
    | 'monsterTotalDamage'
    | 'playerDamage'
    | 'monsterDamage'
    | 'monsterHasAttacked'
    | 'createdAt'
    | 'updatedAt'
  > {}

@Table({ tableName: 'Battles', freezeTableName: true, timestamps: true })
export class Battle extends Model<BattleAttributes, BattleCreationAttributes> implements BattleAttributes {
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

  @ForeignKey(() => Monster)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public monsterId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 100,
  })
  public playerHealth!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 100,
  })
  public monsterHealth!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  public isPlayerTurn!: boolean;

  @Column({
    type: DataType.ENUM('win', 'lose'),
    allowNull: true,
  })
  public battleResult!: 'win' | 'lose' | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public turnEndTime!: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public experienceGained!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public playerTotalDamage!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public monsterTotalDamage!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public playerDamage!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public monsterDamage!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  public monsterHasAttacked!: boolean;

  @BelongsTo(() => Player, { as: 'player' })
  public player!: Player;

  @BelongsTo(() => Monster, { as: 'monster' })
  public monster!: Monster;

  @HasMany(() => BattleLog, { as: 'battleLogs' })
  public battleLogs!: BattleLog[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
