import express from 'express';
import { 
    getAllAdventure,
    createAdventure, 
    updateAdventure, 
    deleteAdventure, 
    getAdventure, 
    enrollAdventure, 
    unenrollAdventure,
    getEnrolledAdventures,
    getInstructorAdventures,
 } from '../controllers/adventure.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const adventureRoute = express.Router();

adventureRoute.get('/all', getAllAdventure);
adventureRoute.post('/create', verifyJWT , upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]), createAdventure);


adventureRoute.post('/enroll/:id', verifyJWT , enrollAdventure);
adventureRoute.post('/unenroll/:id', verifyJWT , unenrollAdventure);

adventureRoute.get('/instructor', verifyJWT , getInstructorAdventures);
adventureRoute.get('/bookings', verifyJWT , getEnrolledAdventures);

adventureRoute.put('/:id', verifyJWT , upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]), updateAdventure);

adventureRoute.delete('/:id', verifyJWT , deleteAdventure);
adventureRoute.get('/:id', getAdventure);


export default adventureRoute;