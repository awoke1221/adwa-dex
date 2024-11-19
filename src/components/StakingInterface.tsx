import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector';
import { ArrowUpRight, Lock, Timer, TrendingUp, History, Info, AlertTriangle, ChevronDown } from 'lucide-react';
import TokenModal from './TokenModal';
import { formatCurrency } from '../utils/priceCalculations';
import type { Token } from '../types';

interface StakingPool {
  token: Token;
  apy: number;
  totalStaked: string;
  lockPeriod: number;
  minStake: string;
  userStake?: string;
  rewards?: string;
  isLocked?: boolean;
  unlockTime?: number;
}

const STAKING_POOLS: StakingPool[] = [
  {
    token: {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    },
    apy: 5.2,
    totalStaked: '245890.45',
    lockPeriod: 0,
    minStake: '0.1',
  },
  {
    token: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    apy: 12.5,
    totalStaked: '1245890.45',
    lockPeriod: 30,
    minStake: '100',
  },
  {
    token: {
      symbol: 'AAVE',
      name: 'Aave Token',
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      decimals: 18,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
    },
    apy: 18.7,
    totalStaked: '89567.23',
    lockPeriod: 90,
    minStake: '10',
  },
];

const StakingInterface: React.FC = () => {
  const { wallet } = useWallet();
  const [selectedPool, setSelectedPool] = useState<StakingPool>();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [showStakingHistory, setShowStakingHistory] = useState(false);
  const [stakingHistory] = useState([
    {
      type: 'stake',
      amount: '100',
      token: 'ETH',
      timestamp: Date.now() - 86400000,
      status: 'completed',
      txHash: '0x1234...5678',
    },
    {
      type: 'unstake',
      amount: '50',
      token: 'USDC',
      timestamp: Date.now() - 172800000,
      status: 'completed',
      txHash: '0x5678...1234',
    },
  ]);

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return;
    
    try {
      setIsStaking(true);
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Staking:', {
        token: selectedPool.token.symbol,
        amount: stakeAmount,
      });
      setStakeAmount('');
    } catch (error) {
      console.error('Staking error:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!selectedPool || !unstakeAmount) return;
    
    try {
      setIsUnstaking(true);
      // Simulate unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Unstaking:', {
        token: selectedPool.token.symbol,
        amount: unstakeAmount,
      });
      setUnstakeAmount('');
    } catch (error) {
      console.error('Unstaking error:', error);
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!selectedPool) return;
    
    try {
      // Simulate claiming rewards
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Claiming rewards for:', selectedPool.token.symbol);
    } catch (error) {
      console.error('Claiming rewards error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Staking Pools</h2>
            
            <div className="space-y-4">
              {STAKING_POOLS.map((pool) => (
                <button
                  key={pool.token.address}
                  onClick={() => setSelectedPool(pool)}
                  className={`w-full p-4 rounded-xl transition-colors ${
                    selectedPool?.token.address === pool.token.address
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={pool.token.logoURI} alt={pool.token.symbol} className="w-8 h-8 rounded-full" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">{pool.token.symbol}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{pool.token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-500 dark:text-green-400 font-medium">{pool.apy}% APY</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {pool.lockPeriod > 0 ? `${pool.lockPeriod} days lock` : 'No lock'}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Staked: ${formatCurrency(pool.totalStaked)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Min Stake: {pool.minStake} {pool.token.symbol}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Staking History</h3>
              <button
                onClick={() => setShowStakingHistory(!showStakingHistory)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <History size={20} />
              </button>
            </div>

            {showStakingHistory && (
              <div className="space-y-3">
                {stakingHistory.map((tx, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 text-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        {tx.type === 'stake' ? (
                          <Lock size={16} className="text-green-500" />
                        ) : (
                          <ArrowUpRight size={16} className="text-red-500" />
                        )}
                        <span className="text-gray-900 dark:text-white font-medium">
                          {tx.type === 'stake' ? 'Staked' : 'Unstaked'} {tx.amount} {tx.token}
                        </span>
                      </div>
                      <a
                        href={`https://etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedPool ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPool.token.logoURI}
                      alt={selectedPool.token.symbol}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedPool.token.symbol} Staking
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPool.lockPeriod > 0
                          ? `${selectedPool.lockPeriod} days lock period`
                          : 'No lock period'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                      {selectedPool.apy}% APY
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rewards paid daily
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Stake</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPool.userStake || '0'} {selectedPool.token.symbol}
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Earned Rewards</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPool.rewards || '0'} {selectedPool.token.symbol}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stake Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder={`Min ${selectedPool.minStake} ${selectedPool.token.symbol}`}
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setStakeAmount(wallet.balance)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 text-sm"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleStake}
                    disabled={!wallet.isConnected || isStaking || !stakeAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    {isStaking ? 'Staking...' : 'Stake'}
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unstake Amount
                    </label>
                    <input
                      type="number"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="Enter amount to unstake"
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleUnstake}
                    disabled={!wallet.isConnected || isUnstaking || !unstakeAmount || selectedPool.isLocked}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    {isUnstaking ? 'Unstaking...' : 'Unstake'}
                  </button>

                  {selectedPool.isLocked && (
                    <div className="flex items-center gap-2 text-sm text-yellow-500">
                      <Timer size={16} />
                      <span>
                        Locked until{' '}
                        {new Date(selectedPool.unlockTime || 0).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleClaimRewards}
                    disabled={!wallet.isConnected || !(selectedPool.rewards && parseFloat(selectedPool.rewards) > 0)}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    Claim Rewards
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pool Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Value Locked</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${formatCurrency(selectedPool.totalStaked)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Number of Stakers</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">1,234</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Rewards Distributed</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(12345)} {selectedPool.token.symbol}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Lock Time</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedPool.lockPeriod} days
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[400px]">
              <Info size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Select a Staking Pool
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Choose a pool from the left to view details and start staking
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingInterface;