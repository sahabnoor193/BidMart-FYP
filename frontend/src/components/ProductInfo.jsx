import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Minus } from "lucide-react";
import ChatIcon from './ChatIcon';
import PropTypes from 'prop-types';


const ProductInfo = ({
  title = 'Product Title',
  country = 'Country',
  startBid = 0,
  latestBid = 0,
  totalBids = 0,
  productId,
  sellerId,
  bidIncrease
}) => {
  // const BASEURL = "https://subhan-project-backend.onrender.com";
  const BASEURL = "http://localhost:5000";
  const [multiplier, setMultiplier] = useState(1); // 1x = 5%, 2x = 10%, etc.

  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [percentage, setPercentage] = useState(1);
  const [userType, setUserType] = useState('');
const price = startBid + (startBid * (parseFloat(percentage) || 0) / 100);

  const [userId, setUserId] = useState('');
  useEffect(()=>{
  const  user = localStorage.getItem('id');
  const  userType = localStorage.getItem('userType');
     setUserType(userType);
  setUserId(user);
  },[])

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
          `${BASEURL}/api/favorites/${productId}`,
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

    if (productId) {
      checkFavoriteStatus();
    }
  }, [productId]);

  const handleBidSubmit = async () => {
    const numericBid = parseFloat(price);
    
    if (isNaN(price) || price <= startBid) {
      toast.error('Please enter a valid bid amount higher than the latest bid');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to place a bid.');
      return;
    }
  
    const toastId = toast.loading('Submitting your bid...');
  
    try {
      const response = await axios.post(
        `${BASEURL}/api/bids`,
        { productId, amount: numericBid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setBidAmount('');
      console.log('Bid response:', response.data);
  
      const message = response.data?.message || 'Bid placed successfully!';
      toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
  
      // UI updates via socket, no need to manually refresh
    } catch (error) {
      console.error('Bid error:', error);
  
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to place bid.';
  
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  


  const increment = () => {
    setMultiplier(prev => prev + 1);
  };

  const decrement = () => {
    if (multiplier > 1) setMultiplier(multiplier - 1);
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
        `${BASEURL}/api/favorites/${productId}`,
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
        <div className="flex items-center gap-4 mt-4">
      <button
 onClick={() => setPercentage((prev) => Math.max(0, Number(prev) - 1))}
        className="p-2 rounded-full border hover:bg-gray-100"
      >
        <Minus size={16} />
      </button>

      <span className="text-sm font-medium w-10 text-center">{percentage}%</span>

      <button
        onClick={() => setPercentage((prev) => Number(prev) + 1)}
        className="p-2 rounded-full border hover:bg-gray-100"
      >
        <Plus size={16} />
      </button>

      <span className="ml-4 text-md font-semibold text-gray-800">
        ${price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
      </span>
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
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBidSubmit}
            disabled={!price || parseFloat(price) <= startBid || sellerId === userId}
          >
            {sellerId === userId ? 'Product Owner Cannot Bid': userType === "seller"? "Seller Can't Bid": 'Place Bid'}
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