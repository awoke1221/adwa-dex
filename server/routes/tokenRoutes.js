import express from 'express';
import { getTokens, getTokenPrice, calculateSwap } from '../controllers/tokenController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getTokens);
router.get('/price/:symbol', rateLimiter, getTokenPrice);
router.post('/calculate-swap', rateLimiter, calculateSwap);

export default router;