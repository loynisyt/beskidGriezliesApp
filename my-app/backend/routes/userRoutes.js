// backend/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require("axios");

const bcrypt = require('bcrypt');
const authMiddleware = require('../authMiddleware');
const authController = require('../controllers/authController');

// Get all users (admin only)
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, first_name, last_name, role FROM users'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile/user/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const result = await pool.query(
            'SELECT id, username, first_name, last_name, role, position, height, weight, email, phone, jersey_number, two_factor_method FROM users WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});




// Create new user (admin only)
router.post('/create', authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
    try {
        const { username, password, firstName, lastName, role } = req.body;

        // Check if username already exists
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (username, password, first_name, last_name, role, two_factor_method) 
             VALUES ($1, $2, $3, $4, $5, '' ) 
             RETURNING id, username, first_name, last_name, role, two_factor_method`,
            [username, hashedPassword, firstName, lastName, role]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Password reset routes

router.post('/password-reset/request', authController.requestPasswordReset);
router.post('/password-reset/verify', authController.verifyResetToken);
router.post('/password-reset/change', authController.changePasswordWithOldPassword);
router.post('/password-reset/change-with-token', authController.changePassword);


// backend/userRoutes.js


// Delete user (admin only)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own admin account' });
        }

        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update 2FA method for current user
router.put('/2fa', authMiddleware.verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { method } = req.body; // "sms", "email", or ""
  try {
    await pool.query('UPDATE users SET two_factor_method = $1 WHERE id = $2', [method, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update 2FA method' });
  }
});

// Get current user info (for settings)
router.get('/me', authMiddleware.verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT id, username, two_factor_method FROM users WHERE id = $1', [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
});



module.exports = router;