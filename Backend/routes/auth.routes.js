import express from 'express';
import { registerUser, verifyOtp } from '../controllers/auth.controller.js';

const authRoute = express.Router();
authRoute.post('/signUp', registerUser);
authRoute.post('/verifyOtp', verifyOtp);


export default authRoute;