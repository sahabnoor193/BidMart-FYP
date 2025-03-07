
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const ProductInfo = ({
  title = 'Product Title',
  country = 'Country',
  startBid = 0,
  latestBid = 0,
  totalBids = 0,
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBidSubmit = () => {
    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid) || numericBid <= latestBid) {
      alert('Please enter a valid bid amount higher than the latest bid');
      return;
    }
    // Handle bid submission logic here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">Country</span>
          <span className="font-medium text-gray-800">{country}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">Start Bid</span>
          <span className="font-medium text-gray-800">${startBid.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">Latest Bid</span>
          <span className="font-medium text-green-600">${latestBid.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">Total Bids</span>
          <span className="font-medium text-gray-800">{totalBids}</span>
        </div>
        
        <div className="flex gap-2 mt-6">
          <div className="flex-1 flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500 bg-gray-50">$</span>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="flex-1 px-2 py-2 focus:outline-none"
              placeholder="Enter bid amount"
              min={latestBid + 1}
              step="1"
            />
            <span className="px-3 text-gray-500 bg-gray-50">.00</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className={`p-2 border rounded-lg transition-colors duration-200 ${
              isFavorite 
                ? 'bg-red-50 border-red-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label="Add to favorites"
          >
            <Heart 
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
              }`} 
            />
          </button>
          <button 
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBidSubmit}
            disabled={!bidAmount || parseFloat(bidAmount) <= latestBid}
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;