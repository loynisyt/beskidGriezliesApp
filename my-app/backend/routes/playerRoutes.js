const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a database connection setup

// Endpoint: Get all players data


router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // Adjust the query based on your database schema
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching players data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint: Get player data by ID
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Player not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint: Update player profile

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, position, height, weight, email, phone, jersey_number, two_factor_method } = req.body;
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, position = $3, height = $4, weight = $5, email = $6, phone = $7, jersey_number = $8, username = $9, role = $10, two_factor_method=$12 WHERE id = $11 RETURNING *',
      [
        first_name,
        last_name,
        position,
        height,
        weight,
        email,
        phone,
        jersey_number,
        existingUser.rows[0].username, // Use existing username
        existingUser.rows[0].role, // Use existing role
        id,
        two_factor_method
      ]

    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating player profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
