import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getItemById, discoverItems, createItem, updateItem, deleteItem, getAllItems } from '../controllers/item.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/discover', discoverItems);
router.post('/upload', verifyJWT, upload.fields([
    {
        name: 'images',
        maxCount: 5
    },
]), createItem);
router.get('/', getAllItems);

router.route('/:id')
    .get(getItemById)
    .put(verifyJWT, upload.fields([
        {
            name: 'images',
            maxCount: 5
        },
    ]), updateItem)
    .delete(verifyJWT, deleteItem);
    
export default router;


