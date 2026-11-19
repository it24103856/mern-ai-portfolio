import express from 'express';
import { sendMessage, getMessages, toggleReadMessage, deleteMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').post(sendMessage).get(protect, getMessages);
router.route('/:id').patch(protect, toggleReadMessage).delete(protect, deleteMessage);
export default router;