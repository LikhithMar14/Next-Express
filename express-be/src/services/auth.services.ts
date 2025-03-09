import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/db/index';
import { User } from '@prisma/client';
import { RegisterUserDto } from '../types/auth.types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './token.services';

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterUserDto): Promise<User> => {
  const { email, password, name } = userData;
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('User already exists') as any;
    error.statusCode = 400;
    throw error;
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });
  
  // Generate and store refresh token
  const refreshToken = generateRefreshToken(newUser.id as unknown as string);
  
  return prisma.user.update({
    where: { id: newUser.id },
    data: { refreshToken }
  });
};

/**
 * Refresh access token using refresh token
 */export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user by ID and token
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(decoded.id as string),
        refreshToken
      }
    });
    
    if (!user) {
      const error = new Error('Invalid refresh token') as any;
      error.statusCode = 403;
      throw error;
    }
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(String(user.id));
    
    // Update user with new refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });
    
    // Return both tokens
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    const err = new Error('Invalid refresh token') as any;
    err.statusCode = 401;
    throw err;
  }
};

/**
 * Get user profile by ID
 */
export const getUserById = async (userId: string | number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: parseInt(userId as string) }
  });
};