const express = require('express');
const router = express.Router();
const pool = require('./db');
const authMiddleware = require('./authMiddleware');

// Get all workouts
router.get('/', authMiddleware.verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM workouts ORDER BY date DESC, time DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new workout (admin only)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
    const { title, date, time, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO workouts (title, date, time, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, date, time, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get participants for a workout
router.get('/:id/participants', authMiddleware.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT users.username FROM workout_participants JOIN users ON workout_participants.user_id = users.id WHERE workout_participants.workout_id = $1',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;