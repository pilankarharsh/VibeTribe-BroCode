import express from 'express';
import auth from '../middleware/auth.js';
import {
  createPost,
  getPostById,
  deletePost,
  editPost,
  likePost,
  unlikePost,
  getPostLikes,
  isPostLikedByUser,
  addComment,
  getComments
} from '../controllers/postController.js';

const router = express.Router();

router.post('/', auth, createPost);
router.get('/:postId', getPostById);
router.delete('/:postId', auth, deletePost);
router.patch('/:postId', auth, editPost);
router.post('/:postId/like', auth, likePost);
router.post('/:postId/unlike', auth, unlikePost);
router.get('/:postId/likes', getPostLikes);
router.get('/:postId/is-liked', auth, isPostLikedByUser);
router.post('/:postId/comments', auth, addComment);
router.get('/:postId/comments', getComments);

// Report a post
import { reportPost } from '../controllers/postController.js';
router.post('/:postId/report', auth, reportPost);

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *               mediaUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Not authenticated
 *
 * /api/posts/{postId}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Post not found
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Post not found
 *       401:
 *         description: Not authenticated
 *   patch:
 *     summary: Edit a post caption
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *
 * /api/posts/{postId}/report:
 *   post:
 *     summary: Report a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post reported
 *       401:
 *         description: Not authenticated
 */

/**
 * @openapi
 * /api/posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked
 *       400:
 *         description: Post already liked
 *       401:
 *         description: Not authenticated
 *
 * /api/posts/{postId}/unlike:
 *   post:
 *     summary: Unlike a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post unliked
 *       400:
 *         description: Post not liked
 *       401:
 *         description: Not authenticated
 *
 * /api/posts/{postId}/likes:
 *   get:
 *     summary: List users who liked a post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Post not found
 *
 * /api/posts/{postId}/is-liked:
 *   get:
 *     summary: Check if current user liked a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLiked:
 *                   type: boolean
 *       401:
 *         description: Not authenticated
 */

/**
 * @openapi
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Content required
 *       401:
 *         description: Not authenticated
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Post not found
 */

export default router;


