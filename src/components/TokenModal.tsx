import React, { useState, useMemo } from 'react';
import { Search, X, ExternalLink } from 'lucide-react';
import type { Token } from '../types';

const POPULAR_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  },
  {
    symbol: 'AAVE',
    name: 'Aave Token',
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
  },
  {
    symbol: 'CRV',
    name: 'Curve DAO Token',
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png',
  },
  {
    symbol: 'SNX',
    name: 'Synthetix Network Token',
    address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
  },
  {
    symbol: 'COMP',
    name: 'Compound',
    address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png',
  },
  {
    symbol: 'MKR',
    name: 'Maker',
    address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
  },
  {
    symbol: 'SUSHI',
    name: 'SushiToken',
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
  },
  {
    symbol: '1INCH',
    name: '1inch',
    address: '0x111111111117dc0aa78b770fa6a738034120c302',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png',
  }
];

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedTokens?: Token[];
}

const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onSelect, selectedTokens = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'popular'>('popular');

  const filteredTokens = useMemo(() => {
    const selectedAddresses = selectedTokens.map(t => t.address.toLowerCase());
    
    return POPULAR_TOKENS.filter(token => {
      if (selectedAddresses.includes(token.address.toLowerCase())) return false;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        token.symbol.toLowerCase().includes(searchLower) ||
        token.name.toLowerCase().includes(searchLower) ||
        token.address.toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery, selectedTokens]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-4 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Token</h3>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name or paste address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCategory('popular')}
            className={`px-4 py-2 rounded-xl ${
              category === 'popular'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Popular Tokens
          </button>
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-xl ${
              category === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Tokens
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No tokens found</p>
            </div>
          ) : (
            filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className="w-full flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <img src={token.logoURI} alt={token.name} className="w-8 h-8 rounded-full" />
                <div className="ml-3 text-left flex-1">
                  <div className="text-gray-900 dark:text-white font-medium">{token.symbol}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{token.name}</div>
                </div>
                {token.address !== '0x0000000000000000000000000000000000000000' && (
                  <a
                    href={`https://etherscan.io/token/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenModal;