// backend/src/types/express/index.d.ts

import { Player } from '../../models/Player';

declare global {
  namespace Express {
    interface Request {
      player?: Player;
      isTokenLogged?: boolean;   // Для логирования токенов в разработке
      isTokenDecoded?: boolean;  // Для логирования декодированных токенов
      isPlayerLogged?: boolean;  // Для логирования авторизованных игроков
    }
  }
}
