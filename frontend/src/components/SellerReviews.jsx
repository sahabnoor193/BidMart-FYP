import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiMessageSquare, FiThumbsUp } from 'react-icons/fi';
import axios from 'axios';

const SellerReviews = ({ sellerId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });

  useEffect(() => {
    if (sellerId) {
      fetchSellerReviews();
    }
  }, [sellerId]);

  const fetchSellerReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/seller/${sellerId}`);
      setReviews(response.data.reviews);
      setStats({
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews
      });
    } catch (error) {
      console.error('Error fetching seller reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#016A6D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-[#E16A3D]">
        <p>Failed to load reviews</p>
      </div>
    );
  }

  if (stats.totalReviews === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <FiMessageSquare className="w-12 h-12 text-[#043E52]/30 mx-auto mb-4" />
        <p className="text-[#043E52]/70">No reviews yet</p>
        <p className="text-sm text-[#043E52]/50">Be the first to review this seller</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Reviews Summary */}
      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-[#016A6D]/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#043E52] flex items-center gap-2">
            <FiThumbsUp className="text-[#FFAA5D]" />
            Seller Reviews
          </h3>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(stats.averageRating)
                        ? 'text-[#FFAA5D] fill-current'
                        : 'text-[#043E52]/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-[#016A6D]">
                {stats.averageRating}
              </span>
            </div>
            <p className="text-sm text-[#043E52]/70">
              {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.slice(0, 5).map((review) => (
          <motion.div
            key={review._id}
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-md border border-[#016A6D]/10 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] rounded-full flex items-center justify-center text-white font-semibold">
                {review.reviewer?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-[#043E52]">
                    {review.reviewer?.name || 'Anonymous'}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-[#FFAA5D] fill-current'
                            : 'text-[#043E52]/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#043E52]/90 text-sm mb-2">{review.comment}</p>
                <div className="flex items-center gap-4 text-xs text-[#043E52]/60">
                  <span>
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {review.product && (
                    <span className="flex items-center gap-1">
                      <FiUser className="w-3 h-3" />
                      {review.product.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {stats.totalReviews > 5 && (
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-[#043E52]/70">
            Showing 5 of {stats.totalReviews} reviews
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SellerReviews; 