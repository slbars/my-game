// backend/src/models/BattleLog.ts

import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Battle } from './Battle';

@Table({ tableName: 'BattleLogs' })
export class BattleLog extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Battle)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  battleId!: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  message!: string[];

  @BelongsTo(() => Battle)
  battle!: Battle;
}
