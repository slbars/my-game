"use strict";
// backend/models/Battle.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Player_1 = __importDefault(require("./Player"));
const Monster_1 = __importDefault(require("./Monster"));
class Battle extends sequelize_1.Model {
}
Battle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    playerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    monsterId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    playerHealth: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
    },
    monsterHealth: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
    },
    battleLog: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    isPlayerTurn: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    battleResult: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    turnEndTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    experienceGained: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    playerTotalDamage: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    monsterTotalDamage: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.default,
    tableName: 'Battles',
    freezeTableName: true,
    timestamps: true,
});
// Ассоциации (если необходимо)
Battle.belongsTo(Player_1.default, { foreignKey: 'playerId', as: 'player' });
Battle.belongsTo(Monster_1.default, { foreignKey: 'monsterId', as: 'monster' });
Player_1.default.hasMany(Battle, { foreignKey: 'playerId', as: 'battles' });
Monster_1.default.hasMany(Battle, { foreignKey: 'monsterId', as: 'battles' });
exports.default = Battle;
