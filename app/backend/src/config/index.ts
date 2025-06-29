import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  port: process.env.PORT!,
  mongodb_uri: process.env.MONGODB_URI! ,
  jwt_secret: process.env.JWT_SECRET! ,
};

export default config;
