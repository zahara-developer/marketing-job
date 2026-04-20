import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  connectToUser,
  getCommunityUserProfile,
  getMyConnections
} from '../controllers/userController.js';

const router = express.Router();

router.get('/connections', protect, getMyConnections);
router.get('/:userId/community-profile', getCommunityUserProfile);
router.post('/:userId/connect', protect, connectToUser);

export default router;
