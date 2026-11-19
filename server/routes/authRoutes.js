import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);

export default router;