import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import db from '../config/db.js';
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    analyticsController.handleGetRecentActivity(req, res, db);
});

export default router;