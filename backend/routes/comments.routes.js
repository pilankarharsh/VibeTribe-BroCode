import express from 'express';
import auth from '../middleware/auth.js';
import { deleteComment, editComment } from '../controllers/postController.js';

const router = express.Router();

router.delete('/:commentId', auth, deleteComment);
router.patch('/:commentId', auth, editComment);

export default router;

/**
 * @openapi
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Comment not found
 *   patch:
 *     summary: Edit a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid input
 */


