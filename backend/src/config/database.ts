// backend/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено.');
  } catch (error) {
    console.error('Ошибка соединения с базой данных:', error);
  }
})();

export default sequelize;
