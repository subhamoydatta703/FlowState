const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

const fixIndexes = async () => {
    try {
        // Load env from parent directory
        require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGODB_URI not found in .env");
        }
        console.log("Connecting to:", uri.replace(/:([^:@]+)@/, ':****@'));

        await mongoose.connect(uri);
        console.log("Connected to MongoDB...");

        const collection = mongoose.connection.collection('users');

        console.log("Listing indexes...");
        const indexes = await collection.indexes();
        console.log(indexes);

        const usernameIndex = indexes.find(idx => idx.name === 'username_1');

        if (usernameIndex) {
            console.log("Found incorrect 'username_1' unique index. Dropping it...");
            await collection.dropIndex('username_1');
            console.log("Index dropped successfully!");
        } else {
            console.log("'username_1' index not found. No action needed.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error fixing indexes:", err);
        process.exit(1);
    }
};

fixIndexes();
