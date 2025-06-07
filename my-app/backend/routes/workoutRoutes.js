const express = require('express');
const router = express.Router();
const pool = require('../db');

// ENDPOINT: dodanie treningu
router.post('/add', async (req, res) => {
    const { title, description_html, created_by, date, time, season } = req.body; 

    try {
        const newWorkout = await pool.query(
            'INSERT INTO workouts (title, description_html, created_by, date, time, season) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description_html, created_by, date, time, season]
        );
        res.json(newWorkout.rows[0]);
    } catch (err) {
        console.error('Error adding workout:', err); // Detailed error logging
        res.status(500).json({ error: 'Server error', message: err.message }); // Return error message as JSON
    }
});

//ENDPOINT: wszystkie treningi
router.get('/workouts', async (req, res) => {
    try {
        const allWorkouts = await pool.query('SELECT * FROM workouts');
        res.json(allWorkouts.rows);
    } catch (err) {
        console.error('Error fetching workouts:', err);
        res.status(500).json({ error: 'Server error', message: err.message }); // Return error message as JSON
    }
});

// Edit a workout
router.put('/workouts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description_html, date, time, season } = req.body;

    try {
        const updateWorkout = await pool.query(
            'UPDATE workouts SET title = $1, description_html = $2, date = $3, time = $4, season = $5 WHERE id = $6 RETURNING *',
            [title, description_html, date, time, season, id]
        );
        if (updateWorkout.rowCount === 0) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.json(updateWorkout.rows[0]);

    } catch (err) {
        console.error('Error updating workout:', err); // Log the error details
        res.status(500).send('Server error'); 
    }
});

//  endpoint: usunięcie treningu
router.delete('/workouts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM workouts WHERE id = $1', [id]);
        res.json({ message: 'Workout was deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', message: err.message }); // Return error message as JSON
    }
});

module.exports = router;
