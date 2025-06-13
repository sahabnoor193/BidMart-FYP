// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllFeedbacks,
//   fetchApprovedFeedbacks,
//   approveFeedback,
//   declineFeedback,
//   deleteFeedback,
//   setSingleFeedback,
// } from "../features/FeedBackSlice";
// import { FiThumbsUp, FiThumbsDown, FiTrash2, FiEye } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const Testimonials = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const approvedFeedbacks = useSelector(
//     (state) => state.feedback.approvedFeedbacks
//   );
//   const allFeedbacks = useSelector((state) => state.feedback.allFeedbacks);
//   const loading = useSelector((state) => state.feedback.loading);
//   const error = useSelector((state) => state.feedback.error);
//   const feedback = useSelector((state) => state.feedback.singleFeedback);
 
//   console.log(feedback);

//   useEffect(() => {
//     dispatch(fetchApprovedFeedbacks());
//     dispatch(fetchAllFeedbacks());
//   }, [dispatch]);

//   const handleApprove = (feedbackId) => {
//     dispatch(approveFeedback(feedbackId));
//   };

//   const handleDecline = (feedbackId) => {
//     dispatch(declineFeedback(feedbackId));
//   };

//   const handleDelete = (feedbackId) => {
//     if (window.confirm("Are you sure you want to delete this feedback?")) {
//       dispatch(deleteFeedback(feedbackId));
//     }
//   };
  
//   const Navigation = ( feedback ) => {
//     dispatch(setSingleFeedback( feedback ))
//      navigate("/Testimonial_Details")
//   }
  

