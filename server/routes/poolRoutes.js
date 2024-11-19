import express from 'express';
import { getPools, createPool, getPoolStats } from '../controllers/poolController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getPools);
router.post('/', rateLimiter, createPool);
router.get('/:id/stats', rateLimiter, getPoolStats);

export default router;