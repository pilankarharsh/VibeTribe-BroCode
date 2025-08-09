import express from 'express';
import auth from '../middleware/auth.js';
import { getHomeFeed, getExploreFeed } from '../controllers/feedController.js';

const router = express.Router();

router.get('/home', auth, getHomeFeed);
router.get('/explore', getExploreFeed);

export default router;

/**
 * @openapi
 * /api/feed/home:
 *   get:
 *     summary: Get home feed (followed users)
 *     tags: [Feed]
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Not authenticated
 *
 * /api/feed/explore:
 *   get:
 *     summary: Get explore feed
 *     tags: [Feed]
 *     responses:
 *       200:
 *         description: OK
 */


