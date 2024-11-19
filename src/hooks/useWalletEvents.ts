import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { disconnect, updateBalance } from '../store/slices/walletSlice';

export const useWalletEvents = (address: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!window.ethereum || !address) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        dispatch(disconnect());
      } else if (accounts[0] !== address) {
        window.location.reload();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleMessage = ({ type, data }: { type: string; data: any }) => {
      if (type === 'eth_subscription' && data.method === 'eth_subscription') {
        dispatch(updateBalance(address));
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('message', handleMessage);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('message', handleMessage);
    };
  }, [address, dispatch]);
};