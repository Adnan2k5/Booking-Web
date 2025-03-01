import express from 'express';
import { registerUser } from '../controllers/auth.controller.js';

const authRoute = express.Router();
authRoute.post('/signUp', registerUser);


export default authRoute;