const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize local JSON storage if not present
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Signup endpoint
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    const fileData = fs.readFileSync(USERS_FILE);
    const users = JSON.parse(fileData);

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "User already registered!" });
    }

    users.push({ email, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ message: "Account created successfully!" });
});

// Signin endpoint
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
    const fileData = fs.readFileSync(USERS_FILE);
    const users = JSON.parse(fileData);

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials. Try again!" });
    }

    res.json({ message: "Success! Logged into your VYRA dashboard." });
});

app.listen(PORT, () => {
    console.log(`Backend service running on http://localhost:${PORT}`);
});
