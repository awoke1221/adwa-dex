import axios from 'axios';
import Token from '../models/Token.js';
import logger from '../config/logger.js';

class PriceService {
  constructor() {
    this.priceCache = new Map();
    this.subscribers = new Map();
    this.updateInterval = 10000; // 10 seconds
    this.startPriceUpdates();
  }

  async fetchPriceFromBinance(symbol) {
    try {
      const response = await axios.get(`${process.env.BINANCE_API_URL}/ticker/price`, {
        params: { symbol: `${symbol}USDT` }
      });
      return parseFloat(response.data.price);
    } catch (error) {
      logger.error(`Binance API error for ${symbol}: ${error.message}`);
      return null;
    }
  }

  async fetchPriceFromCoinGecko(tokenId) {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: tokenId,
          vs_currencies: 'usd',
          x_cg_demo_api_key: process.env.COINGECKO_API_KEY
        }
      });
      return response.data[tokenId]?.usd;
    } catch (error) {
      logger.error(`CoinGecko API error for ${tokenId}: ${error.message}`);
      return null;
    }
  }

  async updateTokenPrice(token) {
    try {
      let price = await this.fetchPriceFromBinance(token.symbol);
      
      if (!price) {
        price = await this.fetchPriceFromCoinGecko(token.symbol.toLowerCase());
      }

      if (price) {
        await Token.findByIdAndUpdate(token._id, {
          priceUSD: price,
          lastUpdated: new Date()
        });

        this.priceCache.set(token.symbol, price);
        this.notifySubscribers(token.symbol);
      }
    } catch (error) {
      logger.error(`Error updating price for ${token.symbol}: ${error.message}`);
    }
  }

  startPriceUpdates() {
    setInterval(async () => {
      const tokens = await Token.find();
      for (const token of tokens) {
        await this.updateTokenPrice(token);
      }
    }, this.updateInterval);
  }

  subscribe(symbol, callback) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol).add(callback);

    return () => {
      const callbacks = this.subscribers.get(symbol);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  notifySubscribers(symbol) {
    const price = this.priceCache.get(symbol);
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      callbacks.forEach(callback => callback(price));
    }
  }

  getPrice(symbol) {
    return this.priceCache.get(symbol);
  }

  async calculateSwap(tokenInSymbol, tokenOutSymbol, amountIn) {
    const tokenInPrice = this.getPrice(tokenInSymbol);
    const tokenOutPrice = this.getPrice(tokenOutSymbol);

    if (!tokenInPrice || !tokenOutPrice) {
      throw new Error('Price not available');
    }

    const priceRatio = tokenOutPrice / tokenInPrice;
    const amountOut = parseFloat(amountIn) * priceRatio;
    
    // Calculate price impact
    const spotPrice = priceRatio;
    const priceImpact = Math.abs((amountOut - (parseFloat(amountIn) * spotPrice)) / (parseFloat(amountIn) * spotPrice) * 100);

    return {
      amountOut: amountOut.toFixed(6),
      priceImpact: priceImpact.toFixed(2),
      priceRatio: priceRatio.toFixed(6),
      tokenInPrice: tokenInPrice.toFixed(6),
      tokenOutPrice: tokenOutPrice.toFixed(6)
    };
  }
}

export default new PriceService();