import express from 'express';
import {
  forgotPassword,
  getDashboardStats,
  getCurrentUser,
  loginUser,
  registerUser,
  updateProfile,
  updateResume
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { handleResumeUpload } from '../middleware/resumeUploadMiddleware.js';

const router = express.Router();

router.post('/register', handleResumeUpload, registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getCurrentUser);
router.get('/stats', protect, getDashboardStats);
router.patch('/profile', protect, updateProfile);
router.patch('/resume', protect, handleResumeUpload, updateResume);

export default router;
