// src/__tests__/auth.test.ts
import request from 'supertest';
import app from '../app'; // Import your express app
import User from '../models/user.model';

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      
      // Verify user was actually saved to the in-memory database
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser?.username).toBe(testUser.username);
    });

    it('should fail to register a user with an existing email', async () => {
      // First, register a user
      await request(app).post('/api/auth/register').send(testUser);
      
      // Then, try to register with the same email again
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
        
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User with this email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Ensure a user is registered before each login test
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should log in a registered user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Logged in successfully');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail to log in with an incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});