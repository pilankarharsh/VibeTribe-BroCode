import express from 'express';
import auth from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getUserPosts,
  checkUsernameExists
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/check-username', checkUsernameExists);
router.get('/:userId', getUserProfile);
router.patch('/:userId', auth, updateUserProfile);
router.post('/:userId/follow', auth, followUser);
router.post('/:userId/unfollow', auth, unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/posts', getUserPosts);

export default router;


