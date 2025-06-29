import { Request, Response } from 'express';
import User from '../models/user.model';
import { generateToken } from '../services/token.service'; // Import the token generator

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      username,
      email,
      password,
    });
    
    await user.save();

    // --- THIS IS THE FIX ---
    // If user was created successfully, generate a token and log them in
    if (user) {
      const token = generateToken(user);

      // We need to convert the user document to an object to remove the password
      const userObject = user.toObject();
      delete userObject.password;

      res.status(201).json({
        token,
        user: userObject,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    
    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};