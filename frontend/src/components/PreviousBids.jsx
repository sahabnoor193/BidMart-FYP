import React from 'react';

const PreviousBids = ({ bids = [] }) => {
  return (
    <div className="space-y-4">
      {bids.map((bid, index) => (
        <div 
          key={index} 
          className="flex justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <span className="text-gray-800">{bid.bidder.name}</span>
          <span className="font-medium text-green-600">
            Rs:{typeof bid.amount === 'number' ? bid.amount.toFixed(2) : '0.00'}
          </span>
        </div>
      ))}
      {bids.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No previous bids found
        </div>
      )}
    </div>
  );
};

export default PreviousBids;