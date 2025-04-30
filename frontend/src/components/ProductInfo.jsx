import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import axios from 'axios';
import ChatIcon from './ChatIcon';

const ProductInfo = ({
  title = 'Product Title',
  country = 'Country',
  startBid = 0,
  latestBid = 0,
  totalBids = 0,
  productId,
  sellerId,
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlacedBid, setHasPlacedBid] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        console.log('[ProductInfo] Checking favorite status for product:', productId);
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('[ProductInfo] No token found, user not logged in');
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/favorites/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('[ProductInfo] Favorite status response:', response.data);
        setIsFavorite(response.data.isFavorited);
      } catch (error) {
        console.error('[ProductInfo] Error checking favorite status:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          console.log('[ProductInfo] User not authenticated');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const checkBidStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Check if user has already placed a bid
        const response = await axios.get(
          `http://localhost:5000/api/bids/product/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        const hasBid = response.data.some(bid => 
          bid.bidderId._id === userId && 
          (bid.status === 'pending' || bid.status === 'accepted')
        );
        
        setHasPlacedBid(hasBid);
      } catch (error) {
        console.error('Error checking bid status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      checkFavoriteStatus();
      checkBidStatus();
    }
  }, [productId]);

  const handleBidSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place a bid');
        return;
      }

      const numericBid = parseFloat(bidAmount);
      if (isNaN(numericBid) || numericBid <= latestBid) {
        alert('Please enter a valid bid amount higher than the latest bid');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/bids',
        {
          productId,
          amount: numericBid
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        alert('Bid placed successfully!');
        setBidAmount('');
        // Refresh the page to show updated bid information
        window.location.reload();
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      alert(error.response?.data?.message || 'Failed to place bid. Please try again.');
    }
  };

  const toggleFavorite = async () => {
    try {
      console.log('[ProductInfo] Toggling favorite for product:', productId);
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('[ProductInfo] No token found, redirecting to login');
        // You might want to redirect to login here
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/favorites/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[ProductInfo] Toggle favorite response:', response.data);
      setIsFavorite(response.data.isFavorited);
    } catch (error) {
      console.error('[ProductInfo] Error toggling favorite:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.log('[ProductInfo] User not authenticated');
        // You might want to redirect to login here
      }
    }
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
              placeholder={hasPlacedBid ? "You have already placed a bid" : "Enter bid amount"}
              min={latestBid + 1}
              step="1"
              disabled={hasPlacedBid}
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
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={toggleFavorite}
            disabled={isLoading}
            aria-label="Add to favorites"
          >
            <Heart 
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
              }`} 
            />
          </button>
                  {/* Add ChatIcon here */}
        <ChatIcon sellerId={sellerId} />

          <button 
            className={`flex-1 py-2 rounded-lg transition-colors duration-200 ${
              hasPlacedBid 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            onClick={handleBidSubmit}
            disabled={!bidAmount || parseFloat(bidAmount) <= latestBid || hasPlacedBid}
          >
            {hasPlacedBid ? "Bid Placed" : "Place Bid"}
          </button>
        </div>
      </div>
    </div>
  );
};

ProductInfo.propTypes = {
  title: PropTypes.string,
  country: PropTypes.string,
  startBid: PropTypes.number,
  latestBid: PropTypes.number,
  totalBids: PropTypes.number,
  productId: PropTypes.string.isRequired,
  sellerId: PropTypes.string.isRequired
};

export default ProductInfo;