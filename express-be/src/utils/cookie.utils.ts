import { Response } from 'express';

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  sameSite: 'lax' | 'strict' | 'none' | boolean;
}

/**
 * Set authentication cookies (access and refresh tokens)
 */
export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const accessTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: 'lax'
  };
  
  const refreshTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax'
  };
  
  res.cookie('accessToken', accessToken, accessTokenOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenOptions);
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};