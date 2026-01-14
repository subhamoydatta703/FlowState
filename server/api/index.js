const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// MongoDB connection (cached for serverless)
let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        cachedDb = conn;
        return cachedDb;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

// Initialize DB before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/logs', require('../routes/logs'));
app.use('/api/reminders', require('../routes/reminders'));

// Health check
app.get('/api', (req, res) => {
    res.json({ message: 'FlowState API is running', status: 'healthy' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Export the Express app for Vercel
module.exports = app;
