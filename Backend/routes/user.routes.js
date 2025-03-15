import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', verifyJWT, getUser);

export default router;