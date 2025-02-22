import express from 'express';


import {handleSignUp} from '../Controllers/authControllers.js'

const route = express.Router();
route.post('/signup', handleSignUp);


export default route;