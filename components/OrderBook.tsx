
import React from 'react';
import type { Quote } from '../types';

interface OrderBookProps {
  bids: Quote[];
  asks: Quote[];
  userId: string;
}

const OrderBookRow: React.FC<{ quote: Quote; isUserQuote: boolean; type: 'bid' | 'ask' }> = ({ quote, isUserQuote, type }) => {
  const priceColor = type === 'bid' ? 'text-green-400' : 'text-red-400';
  const bgColor = isUserQuote ? 'bg-blue-900/50' : 'hover:bg-gray-700/50';

  return (
    <tr className={`border-b border-gray-700/50 transition-colors duration-200 ${bgColor}`}>
      <td className={`p-1.5 text-right font-semibold ${priceColor}`}>{quote.price.toFixed(2)}</td>
      <td className="p-1.5 text-right text-yellow-300">{quote.size}</td>
    </tr>
  );
};


const OrderBook: React.FC<OrderBookProps> = ({ bids, asks, userId }) => {
  const renderRows = (quotes: Quote[], type: 'bid' | 'ask') => {
    return quotes.slice(0, 15).map((quote) => (
      <OrderBookRow
        key={`${quote.id}-${quote.price}`}
        quote={quote}
        isUserQuote={quote.id === userId}
        type={type}
      />
    ));
  };
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-3 text-center text-gray-300 border-b border-gray-600 pb-2">Order Book</h2>
      <div className="grid grid-cols-1 gap-4 flex-grow overflow-y-auto">
        <div className="overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="text-gray-400">
                  <th className="text-right p-1.5 font-medium">BID</th>
                  <th className="text-right p-1.5 font-medium">SIZE</th>
                </tr>
              </thead>
              <tbody>{renderRows(bids, 'bid')}</tbody>
            </table>
        </div>
        <div className="overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="text-gray-400">
                  <th className="text-right p-1.5 font-medium">ASK</th>
                  <th className="text-right p-1.5 font-medium">SIZE</th>
                </tr>
              </thead>
              <tbody>{renderRows(asks, 'ask')}</tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
