import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Wallet, Menu, LogOut, User, Sun, Moon, Coins } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import { connectWallet, disconnect } from "../store/slices/walletSlice";
import { useWalletEvents } from "../hooks/useWalletEvents";
import { useTheme } from "../context/ThemeContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { address, balance, isConnected, loading } = useAppSelector(
    (state) => state.wallet
  );
  const { theme, toggleTheme } = useTheme();

  // Setup wallet event listeners
  useWalletEvents(address);

  const handleConnect = async () => {
    dispatch(connectWallet());
  };

  const handleDisconnect = () => {
    dispatch(disconnect());
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-blue-500 text-xl font-bold">
                Adwa DEX{" "}
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/")
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Swap
                </Link>
                <Link
                  to="/pool"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/pool")
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Pool
                </Link>
                <Link
                  to="/staking"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/staking")
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Coins size={16} />
                    Staking
                  </div>
                </Link>
                {isConnected && (
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/profile")
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      Profile
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isConnected ? (
              <>
                <div className="hidden md:block">
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    Balance: {balance} ETH
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatAddress(address)}
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Disconnect</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Wallet size={18} />
                <span>{loading ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}
            <button className="md:hidden ml-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
