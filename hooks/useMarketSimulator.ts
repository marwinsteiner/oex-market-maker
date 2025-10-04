
import { useState, useRef, useCallback, useEffect } from 'react';
import type { OrderBook, Quote, Trade, PriceDataPoint } from '../types';
import { MarketSide } from '../types';
import {
  INITIAL_PRICE,
  TICK_SIZE,
  GAME_SPEED_MS,
  USER_ID,
  NUM_AI_MAKERS,
  MAKER_SPREAD_MIN,
  MAKER_SPREAD_MAX,
  TAKER_PROBABILITY,
  PRICE_VOLATILITY,
  MAX_TRADES_VISIBLE,
  MAX_PRICE_HISTORY,
} from '../constants';

interface GameState {
  orderBook: OrderBook;
  trades: Trade[];
  priceHistory: PriceDataPoint[];
}

interface UserState {
  position: number;
  pnl: number;
  userQuote: { bid: Quote | null; ask: Quote | null };
}

export const useMarketSimulator = () => {
  const [isGameRunning, setIsGameRunning] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    orderBook: { bids: [], asks: [] },
    trades: [],
    priceHistory: [{ time: Date.now(), price: INITIAL_PRICE }],
  });

  const [userState, setUserState] = useState<UserState>({
    position: 0,
    pnl: 0,
    userQuote: { bid: null, ask: null },
  });

  const fairValueRef = useRef(INITIAL_PRICE);
  const userQuoteRef = useRef(userState.userQuote);
  const positionRef = useRef(0);
  const cashRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  
  const updateUserQuote = useCallback((bidPrice: number, bidSize: number, askPrice: number, askSize: number) => {
      const newQuote = {
          bid: bidSize > 0 ? { id: USER_ID, price: bidPrice, size: bidSize } : null,
          ask: askSize > 0 ? { id: USER_ID, price: askPrice, size: askSize } : null,
      };
      userQuoteRef.current = newQuote;
      setUserState(prev => ({ ...prev, userQuote: newQuote }));
  }, []);

  const calculatePnl = useCallback(() => {
    const markToMarketPnl = (fairValueRef.current * positionRef.current) + cashRef.current;
    setUserState(prev => ({...prev, pnl: markToMarketPnl, position: positionRef.current }));
  }, []);

  const runGameTick = useCallback(() => {
    // 1. Update Fair Value (Random Walk)
    fairValueRef.current += (Math.random() - 0.5) * PRICE_VOLATILITY * TICK_SIZE * 2;
    fairValueRef.current = Math.round(fairValueRef.current / TICK_SIZE) * TICK_SIZE;

    setGameState(prev => ({
        ...prev,
        priceHistory: [...prev.priceHistory.slice(-MAX_PRICE_HISTORY + 1), { time: Date.now(), price: fairValueRef.current }]
    }));

    // 2. AI Market Makers generate quotes
    const newOrderBook: OrderBook = { bids: [], asks: [] };
    for (let i = 0; i < NUM_AI_MAKERS; i++) {
        const spread = (MAKER_SPREAD_MIN + Math.random() * (MAKER_SPREAD_MAX - MAKER_SPREAD_MIN)) * TICK_SIZE;
        const midPriceOffset = (Math.random() - 0.5) * TICK_SIZE * 2;
        const center = fairValueRef.current + midPriceOffset;
        
        const bidPrice = Math.floor((center - spread / 2) / TICK_SIZE) * TICK_SIZE;
        const askPrice = Math.ceil((center + spread / 2) / TICK_SIZE) * TICK_SIZE;
        const size = Math.ceil(Math.random() * 5) * 5;

        newOrderBook.bids.push({ id: `AI_${i}_B`, price: bidPrice, size });
        newOrderBook.asks.push({ id: `AI_${i}_A`, price: askPrice, size });
    }

    // 3. Add User's quote to the order book
    if (userQuoteRef.current.bid) newOrderBook.bids.push(userQuoteRef.current.bid);
    if (userQuoteRef.current.ask) newOrderBook.asks.push(userQuoteRef.current.ask);

    // Sort the order book
    newOrderBook.bids.sort((a, b) => b.price - a.price);
    newOrderBook.asks.sort((a, b) => a.price - b.price);

    // 4. Simulate Takers
    const newTrades: Trade[] = [];
    if (Math.random() < TAKER_PROBABILITY) {
        const isTakerBuy = Math.random() > 0.5;
        const tradeSize = Math.ceil(Math.random() * 3) * 5;

        if (isTakerBuy && newOrderBook.asks.length > 0) {
            const bestAsk = newOrderBook.asks[0];
            const executedSize = Math.min(tradeSize, bestAsk.size);
            
            const newTrade: Trade = { id: `T_${Date.now()}`, price: bestAsk.price, size: executedSize, side: MarketSide.ASK, timestamp: Date.now() };
            newTrades.push(newTrade);
            bestAsk.size -= executedSize;

            if (bestAsk.id === USER_ID) {
                cashRef.current += executedSize * bestAsk.price;
                positionRef.current -= executedSize;
            }
        } else if (!isTakerBuy && newOrderBook.bids.length > 0) {
            const bestBid = newOrderBook.bids[0];
            const executedSize = Math.min(tradeSize, bestBid.size);

            const newTrade: Trade = { id: `T_${Date.now()}`, price: bestBid.price, size: executedSize, side: MarketSide.BID, timestamp: Date.now() };
            newTrades.push(newTrade);
            bestBid.size -= executedSize;

            if (bestBid.id === USER_ID) {
                cashRef.current -= executedSize * bestBid.price;
                positionRef.current += executedSize;
            }
        }
    }
    
    // 5. Update state
    setGameState(prev => ({
        ...prev,
        orderBook: {
            bids: newOrderBook.bids.filter(q => q.size > 0),
            asks: newOrderBook.asks.filter(q => q.size > 0)
        },
        trades: [...newTrades, ...prev.trades].slice(0, MAX_TRADES_VISIBLE)
    }));

    calculatePnl();
  }, [calculatePnl]);

  const startGame = useCallback(() => {
    if (gameLoopRef.current) return;
    setIsGameRunning(true);
    gameLoopRef.current = window.setInterval(runGameTick, GAME_SPEED_MS);
  }, [runGameTick]);

  const stopGame = useCallback(() => {
    if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
    }
    setIsGameRunning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  return {
    gameState,
    userState,
    isGameRunning,
    actions: {
        startGame,
        stopGame,
        updateUserQuote
    }
  };
};
