export interface User {
    id: number;
    email: string;
    name?: string;
    avatar?: string;
    googleId?: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    user?: User;
    message?: string;
  }
  
  export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
  }