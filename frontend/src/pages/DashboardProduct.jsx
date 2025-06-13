import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { X, Check, Info, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import StripeOnboardingButton from "../components/StripeOnboardingButton";
import { FiArrowRight } from "react-icons/fi";

// Animation variants
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
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const DashboardProduct = () => {
  const BASEURL = "http://localhost:5000";
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [bids, setBids] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [displayBids, setDisplayBids] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayCompleteStripe, setDisplayCompleteStripe] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
        `${BASEURL}/api/bids/${bidId}/status`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.update(loadingToast, {
        render: "Bid status updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      handleFetchBids();

      return data;

    } catch (error) {
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
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASEURL}/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data?.images?.thumbnails[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleFetchBids = async () => {
    setBidLoading(true);
    try {
      setDisplayBids(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASEURL}/api/bids/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to load bids.');
    } finally {
      setBidLoading(false);
    }
  }

  const handleAcceptBid = async (bidId, productId, bidderEmail, bidderName) => {
    const toastId = toast.loading('Accepting bid...');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASEURL}/api/bids/accept`, {
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
      handleFetchBids();
    } catch (error) {
      const message = error?.response?.data?.message || "Unknown error occurred";
      const isStripeCapabilityError = message.includes("capabilities enabled");
      const stripeError = message.includes("Stripe Error");

      if (isStripeCapabilityError || stripeError) {
        toast.update(toastId, {
          render: `Seller's Stripe account isn't ready. Complete Stripe Process.`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        setDisplayCompleteStripe(true);
        setDisplayBids(false);
      } else {
        toast.update(toastId, {
          render: `Failed to accept bid from ${bidderName}!`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  }

  const isPaymentPending = bids?.some(bid => bid.status === "payment pending");
  const pendingPayment = bids?.find(bid => bid.status === "payment pending");
  const isPaymentSuccess = bids?.some(bid => bid.status === "Payment Success");
  const successPayment = bids?.find(bid => bid.status === "Payment Success");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8fafb] to-white">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-16 w-16 rounded-full border-t-4 border-b-4 border-[#E16A3D]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8fafb] to-white p-4"
      >
        <div className="h-1 w-64 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8 rounded-full" />
        <p className="text-[#E16A3D] text-xl font-medium text-center">
          Error loading product: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-[#043E52] text-white rounded-xl hover:bg-[#016A6D] transition-colors shadow-md"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8fafb] to-white p-4"
      >
        <div className="h-1 w-64 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8 rounded-full" />
        <p className="text-[#043E52] text-xl font-medium text-center">
          Product not found
        </p>
        <button
          onClick={() => navigate('/seller-dashboard/products')}
          className="mt-6 px-6 py-3 bg-[#043E52] text-white rounded-xl hover:bg-[#016A6D] transition-colors shadow-md"
        >
          Go to My Products
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-serif py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8 rounded-full"
        />

        <motion.div variants={itemVariants} className="mb-8">
          <nav className="flex items-center text-base text-[#043E52]/80 space-x-2">
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
            <FiArrowRight className="text-[#FFAA5D] w-5 h-5" />
            <button
              onClick={() => navigate('/seller-dashboard')}
              className="hover:text-[#FFAA5D] transition-colors font-medium"
            >
              Dashboard
            </button>
            <FiArrowRight className="text-[#FFAA5D] w-5 h-5" />
            <button
              onClick={() => navigate('/seller-dashboard/products')}
              className="hover:text-[#FFAA5D] transition-colors font-medium"
            >
              My Products
            </button>
            <FiArrowRight className="text-[#FFAA5D] w-5 h-5" />
            <span className="font-semibold text-[#043E52]">{product.title.substring(0, 20)}...</span>
          </nav>
        </motion.div>

        <AnimatePresence>
          {displayCompleteStripe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-[#E16A3D]/20"
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-[#E16A3D] transition-colors"
                  onClick={() => setDisplayCompleteStripe(false)}
                >
                  <X size={24} />
                </button>
                <div className="flex justify-center mb-4">
                  <Info size={40} className="text-[#E16A3D]" />
                </div>
                <h2 className="text-xl font-bold text-[#043E52] mb-3 text-center">
                  Stripe Account Setup Required
                </h2>
                <p className="text-[#043E52]/80 text-center mb-6">
                  You need to complete the Stripe onboarding process to receive payments from accepted bids.
                </p>
                <div className="flex justify-center items-center">
                  <StripeOnboardingButton />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-8 border border-[#016A6D]/10"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-xl overflow-hidden shadow-md mb-4 bg-[#016A6D]/10 flex items-center justify-center h-80 sm:h-96"
              >
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={selectedImage || product?.images?.thumbnails[0]}
                  alt="Product"
                  className="w-full h-full object-contain transition duration-300 p-2"
                />
              </motion.div>

              <div className="flex gap-3 overflow-x-auto py-2 custom-scroll">
                {product?.images.thumbnails?.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer rounded-lg border-2 transition-all p-1 ${
                      selectedImage === img
                        ? 'border-[#FFAA5D] transform scale-105 shadow-md'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index}`}
                      className="h-16 w-16 object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              className="w-full lg:w-1/2 space-y-6"
            >
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold text-[#043E52]"
              >
                {product?.title}
              </motion.h1>

              <motion.div
                variants={itemVariants}
                className="bg-[#016A6D]/5 rounded-xl p-4"
              >
                <p className="text-[#043E52]/90 text-sm leading-relaxed">
                  {product?.details?.description}
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <motion.div
                  variants={itemVariants}
                  className="bg-[#f8fafb] rounded-lg p-3 border border-[#016A6D]/10 text-sm"
                >
                  <div className="flex items-center gap-2 text-[#043E52]">
                    <span className="font-semibold">🏷 Brand:</span>
                    <span>{product?.details.brand}</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-[#f8fafb] rounded-lg p-3 border border-[#016A6D]/10 text-sm"
                >
                  <div className="flex items-center gap-2 text-[#043E52]">
                    <span className="font-semibold">📦 Quantity:</span>
                    <span>{product?.details?.quantity}</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-[#f8fafb] rounded-lg p-3 border border-[#016A6D]/10 text-sm"
                >
                  <div className="flex items-center gap-2 text-[#043E52]">
                    <span className="font-semibold">💰 Starting Price:</span>
                    <span>PKR {product?.startBid.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-[#f8fafb] rounded-lg p-3 border border-[#016A6D]/10 text-sm"
                >
                  <div className="flex items-center gap-2 text-[#043E52]">
                    <span className="font-semibold">📅 End Date:</span>
                    <span>{new Date(product?.endDate).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-4"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -10px rgba(255, 170, 93, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFetchBids}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white px-5 py-2.5 text-base font-medium rounded-xl transition-all shadow-md"
                >
                  See Bids ({product?.bids.length})
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -10px rgba(1, 106, 109, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.history.back()}
                  className="flex-1 min-w-[150px] bg-[#043E52] hover:bg-[#016A6D] text-white px-5 py-2.5 text-base font-medium rounded-xl transition-all shadow-md"
                >
                  Go Back to Products
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {displayBids && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-xl relative shadow-2xl max-h-[90vh] overflow-hidden flex flex-col font-sans border border-[#016A6D]/10"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-6 rounded-full"
                />

                <button
                  onClick={() => {
                    setDisplayBids(false);
                    setBids(null);
                  }}
                  className="absolute top-6 right-6 text-[#043E52]/70 hover:text-[#E16A3D] transition-colors"
                >
                  <X size={22} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-center text-[#043E52]">
                  Live Bids for Product {product?.title.substring(0, 15)}...
                </h2>

                {bidLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-10 h-10 text-[#016A6D] animate-spin" />
                    <p className="text-[#043E52] text-sm mt-2">Loading bids...</p>
                  </div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scroll"
                  >
                    {isPaymentPending && (
                      <motion.div
                        variants={itemVariants}
                        className="flex items-start gap-3 p-3 text-xs bg-yellow-50 rounded-xl border border-yellow-200"
                      >
                        <Info className="text-yellow-600 mt-0.5 flex-shrink-0" size={16}/>
                        <p className="text-yellow-700">
                          You've accepted a bid from <span className="font-semibold">{pendingPayment?.bidderId.name}</span> for <span className="font-semibold">PKR {pendingPayment?.amount.toLocaleString()}</span>!
                          The bidder has been notified to complete payment.
                        </p>
                      </motion.div>
                    )}
                    {isPaymentSuccess && (
                      <motion.div
                        variants={itemVariants}
                        className="flex items-start gap-3 p-3 text-xs bg-green-50 rounded-xl border border-green-200"
                      >
                        <Info className="text-green-600 mt-0.5 flex-shrink-0" size={16}/>
                        <p className="text-green-700">
                          <span className="font-semibold">{successPayment?.bidderId.name}</span> has completed payment for <span className="font-semibold">PKR {successPayment?.amount.toLocaleString()}</span>!
                          This auction is now closed.
                        </p>
                      </motion.div>
                    )}

                    {bids && bids.length > 0 ? (
                      bids.map((bid) => (
                        <motion.div
                          key={bid._id}
                          variants={itemVariants}
                          whileHover={{
                            y: -3,
                            boxShadow: "0 5px 15px -5px rgba(1, 106, 109, 0.15)"
                          }}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#f8fafb] hover:bg-[#e6f2f5] p-3 rounded-xl border border-[#016A6D]/10 gap-3"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-[#043E52] flex items-center gap-1.5 text-base">
                              <span className="bg-[#FFAA5D] text-white p-0.5 px-1.5 rounded-full text-xs">PKR</span>
                              Amount: <span className="font-bold">{bid.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-[#043E52]/80 mt-1.5 flex items-center gap-1.5">
                              <span className="bg-[#016A6D] text-white p-0.5 px-1.5 rounded-full text-xs">👤</span>
                              Bidder: <span className="font-medium">{bid?.bidderId.name}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                Bid Time: {new Date(bid.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            {bid.status !== 'rejected' && bid.status !== 'Payment Success' ? (
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={isPaymentPending || isPaymentSuccess}
                                  onClick={() =>
                                    handleAcceptBid(
                                      bid._id,
                                      bid.productId,
                                      bid.bidderId.email,
                                      bid.bidderId.name
                                    )
                                  }
                                  className="disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-1.5 px-3 rounded-lg shadow flex items-center gap-1 text-xs"
                                >
                                  <Check size={16} />
                                  <span>Accept</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={isPaymentPending || isPaymentSuccess}
                                  onClick={() => updateBidStatus(bid._id)}
                                  className="disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-1.5 px-3 rounded-lg shadow flex items-center gap-1 text-xs"
                                >
                                  <X size={16} />
                                  <span>Reject</span>
                                </motion.button>
                              </div>
                            ) : (
                              <p className={`font-medium px-3 py-1.5 rounded-lg text-xs ${bid.status === 'rejected' ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                                {bid.status === 'rejected' ? 'Rejected' : 'Payment Success'}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        variants={itemVariants}
                        className="text-center p-6 bg-[#f8fafb] rounded-xl border border-[#016A6D]/10"
                      >
                        <div className="text-4xl mb-3">💸</div>
                        <h3 className="text-lg text-[#043E52] font-medium mb-2">
                          No Bids Yet
                        </h3>
                        <p className="text-[#043E52]/80 text-sm">
                          This product hasn't received any bids yet. Check back later!
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                <div className="mt-6 pt-4 border-t border-[#016A6D]/20">
                  <button
                    onClick={() => setDisplayBids(false)}
                    className="w-full py-2.5 bg-[#043E52] text-white rounded-xl hover:bg-[#016A6D] transition-colors text-base"
                  >
                    Close Bids
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
    </motion.div>
  );
}

export default DashboardProduct;