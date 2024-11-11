import { Socket } from 'socket.io';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import PlayerService from '../services/playerService';
import { ExtendedError } from 'socket.io/dist/namespace';

interface DecodedToken extends JwtPayload {
  id: number;
}

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(token: string): Promise<JwtPayload | string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload | string);
      }
    });
  });
}

export const authenticateSocket = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Token not provided') as ExtendedError);
  }

  verifyToken(token)
    .then(async (decoded) => {
      if (decoded) {
        let payload: DecodedToken;
        
        if (typeof decoded === 'string') {
          try {
            payload = JSON.parse(decoded) as DecodedToken;
          } catch (e) {
            throw new Error('Invalid token payload');
          }
        } else {
          payload = decoded as DecodedToken;
        }
        
        socket.data.playerId = payload.id;
        return next();
      }
      throw new Error('Token verification failed');
    })
    .catch(async (err) => {
      if (err.name === 'TokenExpiredError') {
        const originalDecoded = jwt.decode(token) as DecodedToken;
        if (originalDecoded) {
          try {
            const newToken = await PlayerService.getNewToken(originalDecoded.id);
            const newDecoded = await verifyToken(newToken);
            if (newDecoded) {
              socket.data.playerId = (typeof newDecoded === 'string' ? JSON.parse(newDecoded) : newDecoded).id;
              return next();
            }
            throw new Error('Token verification failed');
          } catch (renewalError) {
            return next(new Error('Token renewal failed') as ExtendedError);
          }
        } else {
          return next(new Error('Invalid token payload') as ExtendedError);
        }
      } else {
        return next(new Error('Token verification failed') as ExtendedError);
      }
    });
};