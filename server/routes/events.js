const express = require('express');
const Event = require('../models/Event');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Create event (Club Heads & Root)
router.post('/', auth, upload.single('poster'), async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            organizer: req.user._id,
            clubName: req.user.role === 'root' ? (req.body.clubName || 'Admin') : req.user.clubName
        };
        const event = new Event(eventData);
        await event.save();
        res.status(201).send({
            ...event.toObject(),
            image: undefined // Don't send buffer in listing
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get all events (Public)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}).select('-image.data').sort({ date: 1 });
        res.send(events);
    } catch (e) {
        res.status(500).send();
    }
});

// Serve event image
router.get('/:id/image', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event || !event.image.data) {
            return res.status(404).send();
        }
        res.set('Content-Type', event.image.contentType);
        res.send(event.image.data);
    } catch (e) {
        res.status(500).send();
    }
});

// Update event (Owner or Root)
router.patch('/:id', auth, upload.single('poster'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send();

        // Check ownership or root
        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'root') {
            return res.status(403).send({ error: 'Not authorized' });
        }

        const updates = Object.keys(req.body);
        updates.forEach((update) => (event[update] = req.body[update]));

        if (req.file) {
            event.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        await event.save();
        res.send({
            ...event.toObject(),
            image: undefined
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete event (Owner or Root)
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send();

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'root') {
            return res.status(403).send({ error: 'Not authorized' });
        }

        await event.deleteOne();
        res.send(event);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
