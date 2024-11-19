import React from 'react';
import { Wallet, TrendingUp, History } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/priceCalculations';

const ProfileOverview: React.FC = () => {
  const { wallet } = useWallet();

  const stats = [
    {
      label: 'Total Value Locked',
      value: '$124,532.84',
      change: '+12.5%',
      icon: <Wallet className="text-blue-500 dark:text-blue-400" size={20} />,
    },
    {
      label: 'Total Earnings',
      value: '$3,845.12',
      change: '+8.2%',
      icon: <TrendingUp className="text-green-500 dark:text-green-400" size={20} />,
    },
    {
      label: 'Total Transactions',
      value: '156',
      change: '+24 this week',
      icon: <History className="text-purple-500 dark:text-purple-400" size={20} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
          <div className="text-sm text-green-500 dark:text-green-400">{stat.change}</div>
        </div>
      ))}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">Connected Wallet</span>
          <Wallet className="text-blue-500 dark:text-blue-400" size={20} />
        </div>
        <div className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Balance: {wallet.balance} ETH
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;