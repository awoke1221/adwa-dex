import React, { useState } from 'react';
import { Plus, Info, ChevronDown, Settings, Percent } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import TokenModal from './TokenModal';
import PoolSettings from './PoolSettings';
import { calculateOptimalRange, formatCurrency } from '../utils/priceCalculations';
import type { Token } from '../types';

const FEE_TIERS = [
  { value: 100, label: '0.01%', description: 'Best for stable pairs', apy: '5.2%' },
  { value: 500, label: '0.05%', description: 'Best for most pairs', apy: '12.5%' },
  { value: 3000, label: '0.3%', description: 'Best for exotic pairs', apy: '18.7%' },
  { value: 10000, label: '1%', description: 'Best for rare pairs', apy: '24.3%' },
];

const MOCK_POSITIONS = [
  {
    tokenA: {
      symbol: 'ETH',
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    },
    tokenB: {
      symbol: 'USDC',
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    fee: 500,
    liquidity: '245890.45',
    range: {
      min: '1800.25',
      max: '2400.75',
    },
    apr: 12.5,
  },
];

const PoolInterface: React.FC = () => {
  const { wallet } = useWallet();
  const [tokenA, setTokenA] = useState<Token>();
  const [tokenB, setTokenB] = useState<Token>();
  const [isSelectingTokenA, setIsSelectingTokenA] = useState(false);
  const [isSelectingTokenB, setIsSelectingTokenB] = useState(false);
  const [selectedFee, setSelectedFee] = useState(500);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isFullRange, setIsFullRange] = useState(false);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [positions] = useState(MOCK_POSITIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [deadline, setDeadline] = useState('20');
  const [expertMode, setExpertMode] = useState(false);

  const handleCreatePool = async () => {
    if (!wallet.isConnected || !tokenA || !tokenB || !amountA || !amountB) return;

    if (!expertMode) {
      const confirmed = window.confirm(`Are you sure you want to create a pool with the following parameters?
        \n- Token A: ${tokenA.symbol} (${amountA})
        \n- Token B: ${tokenB.symbol} (${amountB})
        \n- Fee Tier: ${selectedFee / 10000}%
        \n- Price Range: ${isFullRange ? 'Full Range' : `${priceRange.min} - ${priceRange.max}`}
        \n- Slippage Tolerance: ${slippage}%
        \n- Transaction Deadline: ${deadline} minutes`);

      if (!confirmed) return;
    }

    console.log('Creating pool with params:', {
      tokenA,
      tokenB,
      fee: selectedFee,
      amountA,
      amountB,
      priceRange: isFullRange ? { min: '0', max: '∞' } : priceRange,
      slippage,
      deadline,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Liquidity</h2>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Select Pair</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsSelectingTokenA(true)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl p-3 flex items-center justify-center gap-2"
                >
                  {tokenA ? (
                    <>
                      <img src={tokenA.logoURI} alt={tokenA.symbol} className="w-6 h-6 rounded-full" />
                      <span className="text-gray-900 dark:text-white">{tokenA.symbol}</span>
                    </>
                  ) : (
                    <span className="text-gray-900 dark:text-white">Select token</span>
                  )}
                  <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setIsSelectingTokenB(true)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl p-3 flex items-center justify-center gap-2"
                >
                  {tokenB ? (
                    <>
                      <img src={tokenB.logoURI} alt={tokenB.symbol} className="w-6 h-6 rounded-full" />
                      <span className="text-gray-900 dark:text-white">{tokenB.symbol}</span>
                    </>
                  ) : (
                    <span className="text-gray-900 dark:text-white">Select token</span>
                  )}
                  <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Fee tier</span>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Percent size={14} />
                  <span className="text-sm">Fees are shared by liquidity providers</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {FEE_TIERS.map((fee) => (
                  <button
                    key={fee.value}
                    onClick={() => setSelectedFee(fee.value)}
                    className={`p-3 rounded-xl text-left ${
                      selectedFee === fee.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{fee.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{fee.description}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">APY: {fee.apy}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Set Price Range</span>
                <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={isFullRange}
                    onChange={(e) => setIsFullRange(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Full Range</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Min Price</label>
                  <input
                    type="number"
                    value={isFullRange ? '0' : priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    disabled={isFullRange}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="0.0"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {tokenB?.symbol} per {tokenA?.symbol}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Max Price</label>
                  <input
                    type="number"
                    value={isFullRange ? '∞' : priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    disabled={isFullRange}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="∞"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {tokenB?.symbol} per {tokenA?.symbol}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-gray-600 dark:text-gray-400 block mb-2">Deposit Amounts</span>
              <div className="space-y-2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{tokenA?.symbol || 'Token A'}</span>
                    {wallet.isConnected && <span className="text-gray-600 dark:text-gray-400">Balance: {wallet.balance}</span>}
                  </div>
                  <input
                    type="number"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    className="w-full bg-transparent text-gray-900 dark:text-white outline-none"
                    placeholder="0.0"
                  />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{tokenB?.symbol || 'Token B'}</span>
                  </div>
                  <input
                    type="number"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="w-full bg-transparent text-gray-900 dark:text-white outline-none"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCreatePool}
              disabled={!wallet.isConnected || !tokenA || !tokenB || !amountA || !amountB}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition-colors"
            >
              {wallet.isConnected ? 'Add Liquidity' : 'Connect Wallet'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Positions</h3>
            {positions.map((position, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img src={position.tokenA.logoURI} alt={position.tokenA.symbol} className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800" />
                      <img src={position.tokenB.logoURI} alt={position.tokenB.symbol} className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {position.tokenA.symbol}/{position.tokenB.symbol}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{position.fee / 10000}%</span>
                  </div>
                  <div className="text-green-500 dark:text-green-400 flex items-center gap-1">
                    <Percent size={14} />
                    {position.apr}% APR
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">Price Range</div>
                    <div className="text-gray-900 dark:text-white">
                      {formatCurrency(position.range.min)} - {formatCurrency(position.range.max)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">Liquidity</div>
                    <div className="text-gray-900 dark:text-white">${formatCurrency(position.liquidity)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TokenModal
        isOpen={isSelectingTokenA}
        onClose={() => setIsSelectingTokenA(false)}
        onSelect={setTokenA}
        selectedTokens={tokenB ? [tokenB] : []}
      />
      <TokenModal
        isOpen={isSelectingTokenB}
        onClose={() => setIsSelectingTokenB(false)}
        onSelect={setTokenB}
        selectedTokens={tokenA ? [tokenA] : []}
      />
      <PoolSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        slippage={slippage}
        setSlippage={setSlippage}
        deadline={deadline}
        setDeadline={setDeadline}
        expertMode={expertMode}
        setExpertMode={setExpertMode}
      />
    </div>
  );
};

export default PoolInterface;