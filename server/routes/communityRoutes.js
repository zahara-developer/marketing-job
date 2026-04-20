import express from 'express';
import {
  addCommunityComment,
  createCommunityPost,
  deleteCommunityPost,
  getCommunities,
  getCommunityDetails,
  getCommunityPosts,
  joinCommunity,
  leaveCommunity,
  updateCommunityPost,
  toggleCommunityPostLike
} from '../controllers/communityController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCommunities);
router.get('/:slug', getCommunityDetails);
router.get('/:slug/posts', getCommunityPosts);
router.post('/:slug/join', protect, joinCommunity);
router.post('/:slug/leave', protect, leaveCommunity);
router.post('/:slug/posts', protect, createCommunityPost);
router.put('/posts/:postId', protect, updateCommunityPost);
router.delete('/posts/:postId', protect, deleteCommunityPost);
router.post('/posts/:postId/comments', protect, addCommunityComment);
router.post('/posts/:postId/like', protect, toggleCommunityPostLike);

export default router;
