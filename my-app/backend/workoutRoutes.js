// backend/workoutRoutes.js
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
// backend/workoutRoutes.js

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

// Participate in a workout
router.post('/:id/participate', authMiddleware.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'INSERT INTO workout_participants (workout_id, user_id) VALUES ($1, $2) ON CONFLICT (workout_id, user_id) DO NOTHING',
            [id, req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Already participating in this workout' });
        }
        res.json({ message: 'Successfully joined the workout' });
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
            'INSERT INTO workouts (title, date, time, description, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, date, time, description, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a workout (admin only)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, date, time, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE workouts SET title = $1, date = $2, time = $3, description = $4 WHERE id = $5 RETURNING *',
            [title, date, time, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a workout (admin only)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM workout_participants WHERE workout_id = $1', [id]);
        const result = await pool.query('DELETE FROM workouts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json({ message: 'Workout deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Participate in a workout
router.post('/:id/participate', authMiddleware.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            'INSERT INTO workout_participants (workout_id, user_id) VALUES ($1, $2) ON CONFLICT (workout_id, user_id) DO NOTHING',
            [id, req.user.id]
        );
        res.json({ message: 'Successfully joined the workout' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel participation in a workout
router.delete('/:id/participate', authMiddleware.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM workout_participants WHERE workout_id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Participation not found' });
        }
        res.json({ message: 'Successfully cancelled participation' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;