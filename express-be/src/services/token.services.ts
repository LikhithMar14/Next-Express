import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { TokenPayload } from '../types/auth.types';

/**
 * Generate access token for authenticated user
 */
export const generateAccessToken = (user: User): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );
};

/**
 * Generate refresh token for authenticated user
 */
export const generateRefreshToken = (userId: string): string => {
  const payload: TokenPayload = { id: userId };
  
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );
};

/**
 * Verify refresh token and return payload
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(
    token, 
    process.env.JWT_REFRESH_SECRET as string
  ) as TokenPayload;
};