// server/app.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User model
const User = mongoose.model('User', {
    username: String,
    password: String,
});

// Task model
const Task = mongoose.model('Task', {
    userId: mongoose.Types.ObjectId,
    title: String,
    description: String,
    dueDate: Date,
    completed: Boolean,
});

// Middleware authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
};

// Register endpoint
app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        username: req.body.username,
        password: hashedPassword,
    });

    try {
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send('Registration failed');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Invalid username or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username or password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.header('Authorization', token).send('Login successful');
});

// Task creation endpoint
app.post('/tasks', authenticateToken, async (req, res) => {
    const task = new Task({
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        completed: false,
    });

    try {
        await task.save();
        res.status(201).send('Task created successfully');
    } catch (error) {
        res.status(400).send('Task creation failed');
    }
});

// Other task endpoints (update, delete, etc.) can be added similarly

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
