import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from './context/WalletContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SwapInterface from './components/SwapInterface';
import PoolInterface from './components/PoolInterface';
import StakingInterface from './components/StakingInterface';
import ProfilePage from './components/Profile/ProfilePage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet } = useWallet();
  
  if (!wallet.isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-lg mb-8">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-2">
                        Trade tokens instantly
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        Swap tokens with the most efficient decentralized exchange protocol
                      </p>
                    </div>
                    <SwapInterface />
                  </div>
                }
              />
              <Route path="/pool" element={<PoolInterface />} />
              <Route path="/staking" element={<StakingInterface />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;