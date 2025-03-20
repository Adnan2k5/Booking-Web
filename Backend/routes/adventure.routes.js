import express from 'express';
import { getAdventure, createAdventure, updateAdventure } from '../controllers/adventure.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const adventureRoute = express.Router();

adventureRoute.get('/all', getAdventure);
adventureRoute.post('/create', upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]) , createAdventure);

adventureRoute.post('/update/:id', upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]), updateAdventure);

export default adventureRoute;