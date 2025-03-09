import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller';
import { authenticateJWT, authenticateGoogle, authenticateGoogleCallback } from '../middleware/auth.middleware';

const router = Router();
console.log("In Auth Routes")
// Local authentication routes
router.post('/register', authController.register);
router.post('/login', passport.authenticate('local', { session: false }), authController.login);

// Token management routes
router.post('/refresh-token', authController.refresh);
router.post('/logout', authController.logout);

// Protected profile route
router.get('/profile', authenticateJWT, authController.getProfile);

// Google OAuth routes
router.get('/google', authenticateGoogle);
router.get('/google/callback', authenticateGoogleCallback, authController.googleCallback);

export default router;