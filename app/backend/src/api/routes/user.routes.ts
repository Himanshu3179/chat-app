import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { searchUsers } from '../../controllers/user.controller';

const router = Router();

// All routes in this file are protected
router.use(protect);

// Defines the GET /api/users endpoint
router.route('/').get(searchUsers);

export default router;
