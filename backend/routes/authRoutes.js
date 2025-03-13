import express from 'express';
import authController from '../controllers/authController.js';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';
import authenticateToken from '../middleware/authenticateToken.js';
import {upload} from "../config/cloudinary.js";

const saltRounds = Math.floor(Math.random() * 10);
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

router.post('/register', (req, res) => {
    authController.handleRegister(req, res, db, bcrypt, saltRounds, jwt, jwtSecret);
});
router.post('/send-otp', (req, res) => {
    authController.handleSendOtp(req, res, db, speakeasy, transporter, jwt, jwtSecret)
});
router.post('/verify-otp', (req, res) => {
    authController.handleVerifyOtp(req, res, db, speakeasy, jwt, jwtSecret)
});
router.post('/signin', (req, res) => {
    authController.handleSignIn(req, res, db, bcrypt, jwt, jwtSecret);
});
router.put('/update/user/password', (req, res) => {
    authController.handleUpdatePassword(req, res, db, bcrypt, saltRounds, jwt, jwtSecret);
});
router.put('/update/user/profile', authenticateToken, (req, res) => {
    authController.handleUpdateUser(req, res, db, jwt, jwtSecret);
});
router.post('/update/user/profile/picture', authenticateToken, upload.single('image'), async (req, res) => {
    authController.handleUpdateProfilePicture(req, res, db, jwt, jwtSecret);
});
router.post('/update/user/business/logo', authenticateToken, upload.single('image'), async (req, res) => {
    authController.handleUpdateBusinessLogo(req, res, db, jwt, jwtSecret);
});
router.post('/signout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully!' });
});
router.get('/check', (req, res) => {
    const token = req.cookies['jwt'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authentication failed' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        res.json({ user });
    });
});
router.post('/user', (req, res) => {
    authController.handleGenerateToken(req, res, db, jwt, jwtSecret);
});

export default router;
