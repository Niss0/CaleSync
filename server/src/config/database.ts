import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calesync';

// Function to initialize database connection
export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }

    // Listen for database connection events
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        } catch (err) {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
        }
    });
};