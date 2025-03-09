import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { PassportUserResponse } from '../types/auth.types';
import { registerUser, refreshAccessToken } from '../services/auth.services';
import { generateAccessToken, generateRefreshToken } from '../services/token.services';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.utils';
import { sendSuccess, sendError, sendAuthResponse } from '../utils/response.utils';
import { prisma } from '../prisma/db/index';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const newUser = await registerUser(req.body);
    
    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = newUser.refreshToken || generateRefreshToken(newUser.id as unknown as string);
    
    // Set auth cookies
    setAuthCookies(res, accessToken, refreshToken);
    
    // Return user data
    return sendAuthResponse(res, newUser, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with email and password
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req.user as User;
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(String(user.id));
    
    // Update user with refresh token if needed
    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
      });
    }
    
    // Set auth cookies
    setAuthCookies(res, accessToken, refreshToken);
    
    // Return user data
    return sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Google OAuth callback
 */
export const googleCallback = (req: Request, res: Response): void => {
  const { user, tokens } = req.user as PassportUserResponse;
  
  // Set auth cookies
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  
  // Redirect to frontend
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

/**
 * Refresh access token
 */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    let refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return sendError(res, 'Refresh token required', 401);
    }
    
    // Generate new tokens - use proper destructuring syntax with const
    const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
    
    // Set both cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax'
    });
    
    // Also set the new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax'
    });
    
    return sendSuccess(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
export const logout = (req: Request, res: Response): any => {
  clearAuthCookies(res);
  return sendSuccess(res);
};

/**
 * Get user profile
 */
export const getProfile = (req: Request, res: Response): any => {
  return res.json(req.user);
};