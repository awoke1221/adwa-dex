import mongoose from 'mongoose';

const poolSchema = new mongoose.Schema({
  tokenA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: true,
  },
  tokenB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  liquidity: {
    type: Number,
    required: true,
    default: 0,
  },
  priceRange: {
    min: Number,
    max: Number,
  },
  apr: {
    type: Number,
    default: 0,
  },
  volume24h: {
    type: Number,
    default: 0,
  },
  tvl: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Pool', poolSchema);