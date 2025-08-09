import express from 'express';
import auth from '../middleware/auth.js';
import { changePassword, deleteAccount } from '../controllers/accountController.js';


const router = express.Router();

router.post('/change-password', auth, changePassword);
router.delete('/', auth, deleteAccount);

export default router;

/**
 * @openapi
 * /api/account/change-password:
 *   post:
 *     summary: Change current user's password
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Incorrect old password
 *
 * /api/account:
 *   delete:
 *     summary: Delete current user's account
 *     tags: [Account]
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         description: Not authenticated
 */


