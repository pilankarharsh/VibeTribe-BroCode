import express from 'express';
import auth from '../middleware/auth.js';
import { getHomeFeed, getExploreFeed } from '../controllers/feedController.js';

const router = express.Router();

router.get('/home', auth, getHomeFeed);
router.get('/explore', getExploreFeed);

export default router;


