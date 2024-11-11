// backend/src/models/index.ts

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || '',
  dialect: 'postgres',
  username: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '',
  port: Number(process.env.DB_PORT) || 5432,
  logging: false,
});

import { Player } from './Player';
import { Monster } from './Monster';
import { Battle } from './Battle';
import { BattleLog } from './BattleLog';
import { ChatMessage } from './ChatMessage';

sequelize.addModels([Player, Monster, Battle, BattleLog, ChatMessage]);

export { sequelize, Player, Monster, Battle, BattleLog, ChatMessage };
export default sequelize;
