import express from "express";
const authRouter = express.Router();
import { createUser, checkUser, resetPassword } from "../controllers/userController.js";
import auth from '../middleware/auth.js';
import { generateInviteCode, listInviteCodes, revokeInviteCode } from '../controllers/inviteController.js';

authRouter.post('/register', createUser);
authRouter.post('/login', checkUser);

authRouter.post('/logout', auth, (_req, res) => res.status(204).send());
authRouter.post('/forgot-password', resetPassword);

authRouter.post('/invite-codes', auth, generateInviteCode);
authRouter.get('/invite-codes', auth, listInviteCodes);
authRouter.delete('/invite-codes/:code', auth, revokeInviteCode);

export default authRouter;