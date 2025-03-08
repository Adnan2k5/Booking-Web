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
    signInWithGoogleCallback
} from '../controllers/auth.controller.js';

import passport from "passport";

const authRoute = express.Router();
authRoute.post('/signUp', registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/verifyOtp', verifyOtp);
authRoute.post('/resendOtp', resendOtp);
authRoute.post('/forgotPassword', forgotPassword);
authRoute.post('/updatePassword', updatePassword);
authRoute.get('/signInWithGoogle', signInWithGoogle);
authRoute.get('/signInWithGoogleCallback', passport.authenticate("google", { session: false }) ,signInWithGoogleCallback);
authRoute.post('/signInWithApple', signInWithApple);
authRoute.post('/signInWithLinkedin', signInWithLinkedin);
authRoute.post('/signInWithFacebook', signInWithFacebook);

export default authRoute;