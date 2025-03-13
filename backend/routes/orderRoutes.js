import express from 'express';
import orderController from '../controllers/orderController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import db from '../config/db.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    orderController.handlePlaceOrder(req, res, db);
});
router.get('/', authenticateToken, (req, res) => {
    orderController.handleGetAllOrders(req, res, db);
});
router.get('/:order_id', authenticateToken, (req, res) => {
    orderController.handleGetOrderItems(req, res, db);
});
router.put('/:id', authenticateToken, (req, res) => {
    orderController.handleUpdateOrder(req, res, db);
});

export default router;
