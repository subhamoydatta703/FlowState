const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent'],
        default: 'pending'
    },
    userEmail: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Reminder', reminderSchema);
