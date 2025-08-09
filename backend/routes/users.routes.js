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

/**
 * @openapi
 * /api/users/check-username:
 *   get:
 *     summary: Check username availability
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user's public profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/users/{userId}/followers:
 *   get:
 *     summary: List followers of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /api/users/{userId}/following:
 *   get:
 *     summary: List users the user is following
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /api/users/search:
 *   get:
 *     summary: Search users by keyword
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Query required
 */

/**
 * @openapi
 * /api/users/{userId}/posts:
 *   get:
 *     summary: List posts of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 */

export default router;


