import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller.js';

const categoryRoute = express.Router();

categoryRoute.route('/').get(getCategories).post(createCategory).delete(deleteCategory);

export default categoryRoute;