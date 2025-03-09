import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

/**
 * Extract JWT from request (from cookies or Authorization header)
 */
export const extractJwtFromRequest = (req: Request): string | null => {
  // Try to extract from cookies first
  if (req && req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }
  
  // Fallback to Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

/**
 * Middleware to authenticate requests using JWT strategy
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};

/**
 * Middleware to authenticate with Google OAuth
 */
export const authenticateGoogle = (req: Request, res: Response, next: NextFunction): void => {
  console.log("In /google")
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
};

/**
 * Middleware for Google OAuth callback
 */
export const authenticateGoogleCallback = (req: Request, res: Response, next: NextFunction): void => {
  console.log("In /google/callback")
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  })(req, res, next);
};