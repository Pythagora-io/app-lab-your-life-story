import mongoose from 'mongoose';
import logger from '../utils/log.js';

const log = logger('config/database');

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB with URL:', process.env.DATABASE_URL);
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    log.info('MongoDB connected successfully');
  } catch (error) {
    log.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;