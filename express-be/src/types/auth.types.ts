import { User } from '@prisma/client';

export interface TokenPayload {
  id: string | number;
  email?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PassportUserResponse {
  user: User;
  tokens: TokenResponse;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Partial<User>;
  message?: string;
}