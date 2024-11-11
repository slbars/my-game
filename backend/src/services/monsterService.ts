// backend/src/services/monsterService.ts

import { Monster, MonsterCreationAttributes } from '../models/Monster';

class MonsterService {
  // Получение всех монстров
  async getAllMonsters() {
    return await Monster.findAll();
  }

  // Создание нового монстра
  async createMonster(monsterData: MonsterCreationAttributes) {
    const newMonster = await Monster.create({
      ...monsterData,
      currentHealth: monsterData.maxHealth, // Устанавливаем текущее здоровье равным максимальному
    });
    return newMonster;
  }

  // Получение монстра по ID
  async getMonsterById(id: number) {
    const monster = await Monster.findByPk(id);
    if (!monster) {
      throw new Error('Монстр не найден');
    }
    return monster;
  }

  // Обновление данных монстра
  async updateMonster(id: number, updateData: Partial<MonsterCreationAttributes>) {
    const monster = await this.getMonsterById(id);
    await monster.update(updateData);
    return monster;
  }

  // Удаление монстра
  async deleteMonster(id: number) {
    const monster = await this.getMonsterById(id);
    await monster.destroy();
    return { message: 'Монстр успешно удалён' };
  }
}

export default new MonsterService();
