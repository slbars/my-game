// backend/models/index.ts

import Player from './Player';
import Monster from './Monster';
import Battle from './Battle';

// Ассоциации
Player.hasMany(Battle, { foreignKey: 'playerId', as: 'battles' });
Battle.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });

Monster.hasMany(Battle, { foreignKey: 'monsterId', as: 'battles' });
Battle.belongsTo(Monster, { foreignKey: 'monsterId', as: 'monster' });

export { Player, Monster, Battle };
