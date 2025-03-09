import { Router } from 'express';
import authRoutes from './auth.routes';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
console.log("In index Routes")

// Auth routes
router.use('/auth', authRoutes);

// Protected route example
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

export default router;