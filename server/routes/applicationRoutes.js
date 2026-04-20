import express from 'express';
import {
  createApplication,
  getApplications,
  getMyApplications
} from '../controllers/applicationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getApplications);
router.get('/mine', protect, getMyApplications);
router.post('/', createApplication);

export default router;
