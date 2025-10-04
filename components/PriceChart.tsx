
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PriceDataPoint } from '../types';

interface PriceChartProps {
  data: PriceDataPoint[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Waiting for market data...</div>;
  }

  const lastPrice = data[data.length - 1].price;
  const yDomain = [lastPrice - 5, lastPrice + 5];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
            dataKey="time" 
            tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString()} 
            stroke="#9ca3af"
            dy={10}
        />
        <YAxis 
            domain={yDomain} 
            tickFormatter={(price) => price.toFixed(2)} 
            stroke="#9ca3af"
            dx={-10}
            allowDataOverflow={true}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
          labelStyle={{ color: '#d1d5db' }}
          formatter={(value: number) => [value.toFixed(2), 'Price']}
          labelFormatter={(label) => new Date(label).toLocaleTimeString()}
        />
        <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#2dd4bf" 
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
