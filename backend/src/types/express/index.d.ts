// backend/types/express/index.d.ts

import Player from '../../models/Player';

declare global {
  namespace Express {
    interface Request {
      player?: Player;
    }
  }
}
