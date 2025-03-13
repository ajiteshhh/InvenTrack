import express from 'express';
import productController from '../controllers/productController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import db from '../config/db.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    productController.handleAddProduct(req, res, db);
});
router.get('/', authenticateToken, (req, res) => {
    productController.handleGetAllProducts(req, res, db);
});
router.get('/:product_id', authenticateToken, (req, res) => {
    productController.handleGetProductById(req, res, db);
});
router.put('/:id', authenticateToken, (req, res) => {
    productController.handleUpdateProduct(req, res, db);
});
router.delete('/:product_id', authenticateToken, (req, res) => {
    productController.handleDeleteProduct(req, res, db);
});

export default router;
