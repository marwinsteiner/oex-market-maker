import React from 'react';
import { TICK_SIZE } from '../constants';

interface SpreadVisualizerProps {
  bestBid: number | null;
  bestAsk: number | null;
  lastPrice: number | null;
}

const SpreadVisualizer: React.FC<SpreadVisualizerProps> = ({ bestBid, bestAsk, lastPrice }) => {
  if (bestBid === null || bestAsk === null || lastPrice === null || bestBid >= bestAsk) {
    return <div className="flex items-center justify-center h-full text-gray-500">Waiting for market data...</div>;
  }

  // Define a visible range with some padding
  const paddingTicks = 4;
  const viewMin = bestBid - (TICK_SIZE * paddingTicks);
  const viewMax = bestAsk + (TICK_SIZE * paddingTicks);
  const totalViewRange = viewMax - viewMin;
  
  if (totalViewRange <= 0) {
     return <div className="flex items-center justify-center h-full text-gray-500">Market spread is invalid.</div>;
  }

  const getPositionPercent = (price: number) => {
    // Clamp the value between 0 and 100 to prevent markers from going off-screen
    const percent = ((price - viewMin) / totalViewRange) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const bidPosition = getPositionPercent(bestBid);
  const askPosition = getPositionPercent(bestAsk);
  const lastPricePosition = getPositionPercent(lastPrice);
  
  const spread = bestAsk - bestBid;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <div className="relative w-full" style={{ height: '80px' }}>
        {/* Price Bar */}
        <div className="absolute top-1/2 w-full h-2 bg-gray-700 rounded-full transform -translate-y-1/2">
           <div 
             className="absolute h-full bg-gradient-to-r from-green-500/50 to-green-500 rounded-l-full"
             style={{ left: 0, width: `${bidPosition}%` }}
           />
           <div 
             className="absolute h-full bg-gradient-to-l from-red-500/50 to-red-500 rounded-r-full"
             style={{ right: 0, width: `${100 - askPosition}%` }}
           />
        </div>

        {/* Bid Marker */}
        <div className="absolute top-1/2" style={{ left: `${bidPosition}%`, transform: 'translateX(-50%)' }}>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-green-400">{bestBid.toFixed(2)}</span>
            <span className="text-xs text-gray-400">Best Bid</span>
            <div className="w-0.5 h-6 bg-green-400 -mt-1" />
          </div>
        </div>
        
        {/* Ask Marker */}
        <div className="absolute top-1/2" style={{ left: `${askPosition}%`, transform: 'translateX(-50%)' }}>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-red-400">{bestAsk.toFixed(2)}</span>
            <span className="text-xs text-gray-400">Best Ask</span>
            <div className="w-0.5 h-6 bg-red-400 -mt-1" />
          </div>
        </div>

        {/* Last Price Marker */}
        <div className="absolute top-1/2 transition-all duration-200 ease-out" style={{ left: `${lastPricePosition}%`, transform: 'translateX(-50%)' }}>
            <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-300 mb-1 shadow-lg" />
                <span className="text-xs font-semibold text-yellow-300">{lastPrice.toFixed(2)}</span>
            </div>
        </div>
      </div>

       <div className="mt-8 text-center">
          <span className="text-lg text-gray-300">Spread: </span>
          <span className="text-xl font-bold text-cyan-400">{spread.toFixed(2)}</span>
          <span className="text-lg text-gray-400 ml-2">({(spread / TICK_SIZE).toFixed(0)} ticks)</span>
      </div>
    </div>
  );
};

export default SpreadVisualizer;
