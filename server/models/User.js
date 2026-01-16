const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    streak: {
        type: Number,
        default: 0
    },
    lastLogDate: {
        type: Date
    },
    dailyXP: {
        type: Number,
        default: 0
    },
    dailyGoal: {
        type: Number,
        default: 500
    },
    lastInsight: {
        feedback: String,
        rating: Number,
        generatedAt: Date
    }
});

module.exports = mongoose.model('User', userSchema);
