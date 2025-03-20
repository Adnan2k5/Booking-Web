import express from 'express';
import { getAllAdventure, createAdventure, updateAdventure, deleteAdventure, getAdventure } from '../controllers/adventure.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const adventureRoute = express.Router();

adventureRoute.get('/all', getAllAdventure);
adventureRoute.post('/create', upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]) , createAdventure);

adventureRoute.put('/:id', upload.fields([
    {
        name: 'medias', maxCount: 4
    }
]), updateAdventure);

adventureRoute.delete('/:id', deleteAdventure);
adventureRoute.get('/:id', getAdventure);


export default adventureRoute;