// backend/src/models/Player.ts

import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  Sequelize,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Battle } from './Battle';

export interface PlayerAttributes {
  id: number;
  name: string;
  password: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  experience: number;
  backpack: any[];
  wins: number;
  loses: number;
  location: string;
  isOnline: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlayerCreationAttributes
  extends Optional<
    PlayerAttributes,
    | 'id'
    | 'currentHealth'
    | 'experience'
    | 'backpack'
    | 'maxHealth'
    | 'level'
    | 'wins'
    | 'loses'
    | 'location'
    | 'isOnline'
    | 'createdAt'
    | 'updatedAt'
  > {}

@Table({ tableName: 'Players', freezeTableName: true, timestamps: true })
export class Player
  extends Model<PlayerAttributes, PlayerCreationAttributes>
  implements PlayerAttributes
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    type: DataType.STRING(128),
    allowNull: false,
    unique: true,
  })
  public name!: string;

  @Column({
    type: DataType.STRING(128),
    allowNull: false,
  })
  public password!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 100,
  })
  public maxHealth!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 100,
  })
  public currentHealth!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  public level!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public experience!: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: Sequelize.literal(`'[]'::json`),
  })
  public backpack!: any[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public wins!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  public loses!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'default_location',
  })
  public location!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  public isOnline!: boolean;
  
  @HasMany(() => Battle)
  public battles!: Battle[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
