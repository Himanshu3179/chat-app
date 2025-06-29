import { Router } from 'express';
import { registerUser, loginUser } from '../../controllers/auth.controller';

const router = Router();

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

export default router;
