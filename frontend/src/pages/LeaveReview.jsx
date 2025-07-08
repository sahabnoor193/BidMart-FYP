import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiStar, 
  FiUser, 
  FiMessageSquare, 
  FiArrowLeft,
  FiCheckCircle,
  FiPackage
} from 'react-icons/fi';

const LeaveReview = () => {
  const { sellerId, productId, bidId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [seller, setSeller] = useState(null);
  const [product, setProduct] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

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
    checkEligibilityAndFetchData();
  }, [sellerId, productId, bidId]);

  const checkEligibilityAndFetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Check eligibility (now with productId)
      const eligibilityResponse = await axios.get(
        `http://localhost:5000/api/reviews/eligibility/${sellerId}?productId=${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!eligibilityResponse.data.eligible) {
        setEligibility(false);
        setLoading(false);
        return;
      }

      setEligibility(true);

      // Fetch seller details
      const sellerResponse = await axios.get(
        `http://localhost:5000/api/user/${sellerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSeller(sellerResponse.data);

      // Fetch product details
      const productResponse = await axios.get(
        `http://localhost:5000/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProduct(productResponse.data);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      if (error.response?.status === 401) {
        navigate('/signin');
        return;
      }
      toast.error('Failed to load information');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.comment.length < 10) {
      toast.error('Comment must be at least 10 characters long');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const reviewData = {
        sellerId,
        rating: formData.rating,
        comment: formData.comment,
        productId
      };

      await axios.post(
        'http://localhost:5000/api/reviews',
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Thank you for your review!', {
        position: "top-center",
        style: { background: '#016A6D', color: '#fff' }
      });

      // Redirect back to Buyer Bids after a short delay
      setTimeout(() => {
        navigate('/buyer/bids');
      }, 2000);

    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage, {
        position: "top-center",
        style: { background: '#E16A3D', color: '#fff' }
      });
    } finally {
      setSubmitting(false);
    }
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

  if (!eligibility) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <FiCheckCircle className="w-16 h-16 text-[#E16A3D] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#043E52] mb-4">Cannot Review</h2>
          <p className="text-[#043E52]/70 mb-6">
            You are not eligible to review this seller. You can only review sellers after completing a purchase.
          </p>
          <button
            onClick={() => navigate('/buyer/bids')}
            className="bg-[#016A6D] text-white px-6 py-3 rounded-lg hover:bg-[#043E52] transition-colors"
          >
            Back to My Bids
          </button>
        </motion.div>
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
      <div className="max-w-2xl mx-auto">
        {/* Decorative Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={() => navigate('/buyer/bids')}
            className="flex items-center gap-2 text-[#016A6D] hover:text-[#FFAA5D] transition-colors mb-4"
          >
            <FiArrowLeft />
            Back to My Bids
          </button>
          <h1 className="text-3xl font-bold text-[#043E52] mb-2">Leave a Review</h1>
          <p className="text-[#043E52]/80">Share your experience with this seller</p>
        </motion.div>

        {/* Seller and Product Info */}
        {seller && product && (
          <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-[#016A6D]/20 p-6 mb-8">
            <div className="space-y-4">
              {/* Seller Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {seller.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#043E52]">{seller.name}</h2>
                  <p className="text-[#043E52]/70">{seller.email}</p>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#016A6D]/20">
                <div className="w-12 h-12 bg-[#016A6D]/10 rounded-lg flex items-center justify-center">
                  <FiPackage className="text-[#016A6D]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#043E52]">{product.name}</h3>
                  <p className="text-sm text-[#043E52]/70">Product purchased</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Review Form */}
        <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-[#016A6D]/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-[#043E52] mb-4">
                How would you rate your experience?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-4xl focus:outline-none transition-all"
                  >
                    <FiStar className={
                      star <= formData.rating 
                        ? "text-[#FFAA5D] fill-current" 
                        : "text-[#043E52]/30"
                    } />
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-sm text-[#043E52]/70 mt-2">
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-[#043E52] mb-4">
                Tell us about your experience
              </label>
              <div className="relative">
                <FiMessageSquare className="absolute left-3 top-3 text-[#043E52]/50" />
                <textarea
                  value={formData.comment}
                  onChange={handleCommentChange}
                  rows={4}
                  placeholder="Share your experience with this seller..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 resize-none"
                  required
                />
              </div>
              <p className="text-sm text-[#043E52]/70 mt-2">
                {formData.comment.length}/10 characters minimum
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting || formData.comment.length < 10}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiStar className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeaveReview; 