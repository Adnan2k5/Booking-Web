import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';


import {
    getAllInstructors,
    deleteInstructor,
} from '../controllers/instructor.controller.js';

const router = express.Router();

// Middleware to verify JWT token
router.use(verifyJWT);

// Route to get all instructors
router.get('/', getAllInstructors);
router.delete('/:id', deleteInstructor);

export default router;