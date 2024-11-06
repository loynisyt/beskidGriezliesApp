// backend/authMiddleware.js
const jwt = require('jsonwebtoken');
const pool = require('./db');

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        // Get user from database to ensure they still exist and have proper permissions
        const result = await pool.query(
            'SELECT id, username, role FROM users WHERE id = $1',
            [decoded.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        req.user = result.rows[0];
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Requires admin privileges' });
    }
    next();
};