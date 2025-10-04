
export enum MarketSide {
  BID = 'BID',
  ASK = 'ASK',
}

export interface Quote {
  id: string;
  price: number;
  size: number;
}

export interface OrderBook {
  bids: Quote[];
  asks: Quote[];
}

export interface Trade {
  id: string;
  price: number;
  size: number;
  side: MarketSide;
  timestamp: number;
}

export interface PriceDataPoint {
  time: number;
  price: number;
}
