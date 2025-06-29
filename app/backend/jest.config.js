// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // A path to a module that sets up the test environment.
  // We'll create this file next.
  setupFilesAfterEnv: ['./src/test-setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};