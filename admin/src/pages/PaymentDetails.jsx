import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiDollarSign, FiCalendar, FiPackage, FiUser, FiCreditCard, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

const PaymentDetails = () => {
  const { id } = useParams();
  const [loading] = useState(false);
  const payment = useSelector((state) => state.payments.singlePayment);

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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { 
          bg: "bg-[#016A6D]/10", 
          text: "text-[#016A6D]", 
          border: "border-[#016A6D]/20",
          icon: "text-[#016A6D]"
        };
      case "pending":
        return { 
          bg: "bg-[#FFAA5D]/10", 
          text: "text-[#E16A3D]", 
          border: "border-[#FFAA5D]/20",
          icon: "text-[#E16A3D]"
        };
      case "failed":
        return { 
          bg: "bg-[#E16A3D]/10", 
          text: "text-[#E16A3D]", 
          border: "border-[#E16A3D]/20",
          icon: "text-[#E16A3D]"
        };
      default:
        return { 
          bg: "bg-[#043E52]/10", 
          text: "text-[#043E52]", 
          border: "border-[#043E52]/20",
          icon: "text-[#043E52]"
        };
    }
  };

  const statusColors = payment ? getStatusColor(payment.status) : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#016A6D]"
        />
      </div>
    );
  }

  if (!payment) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gradient-to-b from-[#e6f2f5] to-white"
      >
        <FiInfo className="text-4xl text-[#E16A3D] mb-4" />
        <h2 className="text-2xl font-bold text-[#043E52] mb-2">Payment Not Found</h2>
        <p className="text-[#043E52]/80 max-w-md">
          We couldn't find the payment details you're looking for. Please check the payment ID and try again.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white py-12 px-4 sm:px-6 lg:px-8 pt-[90px] mx-auto font-serif w-full"
    >
      <div className="max-w-4xl mx-auto">
        {/* Decorative Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#043E52] sm:text-4xl">
            Payment Details
          </h1>
          <p className="mt-3 text-lg text-[#043E52]/80">
            Transaction ID: <span className="font-mono text-[#016A6D]">{id}</span>
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-[#016A6D]/20"
        >
          {/* Payment Header */}
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className={`px-6 py-5 ${statusColors.bg} ${statusColors.border} border-b`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <FiDollarSign className={`h-8 w-8 ${statusColors.icon} mr-3`} />
                <div>
                  <h2 className="text-2xl font-bold text-[#043E52]">${payment.amount.toFixed(2)}</h2>
                  <p className="text-sm text-[#043E52]/80">Amount paid</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-0">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusColors.text} ${statusColors.bg} ${statusColors.border}`}
                >
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Payment Details */}
          <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-medium text-[#043E52] mb-4 flex items-center">
                  <FiCalendar className={`mr-2 ${statusColors.icon}`} />
                  Transaction Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Date</span>
                    <span className="font-medium text-[#043E52]">{formatDate(payment.createdAt)}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Payment Method</span>
                    <span className="font-medium text-[#043E52]">
                      {payment.method || "Credit Card"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Transaction Fee</span>
                    <span className="font-medium text-[#043E52]">
                      ${payment.fee ? payment.fee.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-medium text-[#043E52] mb-4 flex items-center">
                  <FiUser className={`mr-2 ${statusColors.icon}`} />
                  Buyer Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Name</span>
                    <span className="font-medium text-[#043E52]">
                      {payment.buyer?.name || "Not available"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Email</span>
                    <span className="font-medium text-[#043E52]">
                      {payment.buyer?.email || "Not available"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-medium text-[#043E52] mb-4 flex items-center">
                  <FiPackage className={`mr-2 ${statusColors.icon}`} />
                  Product Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Product Name</span>
                    <span className="font-medium text-[#043E52]">
                      {payment.product?.name || "No product info"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Description</span>
                    <span className="font-medium text-[#043E52] text-right">
                      {payment.product?.description || "No description"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Original Price</span>
                    <span className="font-medium text-[#043E52]">
                      {payment.product?.startingPrice
                        ? `PKR ${payment.product.startingPrice.toFixed(2)}`
                        : "Not specified"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-medium text-[#043E52] mb-4 flex items-center">
                  <FiUser className={`mr-2 ${statusColors.icon}`} />
                  Seller Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Name</span>
                    <span className="font-medium text-[#043E52]">
                      {payment.seller?.name || "Not available"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Email</span>
                    <span className="font-medium text-[#043E52]">
                      {payment.seller?.email || "Not available"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div 
            variants={itemVariants}
            className="px-6 py-4 bg-[#043E52]/5 border-t border-[#016A6D]/20 text-center sm:text-right"
          >
            <p className="text-sm text-[#043E52]/80">
              Need help? <a href="#" className="font-medium text-[#016A6D] hover:text-[#E16A3D] transition-colors">Contact support</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentDetails;