"use strict";
// backend/models/Player.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Player extends sequelize_1.Model {
}
Player.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    password: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    maxHealth: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
    },
    currentHealth: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
    },
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    experience: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    backpack: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
}, {
    sequelize: database_1.default,
    tableName: 'Players',
    freezeTableName: true,
    timestamps: true,
});
exports.default = Player;
