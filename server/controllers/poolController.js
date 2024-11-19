import Pool from '../models/Pool.js';
import { validatePool } from '../validators/poolValidator.js';
import logger from '../config/logger.js';

export const getPools = async (req, res) => {
  try {
    const pools = await Pool.find().populate('tokenA tokenB');
    res.json(pools);
  } catch (error) {
    logger.error('Error fetching pools:', error);
    res.status(500).json({ error: 'Failed to fetch pools' });
  }
};

export const createPool = async (req, res) => {
  try {
    const { error } = validatePool(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const pool = new Pool(req.body);
    await pool.save();
    
    res.status(201).json(pool);
  } catch (error) {
    logger.error('Error creating pool:', error);
    res.status(500).json({ error: 'Failed to create pool' });
  }
};

export const getPoolStats = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await Pool.findById(id).populate('tokenA tokenB');
    
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    // Calculate additional stats
    const stats = {
      tvl: pool.tvl,
      volume24h: pool.volume24h,
      apr: pool.apr,
      priceRange: pool.priceRange,
      liquidity: pool.liquidity,
    };

    res.json(stats);
  } catch (error) {
    logger.error(`Error fetching pool stats for ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch pool stats' });
  }
};