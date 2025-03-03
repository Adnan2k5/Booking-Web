import express from 'express';
import { registerUser, verifyOtp, resendOtp, loginUser, forgotPassword } from '../controllers/auth.controller.js';

const authRoute = express.Router();
authRoute.post('/signUp', registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/verifyOtp', verifyOtp);
authRoute.post('/resendOtp', resendOtp);
authRoute.post('/forgotPassword', forgotPassword);

export default authRoute;