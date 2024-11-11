// src/models/Monster.ts

import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Battle } from './Battle';

export interface MonsterAttributes {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  experience: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MonsterCreationAttributes
  extends Optional<
    MonsterAttributes,
    'id' | 'currentHealth' | 'createdAt' | 'updatedAt'
  > {}

@Table({
  tableName: 'Monsters',
  freezeTableName: true,
  timestamps: true,
})
export class Monster
  extends Model<MonsterAttributes, MonsterCreationAttributes>
  implements MonsterAttributes
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
  })
  public name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  public level!: number;

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
    defaultValue: 10,
  })
  public experience!: number;

  @HasMany(() => Battle)
  public battles!: Battle[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
