export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  balance?: string;
}

export interface WalletInfo {
  address: string;
  balance: string;
  isConnected: boolean;
}