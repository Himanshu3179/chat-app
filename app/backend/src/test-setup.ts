// src/test-setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from './config';

let mongoServer: MongoMemoryServer;

// Before all tests, create an in-memory MongoDB instance
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // We can override the config's URI for the tests
  config.mongodb_uri = mongoUri;
});

// After all tests, stop the server and disconnect mongoose
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Optional: Clear all data before each test
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        if (collection) {
            await collection.deleteMany({});
        }
    }
});