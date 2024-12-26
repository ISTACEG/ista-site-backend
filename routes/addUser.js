const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Create a new user
        const newUser = new User({ username, email, password });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error});
    }
});

module.exports = router;