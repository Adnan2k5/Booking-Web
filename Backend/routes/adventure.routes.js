import express from 'express';
import { getAdventure } from '../controllers/adventure.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const adventureRoute = express.Router();

adventureRoute.get('/all', getAdventure);
adventureRoute.post('/create', upload.fields([
    {
        name: 'image', maxCount: 1
    }
]) ,getAdventure);

export default adventureRoute;