// backend/src/services/battleService.ts

import { Battle } from '../models/Battle';
import { Player } from '../models/Player';
import { Monster } from '../models/Monster';
import { BattleLog } from '../models/BattleLog';
import { Op } from 'sequelize';
import { Server } from 'socket.io';
import sequelize from '../models';

class BattleService {
  private io: Server;
  private battleTimers: Map<number, NodeJS.Timeout> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  private async addBattleLog(battleId: number, message: string, transaction: any) {
    let battleLog = await BattleLog.findOne({
      where: { battleId },
      transaction,
    });

    if (battleLog) {
      battleLog.message = [...battleLog.message, message];
      console.log('Updated battle log:', battleLog.message);
      await battleLog.save({ transaction });
    } else {
      battleLog = await BattleLog.create(
        {
          battleId,
          message: [message],
        },
        { transaction }
      );
      console.log('Created battle log:', battleLog.message);
    }
    return battleLog;
  }

  async initializeTimers() {
    const activeBattles = await Battle.findAll({
      where: { battleResult: null },
      include: [
        { model: Player, as: 'player' },
        { model: Monster, as: 'monster' },
      ],
    });

    const now = Date.now();

    for (const battle of activeBattles) {
      if (battle.turnEndTime) {
        const timeLeft = battle.turnEndTime.getTime() - now;
        if (timeLeft > 0) {
          this.setBattleTimer(battle.id, timeLeft);
        } else {
          await this.handleTurnTimeout(battle.id);
        }
      }
    }
  }

