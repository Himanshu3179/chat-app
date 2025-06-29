import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { accessOrCreateChat, fetchUserChats, getChatMessages } from '../../controllers/chat.controller';

const router = Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Route to either create a new 1-on-1 chat or access an existing one
router.route('/').post(accessOrCreateChat);

// Route to get all of the logged-in user's chats
router.route('/').get(fetchUserChats);

// Route to get all messages for a specific chat
router.route('/:chatId/messages').get(getChatMessages);

// TODO: Routes for group chats (create, rename, add/remove members) can be added here later

export default router;
