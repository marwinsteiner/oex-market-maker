
import React from 'react';

interface HeaderProps {
  isRunning: boolean;
}

const Header: React.FC<HeaderProps> = ({ isRunning }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-emerald-400">E-Mini S&P 100 Market Maker Sim</h1>
      <div className="flex items-center space-x-3">
        <span className="text-lg font-semibold">Status:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          isRunning 
            ? 'bg-green-500 text-white animate-pulse' 
            : 'bg-red-500 text-white'
        }`}>
          {isRunning ? 'LIVE' : 'STOPPED'}
        </span>
      </div>
    </div>
  );
};

export default Header;
