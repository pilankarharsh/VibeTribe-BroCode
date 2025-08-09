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
router.post('/:postId/comments', auth, addComment);
router.get('/:postId/comments', getComments);

// Report a post
import { reportPost } from '../controllers/postController.js';
router.post('/:postId/report', auth, reportPost);

export default router;


