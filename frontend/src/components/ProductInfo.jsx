import React, { useState, useEffect } from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-[#043E52]/5 to-white backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#016A6D]/20"
    >
      <h1 className="text-2xl font-serif font-bold mb-6 text-[#043E52]">{title}</h1>
      
      <div className="space-y-6">
        {/* Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm text-[#043E52]/80">Country: </span>
            <span className="font-medium text-[#043E52]">{country}</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-[#043E52]/80">Start Bid: </span>
            <span className="font-medium text-[#043E52]">PKR {startBid.toFixed(2)}</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-[#043E52]/80">Latest Bid: </span>
            <span className="font-medium text-[#016A6D]">PKR {latestBid.toFixed(2)}</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-[#043E52]/80">Total Bids: </span>
            <span className="font-medium text-[#043E52]">{totalBids}</span>
          </div>
        </div>

        {/* Bid Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#043E52]/5 rounded-full p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPercentage(prev => Math.max(0, prev - 1))}
              className="p-2 rounded-full hover:bg-[#016A6D]/10"
            >
              <Minus size={16} className="text-[#043E52]" />
            </motion.button>
            
            <span className="text-sm font-medium w-8 text-center text-[#043E52]">
              {percentage}%
            </span>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPercentage(prev => prev + 1)}
              className="p-2 rounded-full hover:bg-[#016A6D]/10"
            >
              <Plus size={16} className="text-[#043E52]" />
            </motion.button>
          </div>
          
          <span className="text-lg font-semibold text-[#016A6D]">
            PKR {price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2.5 rounded-xl transition-colors ${
              isFavorite 
                ? 'bg-[#E16A3D]/10 text-[#E16A3D]'
                : 'hover:bg-[#016A6D]/10 text-[#043E52]'
            }`}
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>

          <ChatIcon sellerId={sellerId} />

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            onClick={handleBidSubmit}
            disabled={!price || parseFloat(price) <= startBid || sellerId === userId}
          >
            {sellerId === userId ? 'Product Owner' : userType === "seller" ? "Seller Can't Bid" : 'Place Bid'}
          </motion.button>
        </div>
      </div>
    </motion.div>
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