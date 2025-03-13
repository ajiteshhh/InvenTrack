import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Middleware to authenticate and validate JWT tokens
 *
 * This middleware extracts the JWT token from cookies, verifies it,
 * and attaches the decoded user information to the request object.
 */
const authenticateToken = (req, res, next) => {
    // Extract JWT token from cookies
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    // Verify the token using the secret from environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Handle verification errors (expired, invalid signature, etc.)
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(403).json({ message: 'Invalid or Expired Token' });
        }

        // Attach decoded user data to request object for use in route handlers
        req.user = user;

        // Continue to the next middleware or route handler
        next();
    });
};

export default authenticateToken;