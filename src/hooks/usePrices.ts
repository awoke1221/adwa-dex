import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export function usePrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial price fetch
    fetch('http://localhost:3000/api/prices')
      .then(res => res.json())
      .then(data => {
        setPrices(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch prices');
        setLoading(false);
      });

    // Listen for real-time updates
    socket.on('priceUpdate', (newPrices) => {
      setPrices(newPrices);
    });

    return () => {
      socket.off('priceUpdate');
    };
  }, []);

  const calculateSwap = async (tokenIn: string, tokenOut: string, amountIn: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/calculate-swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenIn, tokenOut, amountIn }),
      });
      
      if (!response.ok) throw new Error('Swap calculation failed');
      
      return await response.json();
    } catch (err) {
      setError('Failed to calculate swap');
      return null;
    }
  };

  const subscribeToPair = (tokenIn: string, tokenOut: string, callback: (price: number) => void) => {
    socket.emit('subscribeToPair', { tokenIn, tokenOut });
    socket.on('pairUpdate', ({ price }) => callback(price));

    return () => {
      socket.off('pairUpdate');
    };
  };

  return {
    prices,
    loading,
    error,
    calculateSwap,
    subscribeToPair,
  };
}