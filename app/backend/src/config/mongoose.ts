import mongoose from 'mongoose';
import config from './index';

const connectDB = async (): Promise<void> => {
  try {
    // Set strict query to false to allow for more flexible queries (optional but common)
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(config.mongodb_uri);
        
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB:`, error);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
