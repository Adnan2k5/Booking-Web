import express from 'express';
import { getAdventure } from '../controllers/adventure.controller.js';

const adventureRoute = express.Router();

adventureRoute.get('/all', getAdventure);

export default adventureRoute;