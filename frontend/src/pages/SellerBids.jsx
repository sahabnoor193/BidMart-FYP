import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, X, Loader2, ListCollapse } from 'lucide-react';
import { motion } from 'framer-motion';
import { FiArrowRight } from "react-icons/fi"; // Specifically importing FiArrowRight for breadcrumb

const SellerBids = () => {
  const navigate = useNavigate();
  const [activeProducts, setActiveProducts] = useState([]);
  const [bids, setBids] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [displayBids, setDisplayBids] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Framer Motion Variants for page entry and item staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/seller/products', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filter only active or scheduled products since the draft button is removed
        const fetchedProducts = response.data.filter(p => p.status === 'active' || p.status === 'scheduled');
        setActiveProducts(fetchedProducts);

      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleFetchBids = async (productId) => {
    setSelectedProductId(productId);
    setBidLoading(true);
    try {
      setDisplayBids(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/bids/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to fetch bids for this product.');
      setDisplayBids(false);
    } finally {
      setBidLoading(false);
    }
  };

  const handleAcceptBid = async (bidId, productId, bidderEmail, bidderName) => {
    const toastId = toast.loading('Accepting bid...');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bids/accept`, {
        bidId: bidId,
        productId: productId,
        bidderEmail: bidderEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.update(toastId, {
        render: `Payment Link has been sent to ${bidderName}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setDisplayBids(false);
      setActiveProducts(prevProducts =>
        prevProducts.map(p => p._id === productId ? { ...p, status: 'sold' } : p)
      );
    } catch (error) {
      const message = error?.response?.data?.message || "An unexpected error occurred.";
      console.error('Error accepting bid:', message);

      const isStripeCapabilityError = message.includes("capabilities enabled");

      if (isStripeCapabilityError) {
        toast.update(toastId, {
          render: `Seller's Stripe account isn't ready to receive payments. Ask them to complete onboarding.`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toastId, {
          render: `Failed to accept bid: ${message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  const handleReject = (bidId) => {
    console.log(`Rejecting bid with ID: ${bidId}`);
    toast.info('Bid rejection functionality not yet implemented.');
  };

  const handleViewProductDetails = (productId) => {
    navigate(`/dashboard/products/${productId}`);
  };


  const renderProductCard = (product) => (
    <motion.div
      key={product._id}
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden border border-[#016A6D]/10 transform transition-all duration-300"
    >
      {/* Image */}
      <div className="md:w-1/3 w-full h-52 md:h-[200px] flex items-center justify-center bg-gray-50">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300/e6f2f5/043E52?text=No+Image'}
          alt={product.name}
          className="object-contain h-full w-full p-2"
        />
      </div>

      {/* Info */}
      <div className="md:w-2/3 p-4 flex flex-col justify-between"> {/* Padding reverted to original smaller size */}
        <div>
          <h2 className="text-xl font-bold mb-1 text-[#043E52]">{product.name}</h2> {/* Reverted to smaller font size */}
          <p className="text-gray-600 text-sm mb-0.5"> {/* Reverted to smaller font size */}
            Status: <span className={`capitalize font-semibold ${product.status === 'draft' ? 'text-[#FFAA5D]' : 'text-[#016A6D]'}`}>{product.status}</span>
          </p>
          <p className="text-gray-600 text-sm mb-0.5">
            Start Date: <span className="text-[#043E52]">{new Date(product.startDate).toDateString()}</span>
          </p>
          <p className="text-gray-600 text-sm mb-0.5">
            End Date: <span className="text-[#043E52]">{new Date(product.endDate).toDateString()}</span>
          </p>
          <p className="text-[#043E52] text-base mt-2 font-semibold">Starting Price: PKR {product.startingPrice.toLocaleString()}</p> {/* Reverted to smaller font size */}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2"> {/* Reverted to smaller gap */}
          {product.isDraft && (
            <span className="bg-[#FFAA5D]/20 text-[#FFAA5D] text-xs px-2 py-0.5 rounded-full font-medium">Draft</span> 
          )}
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium"> {/* Reverted to smaller font size and padding */}
            ID: {product._id.substring(0, 8)}...
          </span>
          <div className="ml-auto flex space-x-2"> {/* Reverted to smaller space-x */}
            <button
              onClick={() => handleViewProductDetails(product._id)}
              className="inline-flex items-center px-3 py-1.5 bg-[#016A6D] text-white rounded-md text-xs font-medium hover:bg-[#043E52] transition-colors" // Reverted to smaller px, py, text-xs
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFetchBids(product._id);
              }}
              className="inline-flex items-center px-3 py-1.5 bg-[#E16A3D] text-white rounded-md text-xs font-medium hover:bg-[#FFAA5D] transition-colors" // Reverted to smaller px, py, text-xs
            >
              <ListCollapse size={16} className="mr-1" /> See Bids {/* Reverted to smaller icon size */}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-serif py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Top Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {displayBids && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xl relative shadow-2xl max-h-[90vh] overflow-hidden flex flex-col font-sans"> {/* Reverted padding and max-w */}
              <button
                onClick={() => {
                  setDisplayBids(false);
                  setBids(null);
                  setSelectedProductId(null);
                }}
                className="absolute top-3 right-3 text-[#043E52]/70 hover:text-[#E16A3D] transition-colors"
                aria-label="Close bids modal"
              >
                <X size={22} /> {/* Reverted icon size */}
              </button>

              <h2 className="text-xl font-bold mb-4 text-center text-[#043E52]">Live Bids for Product {selectedProductId ? selectedProductId.substring(0, 8) + '...' : ''}</h2> {/* Reverted font size */}

              {bidLoading ? (
                <div className="flex justify-center items-center py-8"> {/* Reverted padding */}
                  <Loader2 className="w-10 h-10 text-[#016A6D] animate-spin" /> {/* Reverted icon size */}
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto pr-2 custom-scroll">
                  {bids && bids.length > 0 ? (
                    bids.map((bid) => (
                      <motion.div
                        key={bid._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition mb-2 last:mb-0 border border-gray-200" 
                      >
                        <div className="mb-1 sm:mb-0">
                          <div className="font-semibold text-[#043E52] text-base">
                            Amount: PKR {bid.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            👤 User: {bid?.bidderId?.name || 'N/A'} ({bid?.bidderId?.email || 'N/A'})
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Bid Time: {new Date(bid.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <button
                            onClick={() =>
                              handleAcceptBid(
                                bid._id,
                                bid.productId,
                                bid.bidderId?.email,
                                bid.bidderId?.name
                              )
                            }
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center justify-center transition-colors shadow-md text-sm" // Reverted padding, text-sm
                            title="Accept Bid"
                          >
                            <Check size={18} /> {/* Reverted icon size */}
                          </button>
                          <button
                            onClick={() => handleReject(bid._id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center justify-center transition-colors shadow-md text-sm" // Reverted padding, text-sm
                            title="Reject Bid"
                          >
                            <X size={18} /> {/* Reverted icon size */}
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4 text-sm">No bids yet for this product.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Breadcrumb - Arrow one with desired size */}
        <motion.div variants={itemVariants} className="mb-8">
          <nav className="flex items-center text-base text-[#043E52]/80 space-x-2"> {/* Breadcrumb text size as desired */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
            />
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#FFAA5D] transition-colors font-medium"
            >
              Home
            </button>
            <FiArrowRight className="text-[#FFAA5D] w-5 h-5" /> {/* Arrow icon with desired size */}
            <button
              onClick={() => navigate('/seller-dashboard')}
              className="hover:text-[#FFAA5D] transition-colors font-medium"
            >
              Dashboard
            </button>
            <FiArrowRight className="text-[#FFAA5D] w-5 h-5" /> {/* Arrow icon with desired size */}
            <span className="font-semibold text-[#043E52]">My Bids</span>
          </nav>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-[#043E52] mb-8 text-center leading-tight"> {/* Reverted to 3xl for balance */}
          Manage Your Auctions & Bids
        </motion.h1>

        {/* Removed Draft Products Button */}
        <motion.div variants={itemVariants} className="mb-10 flex justify-center">
          <button
            onClick={() => { /* This button now simply acts as a label or could be removed if unnecessary */ }}
            className={`px-6 py-2.5 rounded-full text-base font-semibold transition-all duration-300 bg-gradient-to-br from-[#016A6D] to-[#043E52] text-white shadow-lg`}
          >
            Active Listings ({activeProducts.length})
          </button>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-md"> {/* Reverted padding */}
            <Loader2 className="w-12 h-12 text-[#016A6D] animate-spin" /> {/* Reverted icon size */}
            <p className="ml-4 text-base text-[#043E52] mt-3">Loading your products...</p> {/* Reverted font size */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> {/* Reverted gap */}
            {activeProducts.length > 0 ? (
              activeProducts.map(renderProductCard)
            ) : (
              <motion.div variants={itemVariants} className="md:col-span-3 text-center py-8 bg-white rounded-xl shadow-md text-[#043E52] text-base border border-[#016A6D]/10"> {/* Reverted padding, text-base */}
                No active products found. Start a new listing!
              </motion.div>
            )}
          </div>
        )}

        {/* Custom scrollbar styles */}
        <style>{`
          .custom-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: #e6f2f5;
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #016A6D;
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #043E52;
          }
        `}</style>
      </div>
    </motion.div>
  );
};

export default SellerBids;