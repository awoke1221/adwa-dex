import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { WalletInfo } from '../types';

interface WalletContextType {
  wallet: WalletInfo;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    balance: '0',
    isConnected: false,
  });

  const updateBalance = useCallback(async () => {
    if (wallet.address && window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [wallet.address, 'latest'],
        });
        setWallet(prev => ({
          ...prev,
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
        }));
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    }
  }, [wallet.address]);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });

        setWallet({
          address: accounts[0],
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
          isConnected: true,
        });
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      address: '',
      balance: '0',
      isConnected: false,
    });
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            setWallet({
              address: accounts[0],
              balance: (parseInt(balance, 16) / 1e18).toFixed(4),
              isConnected: true,
            });
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== wallet.address) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [wallet.address, connectWallet, disconnectWallet]);

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet, updateBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};