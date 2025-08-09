import express from 'express';
import auth from '../middleware/auth.js';
import { deleteComment, editComment } from '../controllers/postController.js';

const router = express.Router();

router.delete('/:commentId', auth, deleteComment);
router.patch('/:commentId', auth, editComment);

export default router;


