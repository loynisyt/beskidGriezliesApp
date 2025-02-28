const express = require('express');
const router = express.Router();
const pool = require('./db');

// Add a participant to a workout
router.post('/workouts/:id/participants', async (req, res) => {

    const { id } = req.params;
    const { userId } = req.body; // Assuming userId is passed in the request body
    try {
        const newParticipant = await pool.query(
            'INSERT INTO participants (workout_id, user_id) VALUES ($1, $2) RETURNING *',
            [id, userId]
        );
        res.json(newParticipant.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get participant count for a workout
router.get('/workouts/:id/participants/count', async (req, res) => {
    const { id } = req.params;
    try {
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM participants WHERE workout_id = $1',
            [id]
        );
        res.json({ count: parseInt(countResult.rows[0].count) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// Get all participants for a workout
router.get('/workouts/:id/participants', async (req, res) => {

    const { id } = req.params;
    try {
        const participants = await pool.query(
            'SELECT * FROM participants WHERE workout_id = $1',
            [id]
        );
        res.json(participants.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
