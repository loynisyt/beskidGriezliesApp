const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'your_secret_key'; // Upewnij się, że używasz bezpiecznego klucza!

// Logowanie użytkownika
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generowanie tokenu JWT
        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, username: user.username, role: user.role, firstName: user.first_name, lastName: user.last_name } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
