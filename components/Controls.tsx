
import React, { useState, useEffect } from 'react';
import type { Quote } from '../types';
import { TICK_SIZE } from '../constants';

interface ControlsProps {
  pnl: number;
  position: number;
  initialQuote: { bid: Quote | null; ask: Quote | null };
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onUpdateQuote: (bidPrice: number, bidSize: number, askPrice: number, askSize: number) => void;
  lastPrice: number;
}

const PnlDisplay: React.FC<{ pnl: number }> = React.memo(({ pnl }) => {
  const pnlColor = pnl > 0 ? 'text-green-400' : pnl < 0 ? 'text-red-400' : 'text-gray-300';
  return <span className={`text-2xl font-bold ${pnlColor}`}>{pnl.toFixed(2)}</span>;
});

const PositionDisplay: React.FC<{ position: number }> = React.memo(({ position }) => {
    const posColor = position > 0 ? 'text-blue-400' : position < 0 ? 'text-orange-400' : 'text-gray-300';
    return <span className={`text-2xl font-bold ${posColor}`}>{position}</span>;
});

const QuoteInput: React.FC<{ label: string; price: number; size: number; onPriceChange: (p: number) => void; onSizeChange: (s: number) => void; disabled: boolean }> = 
({ label, price, size, onPriceChange, onSizeChange, disabled }) => {

    const handlePriceAdjust = (amount: number) => {
        onPriceChange(parseFloat((price + amount).toFixed(2)));
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold">{label}</label>
            <div className="flex items-center space-x-2">
                <button onClick={() => handlePriceAdjust(-TICK_SIZE)} className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50" disabled={disabled}>-</button>
                <input type="number" value={price.toFixed(2)} onChange={e => onPriceChange(parseFloat(e.target.value))} step={TICK_SIZE} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-center" disabled={disabled} />
                <button onClick={() => handlePriceAdjust(TICK_SIZE)} className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50" disabled={disabled}>+</button>
            </div>
            <input type="number" value={size} onChange={e => onSizeChange(parseInt(e.target.value))} step="5" className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-center" placeholder="Size" disabled={disabled} />
        </div>
    );
};


const Controls: React.FC<ControlsProps> = ({ pnl, position, initialQuote, isRunning, onStart, onStop, onUpdateQuote, lastPrice }) => {
  const [bidPrice, setBidPrice] = useState(lastPrice - TICK_SIZE * 2);
  const [bidSize, setBidSize] = useState(10);
  const [askPrice, setAskPrice] = useState(lastPrice + TICK_SIZE * 2);
  const [askSize, setAskSize] = useState(10);

  useEffect(() => {
    if (!isRunning) {
        setBidPrice(lastPrice > 0 ? lastPrice - TICK_SIZE * 2 : 4499.50);
        setAskPrice(lastPrice > 0 ? lastPrice + TICK_SIZE * 2 : 4500.50);
    }
  }, [lastPrice, isRunning]);

  const handleUpdate = () => {
    onUpdateQuote(bidPrice, bidSize, askPrice, askSize);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
      {/* P&L and Position */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-center p-2 bg-gray-900 rounded-lg">
          <span className="text-sm text-gray-400">P&L</span>
          <PnlDisplay pnl={pnl} />
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-900 rounded-lg">
          <span className="text-sm text-gray-400">Position</span>
          <PositionDisplay position={position} />
        </div>
      </div>

      {/* Quote Inputs */}
      <QuoteInput label="Your Bid" price={bidPrice} size={bidSize} onPriceChange={setBidPrice} onSizeChange={setBidSize} disabled={!isRunning} />
      <QuoteInput label="Your Ask" price={askPrice} size={askSize} onPriceChange={setAskPrice} onSizeChange={setAskSize} disabled={!isRunning} />

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleUpdate}
          disabled={!isRunning}
          className="w-full py-3 text-lg font-bold bg-blue-600 rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Update Quote
        </button>
        {isRunning ? (
          <button onClick={onStop} className="w-full py-3 text-lg font-bold bg-red-600 rounded hover:bg-red-500 transition-colors">
            Stop Game
          </button>
        ) : (
          <button onClick={onStart} className="w-full py-3 text-lg font-bold bg-green-600 rounded hover:bg-green-500 transition-colors">
            Start Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Controls;
