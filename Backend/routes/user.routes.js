import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUser, getUsers, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', verifyJWT, getUser);
router.get('/', verifyJWT, getUsers);
router.delete('/:id', verifyJWT, deleteUser);

export default router;