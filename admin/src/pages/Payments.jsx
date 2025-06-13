// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { setSinglePayment } from "../features/Payment_Slice";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";


// const Payments = () => {
//   const [payments, setPayments] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5000/api/payments/allPayments");
//         setPayments(data);
//       } catch (error) {
//         console.error("Error fetching payments:", error);
//       }
//     };

//     fetchPayments();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//       hour12: true,
//     };
//     return new Date(dateString).toLocaleString("en-US", options);
//   };
  
//   const Navigation = ( payment ) => {
//       dispatch(setSinglePayment( payment ))
//        navigate("/PaymentsDetails")
//     }

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-[60px]">
//       <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
//         💳 Payment Records
//       </h1>

//       {payments.length === 0 ? (
//         <p className="text-center text-gray-500">No payments found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {payments.map((payment) => (
//             <div
//               key={payment.paymentId}
//               className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transition hover:shadow-2xl"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-purple-700">
//                   ${payment.amount}
//                 </h2>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
//                     payment.status === "completed"
//                       ? "bg-green-500"
//                       : payment.status === "pending"
//                       ? "bg-yellow-500"
//                       : "bg-red-500"
//                   }`}
//                 >
//                   {payment.status}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-500 mb-4">
//                 <strong>Created:</strong> {formatDate(payment.createdAt)}
//               </p>

//               <div className="mb-4 text-sm space-y-1">
//                 <p>
//                   <span className="font-medium text-gray-700">Product:</span>{" "}
//                   {payment.product?.name || "No product info"}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-700">Description:</span>{" "}
//                   {payment.product?.description || "No description"}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-700">Price:</span>{" "}
//                   {payment.product?.startingPrice
//                     ? `$${payment.product.startingPrice}`
//                     : "Not provided"}
//                 </p>
//               </div>

//               <div className="mb-3 text-sm">
//                 <p className="font-medium text-gray-700">Seller</p>
//                 <p className="text-gray-600">
//                   {payment.seller
//                     ? `${payment.seller.name} (${payment.seller.email})`
//                     : "No seller info"}
//                 </p>
//               </div>

//               <div className="text-sm">
//                 <p className="font-medium text-gray-700">Buyer</p>
//                 <p className="text-gray-600">
//                   {payment.buyer
//                     ? `${payment.buyer.name} (${payment.buyer.email})`
//                     : "No buyer info"}
//                 </p>
//               </div>
//               <button
//                className="border border-blue-500 rounded-xl py-1 px-4 mt-2"
//                onClick={()=>Navigation(payment)}>Details</button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Payments;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { setSinglePayment } from "../features/Payment_Slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiDollarSign, FiCreditCard, FiCalendar, FiPackage, FiUser } from "react-icons/fi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/payments/allPayments");
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

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
  
  const Navigation = (payment) => {
    dispatch(setSinglePayment(payment));
    navigate("/PaymentsDetails");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { bg: "bg-[#016A6D]/10", text: "text-[#016A6D]", border: "border-[#016A6D]/20" };
      case "pending":
        return { bg: "bg-[#FFAA5D]/10", text: "text-[#E16A3D]", border: "border-[#FFAA5D]/20" };
      case "failed":
        return { bg: "bg-[#E16A3D]/10", text: "text-[#E16A3D]", border: "border-[#E16A3D]/20" };
      default:
        return { bg: "bg-[#043E52]/10", text: "text-[#043E52]", border: "border-[#043E52]/20" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#e6f2f5] to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#016A6D]"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-[90px] min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif w-full"
    >
      {/* Decorative Border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
      />

      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center text-[#043E52] mb-10 flex items-center justify-center gap-3"
      >
        <FiCreditCard className="text-[#016A6D]" />
        Payment Records
      </motion.h1>

      {payments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-[#016A6D]/20 max-w-md mx-auto"
        >
          <FiDollarSign className="mx-auto text-4xl text-[#043E52]/50 mb-4" />
          <p className="text-[#043E52]">No payment records found</p>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {payments.map((payment) => {
            const statusColors = getStatusColor(payment.status);
            return (
              <motion.div
                key={payment.paymentId}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-[#016A6D]/20 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#016A6D]/10">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className={`text-xl ${statusColors.text}`} />
                    <h2 className="text-xl font-semibold text-[#043E52]">
                      ${payment.amount.toFixed(2)}
                    </h2>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.text} ${statusColors.bg} ${statusColors.border}`}
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4 text-sm space-y-3">
                  <div className="flex items-start gap-2">
                    <FiCalendar className={`mt-0.5 flex-shrink-0 ${statusColors.text}`} />
                    <p className="text-[#043E52]/90">
                      <span className="font-medium">Created:</span> {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiPackage className={`mt-0.5 flex-shrink-0 ${statusColors.text}`} />
                    <div>
                      <p className="font-medium text-[#043E52]">Product:</p>
                      <p className="text-[#043E52]/90">
                        {payment.product?.name || "No product info"}
                      </p>
                      {payment.product?.description && (
                        <p className="text-[#043E52]/80 text-xs mt-1">
                          {payment.product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <FiUser className={`mt-0.5 flex-shrink-0 ${statusColors.text}`} />
                    <div>
                      <p className="font-medium text-[#043E52]">Seller</p>
                      <p className="text-[#043E52]/90">
                        {payment.seller?.name || "No seller info"}
                      </p>
                      {payment.seller?.email && (
                        <p className="text-[#043E52]/80 text-xs">
                          {payment.seller.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <FiUser className={`mt-0.5 flex-shrink-0 ${statusColors.text}`} />
                    <div>
                      <p className="font-medium text-[#043E52]">Buyer</p>
                      <p className="text-[#043E52]/90">
                        {payment.buyer?.name || "No buyer info"}
                      </p>
                      {payment.buyer?.email && (
                        <p className="text-[#043E52]/80 text-xs">
                          {payment.buyer.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => Navigation(payment)}
                  className="w-full mt-4 bg-gradient-to-r from-[#016A6D] to-[#043E52] text-white py-2 rounded-lg text-sm font-medium transition-all"
                >
                  View Details
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Payments;