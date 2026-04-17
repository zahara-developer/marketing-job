import express from 'express';
import {
  forgotPassword,
  getDashboardStats,
  getCurrentUser,
  loginUser,
  registerUser
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getCurrentUser);
router.get('/stats', protect, getDashboardStats);

export default router;