  async createBattle(playerId: number, monsterId: number): Promise<Battle> {
    const transaction = await sequelize.transaction();
    try {
      const player = await Player.findByPk(playerId);
      const monster = await Monster.findByPk(monsterId);

      if (!player) throw new Error('Игрок не найден');
      if (!monster) throw new Error('Монстр не найден');

      const activeBattle = await Battle.findOne({
        where: {
          playerId,
          battleResult: null,
        },
      });

      if (activeBattle) {
        throw new Error('У вас уже есть активная битва.');
      }

      const newBattle = await Battle.create(
        {
          playerId,
          monsterId,
          playerHealth: player.currentHealth,
          monsterHealth: monster.maxHealth,
          isPlayerTurn: true,
          turnEndTime: new Date(Date.now() + 20000), // 20 секунд для хода игрока
          battleResult: null,
          experienceGained: 0,
          playerTotalDamage: 0,
          monsterTotalDamage: 0,
          playerDamage: 0,
          monsterDamage: 0,
          monsterHasAttacked: false,
        },
        { transaction }
      );

      await this.addBattleLog(
        newBattle.id,
        `Битва началась между ${player.name} и ${monster.name}`,
        transaction
      );

      await transaction.commit();

      const battle = await this.getBattleById(newBattle.id);
      if (!battle) throw new Error('Не удалось загрузить созданную битву');

      this.setBattleTimer(battle.id, 20000); // Установка таймера для хода игрока

      return battle;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getBattleById(battleId: number): Promise<Battle | null> {
    return await Battle.findByPk(battleId, {
      include: [
        { model: Player, as: 'player' },
        { model: Monster, as: 'monster' },
        { model: BattleLog, as: 'battleLogs' },
      ],
    });
  }

  async getActiveBattleByPlayerId(playerId: number): Promise<Battle | null> {
    const battle = await Battle.findOne({
      where: {
        playerId,
        battleResult: null,
      },
      include: [
        { model: Player, as: 'player' },
        { model: Monster, as: 'monster' },
        { model: BattleLog, as: 'battleLogs' },
      ],
    });
    return battle;
  }

  async playerAttackAction(battleId: number): Promise<Battle> {
    const transaction = await sequelize.transaction();
    try {
      const battle = await this.getBattleById(battleId);
      if (!battle) throw new Error('Битва не найдена');

      if (!battle.isPlayerTurn) {
        throw new Error('Сейчас не ход игрока');
      }

      const damage = this.calculatePlayerDamage(battle.player);
      battle.monsterHealth = Math.max(0, battle.monsterHealth - damage);
      battle.playerTotalDamage += damage;

      await this.addBattleLog(
        battle.id,
        `Игрок ${battle.player.name} нанёс ${damage} урона монстру ${battle.monster.name}`,
        transaction
      );

      if (battle.monsterHealth <= 0) {
        battle.battleResult = 'win';
        battle.experienceGained = battle.monster.experience;
        battle.player.experience += battle.monster.experience;
        battle.player.wins += 1;
        await battle.player.save({ transaction });
        await this.addBattleLog(
          battle.id,
          `${battle.player.name} победил монстра ${battle.monster.name}!`,
          transaction
        );
        this.clearBattleTimer(battle.id);
      } else {
        battle.isPlayerTurn = false;
        battle.turnEndTime = new Date(Date.now() + 1000); // 1 секунда для хода монстра
        this.setBattleTimer(battle.id, 1000); // Установка таймера для хода монстра
      }

      await battle.save({ transaction });
      await transaction.commit();

      const updatedBattle = await this.getBattleById(battleId);
      if (!updatedBattle) throw new Error('Не удалось загрузить обновленную битву');

      this.io.to(`battle_${battleId}`).emit('battleUpdated', updatedBattle);
      return updatedBattle;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async monsterAttack(battleId: number, fromTimeout: boolean = false): Promise<Battle> {
    const transaction = await sequelize.transaction();
    try {
      const battle = await this.getBattleById(battleId);
      if (!battle) throw new Error('Битва не найдена');

      if (battle.isPlayerTurn && !fromTimeout) {
        throw new Error('Сейчас не ход монстра');
      }

      const damage = this.calculateMonsterDamage(battle.monster);
      battle.playerHealth = Math.max(0, battle.playerHealth - damage);
      battle.monsterTotalDamage += damage;

      await this.addBattleLog(
        battle.id,
        `Монстр ${battle.monster.name} нанёс ${damage} урона игроку ${battle.player.name}`,
        transaction
      );

      if (battle.playerHealth <= 0) {
        battle.battleResult = 'lose';
        battle.player.loses += 1;
        await battle.player.save({ transaction });
        await this.addBattleLog(
          battle.id,
          `Монстр ${battle.monster.name} победил игрока ${battle.player.name}!`,
          transaction
        );
        this.clearBattleTimer(battle.id);
      } else {
        battle.isPlayerTurn = true;
        battle.turnEndTime = new Date(Date.now() + 20000); // 20 секунд для хода игрока
        this.setBattleTimer(battle.id, 20000); // Установка таймера для хода игрока
      }

      await battle.save({ transaction });
      await transaction.commit();

      const updatedBattle = await this.getBattleById(battleId);
      if (!updatedBattle) throw new Error('Не удалось загрузить обновленную битву');

      this.io.to(`battle_${battleId}`).emit('battleUpdated', updatedBattle);
      return updatedBattle;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async handleTurnTimeout(battleId: number) {
    const transaction = await sequelize.transaction();
    try {
      const battle = await this.getBattleById(battleId);
      if (!battle || battle.battleResult) return;

      if (battle.isPlayerTurn) {
        await this.addBattleLog(
          battle.id,
          `${battle.player.name} пропустил свой ход!`,
          transaction
        );

        battle.isPlayerTurn = false;
        battle.turnEndTime = new Date(Date.now() + 1000); // 1 секунда для хода монстра
        await battle.save({ transaction });
      }

      await transaction.commit();

      if (!battle.isPlayerTurn) {
        this.setBattleTimer(battleId, 1000); // Установка таймера для хода монстра
        await this.monsterAttack(battleId, true);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при обработке таймаута:', error);
    }
  }

  setBattleTimer(battleId: number, delay: number) {
    if (this.battleTimers.has(battleId)) {
      clearTimeout(this.battleTimers.get(battleId)!);
    }

    const timeout = setTimeout(async () => {
      await this.handleTurnTimeout(battleId);
    }, delay);

    this.battleTimers.set(battleId, timeout);
  }

  clearBattleTimer(battleId: number) {
    if (this.battleTimers.has(battleId)) {
      clearTimeout(this.battleTimers.get(battleId)!);
      this.battleTimers.delete(battleId);
    }
  }

  private calculatePlayerDamage(player: Player): number {
    // Примерная формула расчета урона игрока
    return Math.floor(Math.random() * (16 - 8 + 1)) + 8;
  }

  private calculateMonsterDamage(monster: Monster): number {
    // Примерная формула расчета урона монстра
    return Math.floor(Math.random() * (16 - 8 + 1)) + 8;
  }

  async deleteBattle(battleId: number): Promise<{ message: string }> {
    const transaction = await sequelize.transaction();

    try {
      const battle = await Battle.findByPk(battleId, { transaction });
      if (!battle) throw new Error('Битва не найдена');

      await battle.destroy({ transaction });
      this.clearBattleTimer(battle.id);

      await transaction.commit();

      return { message: 'Битва успешно удалена' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteCompletedBattles(playerId: number): Promise<{ message: string }> {
    await Battle.destroy({
      where: {
        playerId,
        battleResult: {
          [Op.ne]: null,
        },
      },
    });

    return { message: 'Завершённые битвы успешно удалены' };
  }
}

export default BattleService;
