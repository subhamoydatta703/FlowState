const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const User = require('../models/User');
const { calculateProductivity } = require('../services/aiService');

// @route   GET /api/logs/:clerkId
// @desc    Get all logs for a user matching status optional
router.get('/:clerkId', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const filter = { userId: user._id };
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const logs = await Log.find(filter).sort({ createdAt: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/logs
// @desc    Create a new log (Pending)
router.post('/', async (req, res) => {
    try {
        const { clerkId, taskDescription, duration, tags } = req.body;

        const user = await User.findOne({ clerkId });
        if (!user) {
            console.log('User not found in logs POST, clerkId:', clerkId);
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log('Found user:', user._id);

        // Calculate points immediately or wait? 
        // Plan said: "Create task (Status: 'Pending', calculate potential points)"
        // Let's calculate now so we can show "Potential Points"
        const aiResult = await calculateProductivity(taskDescription, duration, tags);

        const newLog = new Log({
            userId: user._id,
            taskDescription,
            duration: duration || 0,
            tags: tags || [],
            points: aiResult.score,
            aiFeedback: aiResult.feedback,
            status: 'pending' // Default is pending
        });

        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/logs/:id/complete
// @desc    Mark log as completed and award points
router.put('/:id/complete', async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);
        if (!log) return res.status(404).json({ msg: 'Log not found' });

        if (log.status === 'completed') {
            return res.status(400).json({ msg: 'Task already completed' });
        }

        log.status = 'completed';
        log.completedAt = new Date();
        await log.save();

        // Award points to user
        const user = await User.findById(log.userId);
        user.totalPoints += log.points;
        await user.save();

        res.json({ log, userPoints: user.totalPoints });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/logs/:id
// @desc    Delete a log
router.delete('/:id', async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);
        if (!log) return res.status(404).json({ msg: 'Log not found' });

        // If deleting a completed task, should we deduct points?
        // Usually yes, to prevent cheating by adding/deleting.
        if (log.status === 'completed') {
            const user = await User.findById(log.userId);
            if (user) {
                user.totalPoints = Math.max(0, user.totalPoints - log.points);
                await user.save();
            }
        }

        await Log.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Log removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
