import express from 'express';
import { handleSignUp } from '../controllers/auth.controller.js';

const authRoute = express.Router();
authRoute.post('/signup', handleSignUp);


export default authRoute;