const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Register a new club (Root only)
router.post('/register-club', async (req, res) => {
    try {
        const { username, password, clubName } = req.body;
        const user = new User({ username, password, clubName, role: 'club' });
        await user.save();
        res.status(201).send({ message: 'Club created successfully' });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !(await user.comparePassword(req.body.password))) {
            return res.status(400).send({ error: 'Unable to login' });
        }
        const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET);
        res.send({ user: { _id: user._id, username: user.username, role: user.role, clubName: user.clubName }, token });
    } catch (e) {
        res.status(500).send();
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
