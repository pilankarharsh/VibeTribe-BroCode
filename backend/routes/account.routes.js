import express from 'express';
import auth from '../middleware/auth.js';
import { changePassword, deleteAccount } from '../controllers/accountController.js';

const router = express.Router();

router.post('/change-password', auth, changePassword);
router.delete('/', auth, deleteAccount);

export default router;


