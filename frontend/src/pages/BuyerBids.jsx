import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiDollarSign, FiUser, FiStar, FiCheckCircle } from 'react-icons/fi';

// Add these variants at the top of the file
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 120 }
  }
};

const BuyerBids = () => {
     const [buyerData, setBuyerData] = useState({
        requestedBids: 0,
        acceptedBids: 0,
        favourites: 0,
        bidHistory: []
      });
      const [stateChange, setStateChange] = useState(false);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    console.log('[Logout] Clearing local storage and redirecting');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/signin');
  }, [navigate]);
  const updateBidStatus = async (bidId) => {
    const loadingToast = toast.loading("Updating bid status...");
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.update(loadingToast, {
          render: "No auth token found.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
  
      const { data } = await axios.put(
        `http://localhost:5000/api/bids/${bidId}/status`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.update(loadingToast, {
        render: "Bid status updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
     setStateChange(!stateChange);
      return data;
  
    } catch (error) {
      console.error('Error Updating Bid:', error);
  
      toast.update(loadingToast, {
        render: "Failed to update bid status.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
  
      return null;
    }
  };
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('[Auth Check] Checking authentication status');
        if (!token) {
          console.warn('[Auth Redirect] No token found, redirecting to login');
          navigate('/login');
          return;
        }
    
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.warn('[Auth Check] Token expired');
            handleLogout();
            return;
          }
        } catch (error) {
          console.error('[Auth Check] Invalid token:', error);
          handleLogout();
          return;
        }
    
        const fetchUserData = async () => {
          console.log('[API Call] Starting data fetching process');
          try {
            const token = localStorage.getItem('token');
            const dashboardResponse = await axios.get("http://localhost:5000/api/buyer/dashboard", {
              headers: { Authorization: `Bearer ${token}` }
            });
            setBuyerData(dashboardResponse.data);
    
            const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
              headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('User profile data fetched:', profileResponse.data);
    
            setLoading(false);
          } catch (err) {
            console.error('[Fetch Error] Error fetching data:', err.response?.data || err.message);
            setError('Failed to load data. Please try again later.');
            if (err.response?.status === 401) {
              localStorage.removeItem('token');
            //   handleLogout();
            }
          }
        };
        
        fetchUserData();
      }, [stateChange]);

   const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-[#FFAA5D]/20 text-[#E16A3D]';
      case 'accepted':
        return 'bg-[#016A6D]/20 text-[#016A6D]';
      case 'rejected':
        return 'bg-[#E16A3D]/20 text-[#E16A3D]';
      case 'payment pending':
        return 'bg-[#FFAA5D]/20 text-[#E16A3D]';
      case 'payment success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Gradient Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Breadcrumbs */}
        <motion.div variants={itemVariants} className="mb-8">
          <nav className="flex items-center text-[#043E52]/80 space-x-2">
          <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
          />
            <button 
              onClick={() => navigate('/dashboard')} 
              className="hover:text-[#FFAA5D] transition-colors"
            >
              Dashboard
            </button>
            <FiArrowRight className="text-[#FFAA5D]" />
            <span className="font-medium text-[#043E52]">Bids</span>
          </nav>
        </motion.div>

        {/* Bid History Table */}
        <motion.div variants={itemVariants} className="rounded-xl shadow-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 overflow-hidden">
          <h2 className="text-2xl font-bold text-[#043E52] p-6 border-b border-[#016A6D]/20 flex items-center gap-2">
            <FiClock className="text-[#FFAA5D]" />
            Bid History
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#043E52]/5">
                <tr>
                  {['Item', 'Bid Amount', 'Payment Date', 'Seller Profile', 'Status', 'Actions'].map((header, index) => (
                    <th 
                      key={index}
                      className="py-4 px-6 text-left text-[#043E52] font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#016A6D]/20">
                {buyerData.bidHistory?.length > 0 ? (
                  buyerData.bidHistory.map((bid, index) => (
                    <motion.tr 
                      key={index}
                      variants={itemVariants}
                      className="hover:bg-[#016A6D]/5 transition-colors"
                    >
                      <td className="py-4 px-6 text-[#043E52] font-medium">{bid.itemName}</td>
                      <td className="py-4 px-6 text-[#016A6D] font-medium">
                        <div className="flex items-center gap-2">
                          PKR {bid.bidAmount}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#FFAA5D]/10 text-[#E16A3D]">
                          {bid.paymentDate ? 
                            new Date(bid.paymentDate).toLocaleDateString() : 
                            'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#016A6D]/10 rounded-full flex items-center justify-center">
                            <FiUser className="text-[#016A6D]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#043E52]">{bid.sellerName}</p>
                            <p className="text-sm text-[#043E52]/60">{bid.sellerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full ${getStatusColor(bid.bidStatus)}`}>
                          {bid.bidStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {bid.bidStatus.toLowerCase() === 'payment pending' ? (
                          <div className="flex gap-2">
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={bid.checkoutUrl}
                              className="px-4 py-2 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl"
                            >
                              Pay Now
                            </motion.a>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateBidStatus(bid.bidId)}
                              className="px-4 py-2 bg-[#E16A3D] text-white rounded-xl"
                            >
                              Reject
                            </motion.button>
                          </div>
                        ) : bid.bidStatus.toLowerCase() === 'payment success' && bid.reviewInfo ? (
                          <div className="flex gap-2">
                            {bid.reviewInfo.canReview ? (
                              <Link
                                to={`/leave-review/${bid.sellerId}/${bid.productId}/${bid.bidId}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl hover:shadow-lg transition-all"
                              >
                                <FiStar className="w-4 h-4" />
                                Leave Review
                              </Link>
                            ) : bid.reviewInfo.hasReviewed ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <FiCheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Review Submitted</span>
                              </div>
                            ) : (
                              <span className="text-[#043E52]/60">No action required</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#043E52]/60">No action required</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr variants={itemVariants}>
                    <td colSpan="6" className="py-8 text-center text-[#043E52]/60">
                      No bid history available
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BuyerBids;