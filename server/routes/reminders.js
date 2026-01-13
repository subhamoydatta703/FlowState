const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const User = require('../models/User');

// @route   GET /api/reminders/:clerkId
router.get('/:clerkId', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const reminders = await Reminder.find({ userId: user._id }).sort({ scheduledTime: 1 });
        res.json(reminders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/reminders
router.post('/', async (req, res) => {
    try {
        const { clerkId, message, scheduledTime } = req.body;

        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const newReminder = new Reminder({
            userId: user._id,
            userEmail: user.email,
            message,
            scheduledTime: new Date(scheduledTime)
        });

        const reminder = await newReminder.save();
        res.json(reminder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/reminders/:id
router.delete('/:id', async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Reminder removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
