const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key-change-this';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database file (simple JSON file)
const DB_FILE = path.join(__dirname, 'users.json');

// Initialize users database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Helper functions
function getUsers() {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveUsers(users) {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function findUserByUsername(username) {
    const users = getUsers();
    return users.find(u => u.username === username);
}

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        
        const user = findUserByUsername(username);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        const token = jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        
        res.json({ 
            message: 'Login successful', 
            token,
            username: user.username 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        
        const existingUser = findUserByUsername(username);
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = getUsers();
        
        users.push({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });
        
        saveUsers(users);
        
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`La Bodega Online server running at http://localhost:${PORT}`);
});
