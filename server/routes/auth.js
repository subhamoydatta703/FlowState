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
            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error("Sync Error Details:", err); // Log the full error object
        console.error("Request Body:", req.body); // Log what we tried to save
        res.status(500).send('Server Error: ' + err.message);
    }
});

module.exports = router;
