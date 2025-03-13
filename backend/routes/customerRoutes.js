import express from 'express';
import customerController from '../controllers/customerController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import db from '../config/db.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    customerController.handleAddCustomer(req, res, db);
});
router.get('/', authenticateToken, (req, res) => {
    customerController.handleGetAllCustomers(req, res, db);
});
router.put('/:customer_id', authenticateToken, (req, res) => {
    customerController.handleUpdateCustomer(req, res, db);
});
router.delete('/:customer_id', authenticateToken, (req, res) => {
    customerController.handleDeleteCustomer(req, res, db);
});

export default router;