import { Response } from 'express';
import { AuthResponse } from '../types/auth.types';

/**
 * Send success response
 */
export const sendSuccess = (
  res: Response,
  data: any = {},
  status: number = 200
): Response => {
  return res.status(status).json({
    success: true,
    ...data
  });
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  status: number = 500
): Response => {
  return res.status(status).json({
    success: false,
    message
  });
};

/**
 * Send auth response with user data
 */
export const sendAuthResponse = (
  res: Response,
  user: any,
  status: number = 200
): Response => {
  const response: AuthResponse = {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
  
  return res.status(status).json(response);
};