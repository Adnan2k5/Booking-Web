import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUser, getUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', verifyJWT, getUser);
router.get('/', verifyJWT, getUsers);

export default router;