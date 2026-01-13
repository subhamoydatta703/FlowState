const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: {
        type: String, // Storing clerkId for easy reference, or ObjectId if we strictly map. Let's use clerkId to be consistent with User model lookup or we can use ref.
        // However, Mongoose "ref" usually expects an ObjectId. 
        // Let's store the User ObjectId and also keep clerkId if needed, but standard is ObjectId.
        // Implementation Plan said: "userId (ref to User)".
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    aiFeedback: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    duration: {
        type: Number, // in minutes
        required: true,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Log', logSchema);
