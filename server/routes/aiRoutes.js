import express from 'express';
import { chatWithPortfolioAI, listAvailableModels } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithPortfolioAI);
router.get('/models', listAvailableModels);

export default router;