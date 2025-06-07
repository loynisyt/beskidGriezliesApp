const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const participantRoutes = require('./routes/participantRoutes'); // Import participant routes
const playersRoutes = require('./routes/playerRoutes'); // Import player routes
const authController = require('./controllers/authController');
const emailRoutes = require("./routes/emailRoutes");
const supportRoutes = require('./routes/supportRoutes');
const zlkMatchesRoutes = require('./routes/zlkMatchesRoutes');
const pool = require('./db');

app.use(express.json());


const tokenService = require('./services/tokenService'); // Add this near other requires

// Schedule periodic cleanup of expired tokens every hour
setInterval(async () => {
    try {
        await tokenService.removeAllExpiredTokens();
        console.log('Expired tokens cleanup executed');
    } catch (error) {
        console.error('Error during expired tokens cleanup:', error);
    }
}, 60 * 60 * 1000); // 1 hour interval


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



// Auth routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.createUser);


// Protected routes
app.use('/api/users', userRoutes); // Use user routes
app.use('/api/statistics', statisticsRoutes); // Use statistics routes
app.use('/api/workouts', workoutRoutes); // Use workout routes
app.use('/api/participant', participantRoutes); // Use participant routes
app.use('/api/profile', playersRoutes); // Use player routes
app.use("/api/email", emailRoutes); // Use email routes
app.use('/api/statistics', statisticsRoutes); // Use statistics routes
app.use('/api/support', supportRoutes); // Use support routes
app.use('/api/zlk', zlkMatchesRoutes);


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
