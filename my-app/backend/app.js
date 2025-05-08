const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./userRoutes');
const workoutRoutes = require('./workoutRoutes');
const participantRoutes = require('./participantRoutes'); // Import participant routes
const playersRoutes = require('./playerRoutes'); // Import player routes
const authController = require('./controllers/authController');
const emailRoutes = require("./emailRoutes");

const pool = require('./db');

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Request Body:', req.body); // Log the request body
    next();
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Auth routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.createUser);

// Protected routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/participant', participantRoutes); // Use participant routes
app.use('/api/profile', playersRoutes); // Use player routes
app.use("/api/email", emailRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err); // Detailed logging
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Database connection test
pool.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err.stack);
        process.exit(1);
    });

module.exports = app;
