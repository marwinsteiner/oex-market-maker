
import React from 'react';
import type { Trade } from '../types';
import { MarketSide } from '../types';

interface TradeFeedProps {
  trades: Trade[];
}

const TradeFeed: React.FC<TradeFeedProps> = ({ trades }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-3 text-center text-gray-300 border-b border-gray-600 pb-2">Trade Feed</h2>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-800">
            <tr className="text-gray-400">
              <th className="text-left p-1.5 font-medium">Time</th>
              <th className="text-right p-1.5 font-medium">Price</th>
              <th className="text-right p-1.5 font-medium">Size</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const tradeColor = trade.side === MarketSide.BID ? 'text-green-400' : 'text-red-400';
              return (
                <tr key={trade.id} className="border-b border-gray-700/50">
                  <td className="p-1.5 text-gray-500">{new Date(trade.timestamp).toLocaleTimeString()}</td>
                  <td className={`p-1.5 text-right font-semibold ${tradeColor}`}>{trade.price.toFixed(2)}</td>
                  <td className="p-1.5 text-right text-yellow-300">{trade.size}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeFeed;
