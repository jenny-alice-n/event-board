const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['cultural', 'technical', 'sports', 'workshop', 'other'],
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    caption: {
        type: String,
        required: true,
        maxLength: 200
    },
    registrationLink: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clubName: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
