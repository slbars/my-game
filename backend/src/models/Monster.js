"use strict";
// backend/models/Monster.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Monster extends sequelize_1.Model {
}
Monster.init({
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
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
    experience: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
    },
}, {
    sequelize: database_1.default,
    tableName: 'Monsters',
    freezeTableName: true,
    timestamps: true,
});
exports.default = Monster;
