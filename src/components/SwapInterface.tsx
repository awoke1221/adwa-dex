import React, { useState, useEffect, useCallback } from 'react';
import { Settings, ArrowDownUp, Info, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector';
import TokenModal from './TokenModal';
import SwapSettings from './SwapSettings';
import { formatCurrency } from '../utils/priceCalculations';
import {
  setTokenA,
  setTokenB,
  setAmountA,
  setAmountB,
  setSlippage,
  setDeadline,
  swapTokens as swapTokensAction,
  calculateSwap,
} from '../store/slices/swapSlice';
import type { Token } from '../types';

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelectToken: () => void;
  token?: Token;
  balance?: string;
  priceUSD?: string;
  disabled?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  label,
  value,
  onChange,
  onSelectToken,
  token,
  balance,
  priceUSD,
  disabled = false,
}) => (
  <div className="bg-white dark:bg-gray-700 rounded-xl p-4">
    <div className="flex justify-between mb-2">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      {balance && <span className="text-gray-600 dark:text-gray-400">Balance: {balance}</span>}
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onSelectToken}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-xl px-3 py-2"
      >
        {token ? (
          <>
            <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 rounded-full" />
            <span className="text-gray-900 dark:text-white font-medium">{token.symbol}</span>
          </>
        ) : (
          <span className="text-gray-900 dark:text-white">Select token</span>
        )}
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.0"
        disabled={disabled}
        className="flex-1 bg-transparent text-gray-900 dark:text-white text-2xl outline-none text-right disabled:opacity-50"
      />
    </div>
    {priceUSD && (
      <div className="text-right text-gray-500 dark:text-gray-400 text-sm mt-1">
        ≈ ${formatCurrency(parseFloat(value) * parseFloat(priceUSD), 2)}
      </div>
    )}
  </div>
);

const SwapInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAppSelector((state) => state.wallet);
  const { tokenA, tokenB, amountA, amountB, slippage, deadline, priceImpact, loading } = useAppSelector((state) => state.swap);
  const { prices } = useAppSelector((state) => state.price);
  const [isSelectingTokenA, setIsSelectingTokenA] = useState(false);
  const [isSelectingTokenB, setIsSelectingTokenB] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const calculateSwapDebounced = useCallback(
    async (amount: string) => {
      if (tokenA && tokenB && amount && !loading) {
        dispatch(calculateSwap({ tokenA, tokenB, amount, prices }));
      }
    },
    [tokenA, tokenB, prices, dispatch, loading]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateSwapDebounced(amountA);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [amountA, calculateSwapDebounced]);

  const handleSwapTokens = () => {
    dispatch(swapTokensAction());
  };

  const handleSwap = async () => {
    if (priceImpact > 15) {
      if (!window.confirm('Warning: High price impact! Are you sure you want to proceed?')) {
        return;
      }
    }

    console.log('Swap tokens', { 
      tokenA, 
      tokenB, 
      amountA, 
      amountB,
      slippage,
      deadline,
      priceImpact
    });
  };

  const getPriceImpactColor = () => {
    if (priceImpact < 1) return 'text-green-500';
    if (priceImpact < 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Swap</h2>
          <button
            onClick={() => setShowSettings(true)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings size={20} />
          </button>
        </div>

        <TokenInput
          label="You pay"
          value={amountA}
          onChange={(value) => dispatch(setAmountA(value))}
          onSelectToken={() => setIsSelectingTokenA(true)}
          token={tokenA}
          priceUSD={tokenA ? prices[tokenA.symbol]?.toString() : undefined}
        />

        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="bg-white dark:bg-gray-700 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowDownUp size={20} />
          </button>
        </div>

        <TokenInput
          label="You receive"
          value={amountB}
          onChange={(value) => dispatch(setAmountB(value))}
          onSelectToken={() => setIsSelectingTokenB(true)}
          token={tokenB}
          priceUSD={tokenB ? prices[tokenB.symbol]?.toString() : undefined}
          disabled={true}
        />

        {tokenA && tokenB && amountA && amountB && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Rate</span>
              <span className="text-gray-900 dark:text-white">
                1 {tokenA.symbol} = {formatCurrency(parseFloat(amountB) / parseFloat(amountA))} {tokenB.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-600 dark:text-gray-400">Price Impact</span>
                <Info size={14} className="text-gray-400" />
              </div>
              <span className={getPriceImpactColor()}>
                {priceImpact > 15 && <AlertTriangle size={14} className="inline mr-1" />}
                {priceImpact.toFixed(2)}%
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={!isConnected || !tokenA || !tokenB || !amountA || !amountB || loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition-colors"
        >
          {!isConnected
            ? 'Connect Wallet'
            : loading
            ? 'Calculating...'
            : 'Swap'}
        </button>
      </div>

      <TokenModal
        isOpen={isSelectingTokenA}
        onClose={() => setIsSelectingTokenA(false)}
        onSelect={(token) => dispatch(setTokenA(token))}
        selectedTokens={tokenB ? [tokenB] : []}
      />
      <TokenModal
        isOpen={isSelectingTokenB}
        onClose={() => setIsSelectingTokenB(false)}
        onSelect={(token) => dispatch(setTokenB(token))}
        selectedTokens={tokenA ? [tokenA] : []}
      />
      <SwapSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        slippage={slippage}
        setSlippage={(value) => dispatch(setSlippage(value))}
        deadline={deadline}
        setDeadline={(value) => dispatch(setDeadline(value))}
      />
    </>
  );
};

export default SwapInterface;