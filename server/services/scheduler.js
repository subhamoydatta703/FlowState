const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const Reminder = require('../models/Reminder');
const dotenv = require('dotenv');
dotenv.config();

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use host/port for other services
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const checkReminders = () => {
    // Run every minute
    schedule.scheduleJob('* * * * *', async () => {
        try {
            const now = new Date();
            // Find pending reminders that are due or past due
            const reminders = await Reminder.find({
                status: 'pending',
                scheduledTime: { $lte: now }
            });

            for (const reminder of reminders) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: reminder.userEmail,
                    subject: 'Productivity Reminder',
                    text: `Reminder: ${reminder.message}`
                };

                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        reminder.status = 'sent';
                        await reminder.save();
                    }
                });
            }
        } catch (err) {
            console.error('Scheduler Error:', err);
        }
    });
};

module.exports = checkReminders;
