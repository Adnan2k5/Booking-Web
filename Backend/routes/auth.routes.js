import express from 'express';
import { 
    registerUser, 
    verifyOtp, 
    resendOtp,
    loginUser, 
    forgotPassword, 
    updatePassword,
    signInWithApple,
    signInWithFacebook,
    signInWithGoogle,
    signInWithLinkedin,
} from '../controllers/auth.controller.js';

const authRoute = express.Router();
authRoute.post('/signUp', registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/verifyOtp', verifyOtp);
authRoute.post('/resendOtp', resendOtp);
authRoute.post('/forgotPassword', forgotPassword);
authRoute.post('/updatePassword', updatePassword);
authRoute.post('/signInWithGoogle', signInWithGoogle);
authRoute.post('/signInWithApple', signInWithApple);
authRoute.post('/signInWithLinkedin', signInWithLinkedin);
authRoute.post('/signInWithFacebook', signInWithFacebook);

export default authRoute;