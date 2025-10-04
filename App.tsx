import React from 'react';
import { useMarketSimulator } from './hooks/useMarketSimulator';
import Header from './components/Header';
import OrderBook from './components/OrderBook';
import TradeFeed from './components/TradeFeed';
import Controls from './components/Controls';
import SpreadVisualizer from './components/SpreadVisualizer';
import { USER_ID, INITIAL_PRICE } from './constants';

export default function App(): React.ReactElement {
  const {
    gameState,
    userState,
    isGameRunning,
    actions,
  } = useMarketSimulator();

  const { orderBook, trades, priceHistory } = gameState;
  const { position, pnl, userQuote } = userState;
  const { startGame, stopGame, updateUserQuote } = actions;

  const bestBidPrice = orderBook.bids.length > 0 ? orderBook.bids[0].price : null;
  const bestAskPrice = orderBook.asks.length > 0 ? orderBook.asks[0].price : null;
  const lastFairPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : INITIAL_PRICE;
  const lastTradePrice = trades.length > 0 ? trades[0].price : null;
  const lastPrice = lastTradePrice ?? lastFairPrice;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col p-4 space-y-4">
      <Header isRunning={isGameRunning} />
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left Column: Order Book */}
        <div className="lg:col-span-1">
          <OrderBook 
            bids={orderBook.bids} 
            asks={orderBook.asks} 
            userId={USER_ID} 
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Top section: Chart & Trade Feed */}
          <div className="flex-grow grid grid-cols-1 xl:grid-cols-2 gap-4" style={{ minHeight: '300px' }}>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col">
              <h2 className="text-xl font-bold mb-3 text-center text-gray-300 border-b border-gray-600 pb-2">Market Spread</h2>
              <div className="flex-grow">
                 <SpreadVisualizer 
                   bestBid={bestBidPrice}
                   bestAsk={bestAskPrice}
                   lastPrice={lastPrice}
                 />
              </div>
            </div>
            <TradeFeed trades={trades} />
          </div>

          {/* Bottom section: Controls */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <Controls
              pnl={pnl}
              position={position}
              initialQuote={userQuote}
              isRunning={isGameRunning}
              onStart={startGame}
              onStop={stopGame}
              onUpdateQuote={updateUserQuote}
              lastPrice={lastPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}