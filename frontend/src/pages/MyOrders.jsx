import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiPackage, 
  FiUser, 
  FiDollarSign, 
  FiCalendar, 
  FiStar, 
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiHome
} from 'react-icons/fi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' };
      case 'shipped':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-600' };
      case 'processing':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' };
      case 'pending':
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'processing':
        return <FiClock className="w-4 h-4" />;
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'cancelled':
        return <FiHome className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#016A6D] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E16A3D] text-lg mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-[#016A6D] text-white px-4 py-2 rounded-lg hover:bg-[#043E52] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Decorative Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#043E52] mb-2">My Orders</h1>
              <p className="text-[#043E52]/80">Track your purchases and leave reviews</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-[#016A6D] hover:text-[#FFAA5D] transition-colors"
            >
              <FiArrowRight className="rotate-180" />
              Back to Dashboard
            </button>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <FiPackage className="w-16 h-16 text-[#043E52]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#043E52] mb-2">No Orders Yet</h3>
            <p className="text-[#043E52]/70 mb-6">You haven't made any purchases yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <FiPackage />
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-6">
            {orders.map((order) => {
              const statusColors = getStatusColor(order.status);
              return (
                <motion.div
                  key={order._id}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-[#016A6D]/20 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-[#016A6D]/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${statusColors.bg}`}>
                          <FiPackage className={`w-6 h-6 ${statusColors.icon}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#043E52]">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-[#043E52]/70">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-[#043E52]/70">Total</p>
                          <p className="text-lg font-semibold text-[#016A6D]">
                            ${order.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-[#043E52]/5 rounded-lg">
                          <img
                            src={item.product?.images?.[0] || item.image || '/placeholder-product.jpg'}
                            alt={item.product?.name || item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-[#043E52] mb-1">
                              {item.product?.name || item.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-[#043E52]/70 mb-2">
                              <div className="flex items-center gap-1">
                                <FiUser className="w-4 h-4" />
                                <span>{item.seller?.name || 'Unknown Seller'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiDollarSign className="w-4 h-4" />
                                <span>${item.price.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            {/* Review Section */}
                            {order.status === 'delivered' && (
                              <div className="mt-3">
                                {item.reviewLeft ? (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <FiCheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Review Submitted</span>
                                  </div>
                                ) : (
                                  <Link
                                    to={`/leave-review/${item.seller?._id || item.seller}/${order._id}/${item._id}`}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                                  >
                                    <FiStar className="w-4 h-4" />
                                    Leave a Review
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyOrders; 