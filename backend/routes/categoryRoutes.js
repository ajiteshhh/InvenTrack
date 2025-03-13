import express from 'express';
import categoryController from '../controllers/categoryController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import db from '../config/db.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    categoryController.handleAddCategory(req, res, db);
});
router.get('/', authenticateToken, (req, res) => {
    categoryController.handleGetAllCategories(req, res, db);
});
router.get('/:category_id', authenticateToken, (req, res) => {
    categoryController.handleGetCategoryProducts(req, res, db);
});
router.put('/:category_id', authenticateToken, (req, res) => {
    categoryController.handleUpdateCategory(req, res, db);
});
router.delete('/:category_id', authenticateToken, (req, res) => {
    categoryController.handleDeleteCategory(req, res, db);
});

export default router;