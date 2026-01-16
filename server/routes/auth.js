const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/sync
// @desc    Sync Clerk user with MongoDB
// @access  Public (protected by client-side auth flow usually, validation here recommended)
router.post('/sync', async (req, res) => {
    try {
        const { clerkId, email, username } = req.body;
        console.log('Syncing user:', clerkId, email);

        let user = await User.findOne({ clerkId });

        // If not found by Clerk ID, try finding by Email to link accounts
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                // Found by email, update the clerkId to match current
                user.clerkId = clerkId;
                user.username = username;
                await user.save();
            } else {
                // Truly new user
                user = new User({
                    clerkId,
                    email,
                    username
                });
                await user.save();
            }
        } else {
            // Found by ID, update info if changed
            user.email = email;
            user.username = username;
        }

        // Daily Reset Check for returning/new users
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const lastLogStr = user.lastLogDate ? user.lastLogDate.toISOString().split('T')[0] : null;

        if (lastLogStr !== todayStr) {
            user.dailyXP = 0;
        }

        // FORCE UPDATE GOAL (Migration to 500)
        // If it was the old default (300) or missing, set to 500
        if (!user.dailyGoal || user.dailyGoal === 300) {
            user.dailyGoal = 500;
        }

        await user.save();

        res.json(user);
    } catch (err) {
        // Handle Race Condition (Duplicate Key Error E11000)
        if (err.code === 11000) {
            console.log("Race condition detected (Duplicate Key), retrieving existing user...");
            try {
                // Try to find the user that was just created by the other request
                const { clerkId, email } = req.body;
                const existingUser = await User.findOne({ $or: [{ clerkId }, { email }] });
                if (existingUser) {
                    return res.json(existingUser);
                }
            } catch (retryErr) {
                console.error("Retry failed:", retryErr);
            }
        }

        console.error("Sync Error Details:", err);
        console.error("Request Body:", req.body);
        res.status(500).send('Server Error: ' + err.message);
    }
});

module.exports = router;
