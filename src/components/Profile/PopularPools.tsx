import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PopularPools: React.FC = () => {
  const pools = [
    {
      pair: 'ETH/USDC',
      tvl: '$45.2M',
      apr: '12.5%',
      volume24h: '$2.8M',
      change24h: '+5.2%',
    },
    {
      pair: 'ETH/USDT',
      tvl: '$38.6M',
      apr: '11.8%',
      volume24h: '$2.4M',
      change24h: '+4.8%',
    },
    {
      pair: 'USDC/USDT',
      tvl: '$25.1M',
      apr: '8.2%',
      volume24h: '$1.6M',
      change24h: '+3.1%',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Pools</h3>
        <Link to="/pool" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>
      <div className="space-y-4">
        {pools.map((pool, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-900 dark:text-white font-medium">{pool.pair}</span>
              <div className="flex items-center text-green-500 dark:text-green-400">
                <TrendingUp size={16} className="mr-1" />
                {pool.change24h}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">TVL</div>
                <div className="text-gray-900 dark:text-white">{pool.tvl}</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">APR</div>
                <div className="text-gray-900 dark:text-white">{pool.apr}</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">24h Volume</div>
                <div className="text-gray-900 dark:text-white">{pool.volume24h}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPools;