import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const TOKEN_IDS = {
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  // Add more tokens as needed
};

export async function fetchTokenPrices() {
  try {
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: Object.values(TOKEN_IDS).join(','),
        vs_currencies: 'usd'
      }
    });

    const prices = {};
    Object.entries(TOKEN_IDS).forEach(([symbol, id]) => {
      prices[symbol] = response.data[id]?.usd || 0;
    });

    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return {};
  }
}

const priceSubscriptions = new Map();

export function subscribeToPrice(tokenIn, tokenOut, callback) {
  const pair = `${tokenIn}-${tokenOut}`;
  
  if (!priceSubscriptions.has(pair)) {
    priceSubscriptions.set(pair, new Set());
  }
  
  priceSubscriptions.get(pair).add(callback);
  
  // Return unsubscribe function
  return () => {
    const callbacks = priceSubscriptions.get(pair);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        priceSubscriptions.delete(pair);
      }
    }
  };
}