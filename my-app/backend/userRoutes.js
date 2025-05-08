// backend/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('./db');
const axios = require("axios");

const bcrypt = require('bcrypt');
const authMiddleware = require('./authMiddleware');

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
router.get('/profile/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const result = await pool.query(
            'SELECT id, username, first_name, last_name, role FROM users WHERE id = $1',
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


router.get("/proxy/statistics", async (req, res) => {
    try {
      const response = await axios.get("https://ligazlk.bieda.it/statistics");
      res.json(response.data); // Forward the data to the frontend
    } catch (error) {
      console.error("Error fetching data from external API:", error.message);
      res.status(500).json({ message: "Error fetching data from external API" });
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
            `INSERT INTO users (username, password, first_name, last_name, role) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, username, first_name, last_name, role`,
            [username, hashedPassword, firstName, lastName, role]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body;

        if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const result = await pool.query(
            `UPDATE users 
             SET first_name = $1, last_name = $2
             WHERE id = $3 
             RETURNING id, username, first_name, last_name, role`,
            [firstName, lastName, id]
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

module.exports = router;