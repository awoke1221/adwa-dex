import React from 'react';
import { X, Info } from 'lucide-react';

interface SwapSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: string;
  setSlippage: (value: string) => void;
  deadline: string;
  setDeadline: (value: string) => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({
  isOpen,
  onClose,
  slippage,
  setSlippage,
  deadline,
  setDeadline,
}) => {
  if (!isOpen) return null;

  const commonSlippages = ['0.1', '0.5', '1.0'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-4 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Settings</h3>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-900 dark:text-white font-medium">Slippage tolerance</span>
              <Info size={16} className="text-gray-400" />
            </div>
            <div className="flex gap-2 mb-2">
              {commonSlippages.map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg ${
                    slippage === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <div className="relative flex-1">
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Custom"
                />
                <span className="absolute right-3 top-1 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-900 dark:text-white font-medium">Transaction deadline</span>
              <Info size={16} className="text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="number"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1 text-gray-500 dark:text-gray-400">minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapSettings;