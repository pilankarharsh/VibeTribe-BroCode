import express from 'express';
import auth from '../middleware/auth.js';
import { changePassword, deleteAccount } from '../controllers/accountController.js';


const router = express.Router();

router.post('/change-password', auth, changePassword);
router.delete('/', auth, deleteAccount);

/**
 * @openapi
 * /api/account/change-password:
 *   post:
 *     summary: Change current user's password
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Incorrect old password
 *       401:
 *         description: Not authenticated
 *
 * /api/account:
 *   delete:
 *     summary: Delete current user's account
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         description: Not authenticated
 */

export default router;