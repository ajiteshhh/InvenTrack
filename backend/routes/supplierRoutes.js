import express from 'express';
import supplierController from '../controllers/supplierController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import db from '../config/db.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    supplierController.handleAddSupplier(req, res, db);
});
router.get('/', authenticateToken, (req, res) => {
    supplierController.handleGetAllSuppliers(req, res, db);
});
router.get('/:supplier_uuid', authenticateToken, (req, res) => {
    supplierController.handleGetSupplierProducts(req, res, db);
});
router.put('/:id', authenticateToken, (req, res) => {
    supplierController.handleUpdateSupplier(req, res, db);
});
router.delete('/:id', authenticateToken, (req, res) => {
    supplierController.handleDeleteSupplier(req, res, db);
});

export default router;