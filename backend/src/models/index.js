"use strict";
// backend/models/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battle = exports.Monster = exports.Player = void 0;
const Player_1 = __importDefault(require("./Player"));
exports.Player = Player_1.default;
const Monster_1 = __importDefault(require("./Monster"));
exports.Monster = Monster_1.default;
const Battle_1 = __importDefault(require("./Battle"));
exports.Battle = Battle_1.default;
// Ассоциации
Player_1.default.hasMany(Battle_1.default, { foreignKey: 'playerId', as: 'battles' });
Battle_1.default.belongsTo(Player_1.default, { foreignKey: 'playerId', as: 'player' });
Monster_1.default.hasMany(Battle_1.default, { foreignKey: 'monsterId', as: 'battles' });
Battle_1.default.belongsTo(Monster_1.default, { foreignKey: 'monsterId', as: 'monster' });