//   if (loading)
//     return <div className="text-center py-8">Loading feedbacks...</div>;
//   if (error)
//     return <div className="text-red-500 text-center py-8">Error: {error}</div>;
//   // console.log(allFeedbacks, approvedFeedbacks);
//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* All Feedbacks Table */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-bold mb-6">All Feedbacks</h2>
//         <div className="overflow-x-auto bg-white rounded-lg shadow">
//           <table className="min-w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-3 px-4 text-left">Name</th>
//                 <th className="py-3 px-4 text-left">Comment</th>
//                 <th className="py-3 px-4 text-left">Ratings</th>
//                 <th className="py-3 px-4 text-left">Role</th>
//                 <th className="py-3 px-4 text-left">Status</th>
//                 <th className="py-3 px-4 text-left">Actions</th>
//                 <th className="py-3 px-4 text-left">View</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allFeedbacks.map((feedback) => (
//                 <tr
//                   key={feedback._id}
//                   className="border-b border-gray-200 hover:bg-gray-50"
//                 >
//                   <td className="py-3 px-4">{feedback.name}</td>
//                   <td className="py-3 px-4 max-w-xs truncate">
//                     {feedback.comment}
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <span
//                           key={i}
//                           className={`${
//                             i < feedback.rating
//                               ? "text-yellow-400"
//                               : "text-gray-300"
//                           }`}
//                         >
//                           ★
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="py-3 px-4 capitalize">
//                     {feedback.role.toLowerCase()}
//                   </td>
//                   <td className="py-3 px-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs ${
//                         feedback.isApproved
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {feedback.isApproved ? "Approved" : "Pending"}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() =>
//                           console.log("View feedback:", feedback._id)
//                         }
//                         className="text-blue-500 hover:text-blue-700 p-1"
//                         title="View"
//                       >
//                         <FiEye />
//                       </button>
//                       {feedback.isApproved ? (
//                         <button
//                           onClick={() => handleDecline(feedback._id)}
//                           className="text-green-500 hover:text-green-700 p-1"
//                           title="Click to disapprove"
//                         >
//                           <FiThumbsUp className="fill-current" />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleApprove(feedback._id)}
//                           className="text-gray-400 hover:text-gray-600 p-1"
//                           title="Click to approve"
//                         >
//                           <FiThumbsUp />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleDelete(feedback._id)}
//                         className="text-red-500 hover:text-red-700 p-1"
//                         title="Delete"
//                       >
//                         <FiTrash2 />
//                       </button>
//                     </div>
//                   </td>
//                   <td>
//                     <button 
//                     onClick={()=>Navigation(feedback)}
//                       className="flex items-center px-3 py-1 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
//                     >
//                       <FiEye className="inline mr-1" /> View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Approved Feedbacks Section */}
//       <section>
//         <h2 className="text-2xl font-bold mb-6">Approved Testimonials</h2>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {approvedFeedbacks.map((feedback) => (
//             <div
//               key={feedback._id}
//               className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
//             >
//               <div className="flex items-center mb-4">
//                 <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
//                   {feedback.name.charAt(0)}
//                 </div>
//                 <div className="ml-4">
//                   <h3 className="font-semibold">{feedback.name}</h3>
//                   <p className="text-gray-500 text-sm">
//                     {new Date(feedback.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//               <p className="text-gray-700 mb-4">{feedback.comment}</p>
//               <div className="flex justify-between items-center">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <span
//                       key={i}
//                       className={`${
//                         i < feedback.rating
//                           ? "text-yellow-400"
//                           : "text-gray-300"
//                       }`}
//                     >
//                       ★
//                     </span>
//                   ))}
//                 </div>
//                 <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                   Approved
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Testimonials;


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFeedbacks,
  fetchApprovedFeedbacks,
  approveFeedback,
  declineFeedback,
  deleteFeedback,
  setSingleFeedback,
} from "../features/FeedBackSlice";
import { FiThumbsUp, FiThumbsDown, FiTrash2, FiEye, FiLoader, FiAlertCircle, FiStar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const approvedFeedbacks = useSelector((state) => state.feedback.approvedFeedbacks);
  const allFeedbacks = useSelector((state) => state.feedback.allFeedbacks);
  const loading = useSelector((state) => state.feedback.loading);
  const error = useSelector((state) => state.feedback.error);
  const feedback = useSelector((state) => state.feedback.singleFeedback);

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
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    dispatch(fetchApprovedFeedbacks());
    dispatch(fetchAllFeedbacks());
  }, [dispatch]);

  const handleApprove = (feedbackId) => {
    dispatch(approveFeedback(feedbackId));
  };

  const handleDecline = (feedbackId) => {
    dispatch(declineFeedback(feedbackId));
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(feedbackId));
    }
  };
  
  const Navigation = (feedback) => {
    dispatch(setSingleFeedback(feedback))
    navigate("/Testimonial_Details")
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-[#016A6D]"
        >
          <FiLoader className="w-12 h-12" />
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={itemVariants}
            className="bg-[#FEE2E2] border border-[#E16A3D] text-[#E16A3D] px-6 py-4 rounded-lg flex items-start gap-3"
          >
            <FiAlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Error loading testimonials</h3>
              <p>{error}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
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

        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
            />
            <nav className="text-sm md:text-base text-[#043E52]/80">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#FFAA5D] transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-[#FFAA5D] transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="font-medium text-[#043E52]">Testimonials</li>
              </ol>
            </nav>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-[#043E52] mb-8"
        >
          Customer Testimonials
        </motion.h1>

        {/* All Feedbacks Table */}
        <motion.section 
          variants={itemVariants}
          className="mb-12"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-semibold text-[#043E52] mb-6 flex items-center gap-2"
          >
            <FiStar className="text-[#FFAA5D]" />
            All Feedbacks
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-[#016A6D]/20"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#016A6D]/20">
                <thead className="bg-[#043E52]/5">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Comment</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Ratings</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Role</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Actions</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">View</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#016A6D]/20">
                  {allFeedbacks.map((feedback) => (
                    <motion.tr
                      key={feedback._id}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: 'rgba(1, 106, 109, 0.03)' }}
                      className="transition-colors duration-200"
                    >
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-[#043E52]">
                        {feedback.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-[#043E52]/90 max-w-xs truncate">
                        {feedback.comment}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#043E52]/90">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i}
                              className={`w-4 h-4 ${i < feedback.rating ? 'text-[#FFAA5D] fill-[#FFAA5D]' : 'text-[#043E52]/30'}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#043E52]/90 capitalize">
                        {feedback.role.toLowerCase()}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          feedback.isApproved 
                            ? 'bg-[#016A6D]/10 text-[#016A6D]' 
                            : 'bg-[#E16A3D]/10 text-[#E16A3D]'
                        }`}>
                          {feedback.isApproved 
                            ? <FiCheckCircle className="w-3 h-3" /> 
                            : <FiXCircle className="w-3 h-3" />}
                          {feedback.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => feedback.isApproved ? handleDecline(feedback._id) : handleApprove(feedback._id)}
                            className={`p-1.5 rounded-lg transition-colors duration-200 ${
                              feedback.isApproved 
                                ? 'text-[#016A6D] hover:bg-[#016A6D]/10' 
                                : 'text-[#043E52]/50 hover:bg-[#043E52]/10'
                            }`}
                            title={feedback.isApproved ? "Disapprove" : "Approve"}
                          >
                            <FiThumbsUp className={`w-4 h-4 ${feedback.isApproved ? 'fill-current' : ''}`} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(feedback._id)}
                            className="text-[#E16A3D] hover:bg-[#E16A3D]/10 p-1.5 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => Navigation(feedback)}
                          className="flex items-center px-3 py-1 border border-[#016A6D] text-[#016A6D] rounded-lg hover:bg-[#016A6D]/10 transition-colors duration-200"
                        >
                          <FiEye className="inline mr-1 w-4 h-4" /> View
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.section>

        {/* Approved Feedbacks Section */}
        <motion.section 
          variants={itemVariants}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-semibold text-[#043E52] mb-6 flex items-center gap-2"
          >
            <FiCheckCircle className="text-[#016A6D]" />
            Approved Testimonials
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {approvedFeedbacks.map((feedback) => (
              <motion.div
                key={feedback._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-[#016A6D]/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white">
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#043E52]">{feedback.name}</h3>
                    <p className="text-[#043E52]/70 text-sm">
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-[#043E52] mb-4">{feedback.comment}</p>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i}
                        className={`w-4 h-4 ${i < feedback.rating ? 'text-[#FFAA5D] fill-[#FFAA5D]' : 'text-[#043E52]/30'}`}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#016A6D]/10 text-[#016A6D] rounded-full text-xs font-medium">
                    <FiCheckCircle className="w-3 h-3" />
                    Approved
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Testimonials;