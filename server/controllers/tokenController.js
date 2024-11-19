import Token from '../models/Token.js';
import PriceService from '../services/PriceService.js';
import { validateToken } from '../validators/tokenValidator.js';
import logger from '../config/logger.js';

export const getTokens = async (req, res) => {
  try {
    const tokens = await Token.find();
    res.json(tokens);
  } catch (error) {
    logger.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
};

export const getTokenPrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = PriceService.getPrice(symbol);
    
    if (!price) {
      return res.status(404).json({ error: 'Price not found' });
    }
    
    res.json({ symbol, price });
  } catch (error) {
    logger.error(`Error fetching price for ${req.params.symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

export const calculateSwap = async (req, res) => {
  try {
    const { tokenIn, tokenOut, amountIn } = req.body;
    const result = await PriceService.calculateSwap(tokenIn, tokenOut, amountIn);
    res.json(result);
  } catch (error) {
    logger.error('Error calculating swap:', error);
    res.status(500).json({ error: 'Failed to calculate swap' });
  }
};