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
    registerInstructor  
} from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

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
authRoute.post('/instructor/register', 
    upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'portfolioMedias', maxCount: 5 }, // adjust maxCount as needed
    { name: 'certificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 }
  ]), registerUser, registerInstructor);


export default authRoute;