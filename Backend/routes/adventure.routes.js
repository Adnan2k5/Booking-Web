import express from 'express';
import { 
    getAllAdventure,
    createAdventure, 
    updateAdventure, 
    deleteAdventure, 
    getAdventure, 
    getInstructorAdventures,
    getFilteredAdventures,
 } from '../controllers/adventure.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const adventureRoute = express.Router();

adventureRoute.get('/all', verifyJWT, getAllAdventure); // supports pagination & search
adventureRoute.post('/create', verifyJWT , upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]), createAdventure);

adventureRoute.get('/instructor', verifyJWT , getInstructorAdventures);

adventureRoute.get('/filter', getFilteredAdventures);
adventureRoute.put('/:id', verifyJWT , upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]), updateAdventure);

adventureRoute.delete('/:id', verifyJWT , deleteAdventure);
adventureRoute.get('/:id', getAdventure);

export default adventureRoute;