// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import {  approveFeedback, declineFeedback, deleteFeedback, fetchAllFeedbacks, } from '../features/FeedBackSlice';
// import { FiThumbsUp, FiClock, FiUser } from 'react-icons/fi';

// const Testimonial_Details = () => {
//   const dispatch = useDispatch();
//   const feedback = useSelector((state) => state.feedback.singleFeedback);
//   const allfeedback = useSelector((state) => state.feedback.allFeedbacks);
//   const loading = useSelector((state) => state.feedback.loading);

//   useEffect(() => {
//     if (feedback) {
//       dispatch(fetchAllFeedbacks());
//     }
//   }, [dispatch]);

//   if (loading) return <div className="text-center py-12">Loading feedback...</div>;
//   if (!feedback) return <div className="text-center py-12">Feedback not found</div>;

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         {/* Header Section */}
//         <div className="bg-gray-50 px-6 py-4 border-b">
//           <h1 className="text-2xl font-bold text-gray-800">Feedback Details</h1>
//         </div>
        
//         {/* Main Content */}
//         <div className="p-6 md:p-8">
//           {/* User Info */}
//           <div className="flex items-center mb-6">
//             <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
//               {/* {feedback.name.charAt(0)} */}
//             </div>
//             <div className="ml-4">
//               <h2 className="text-xl font-semibold">{feedback.name}</h2>
//               <div className="flex items-center text-gray-500 mt-1">
//                 <FiUser className="mr-1" />
//                 <span className="capitalize">{feedback.role}</span>
//               </div>
//             </div>
//           </div>

//           {/* Feedback Content */}
//           <div className="mb-8">
//             <div className="flex items-center mb-2 text-gray-600">
//               <FiClock className="mr-2" />
//               <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
//             </div>
            
//             <div className="bg-gray-50 p-4 rounded-lg mb-4">
//               <p className="text-gray-700 whitespace-pre-line">{feedback.comment}</p>
//             </div>

//             <div className="flex items-center">
//               <div className="flex mr-4">
//                 {[...Array(5)].map((_, i) => (
//                   <span 
//                     key={i} 
//                     className={`text-xl ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 feedback.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//               }`}>
//                 {feedback.isApproved ? 'Approved' : 'Pending Approval'}
//               </span>
//             </div>
//           </div>

//           {/* Admin Actions */}
//           <div className="flex space-x-3 border-t pt-4">
//             <button
//               onClick={() => dispatch(feedback.isApproved ? declineFeedback(feedback._id) : approveFeedback(feedback._id))}
//               className={`flex items-center px-4 py-2 rounded-lg ${
//                 feedback.isApproved 
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200' 
//                   : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//               }`}
//             >
//               <FiThumbsUp className="mr-2" />
//               {feedback.isApproved ? 'Disapprove' : 'Approve'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Testimonial_Details;

//UPDATED UI
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { approveFeedback, declineFeedback, deleteFeedback, fetchAllFeedbacks } from '../features/FeedBackSlice';
import { FiThumbsUp, FiClock, FiUser, FiStar, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Testimonial_Details = () => {
  const dispatch = useDispatch();
  const feedback = useSelector((state) => state.feedback.singleFeedback);
  const allfeedback = useSelector((state) => state.feedback.allFeedbacks);
  const loading = useSelector((state) => state.feedback.loading);

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
    if (feedback) {
      dispatch(fetchAllFeedbacks());
    }
  }, [dispatch]);

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

  if (!feedback) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#016A6D]/20 text-center">
          <h2 className="text-2xl font-semibold text-[#043E52]">Feedback not found</h2>
          <p className="text-[#043E52]/90 mt-2">The requested feedback could not be loaded.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="max-w-4xl mx-auto">
        {/* Decorative Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Breadcrumb
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
                <li>
                  <Link
                    to="/testimonials"
                    className="hover:text-[#FFAA5D] transition-colors duration-200"
                  >
                    Testimonials
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="font-medium text-[#043E52]">Details</li>
              </ol>
            </nav>
          </div>
        </motion.div> */}

        {/* Feedback Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-[#016A6D]/20"
        >
          {/* Header Section */}
          <div className="bg-[#043E52]/5 px-6 py-4 border-b border-[#016A6D]/20">
            <h1 className="text-2xl font-bold text-[#043E52] flex items-center gap-2">
              <FiUser className="text-[#FFAA5D]" />
              Feedback Details
            </h1>
          </div>
          
          {/* Main Content */}
          <div className="p-6 md:p-8">
            {/* User Info */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center mb-8"
            >
              <div className="bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {feedback.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-[#043E52]">{feedback.name}</h2>
                <div className="flex items-center text-[#043E52]/80 mt-1">
                  <FiUser className="mr-2 text-[#016A6D]" />
                  <span className="capitalize">{feedback.role}</span>
                </div>
              </div>
            </motion.div>

            {/* Feedback Content */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <div className="flex items-center mb-4 text-[#043E52]/80">
                <FiClock className="mr-2 text-[#016A6D]" />
                <span>{new Date(feedback.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="bg-[#043E52]/5 p-6 rounded-lg mb-6 border border-[#016A6D]/20">
                <p className="text-[#043E52] whitespace-pre-line">{feedback.comment}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-5 h-5 ${i < feedback.rating ? 'text-[#FFAA5D] fill-[#FFAA5D]' : 'text-[#043E52]/30'}`}
                    />
                  ))}
                </div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  feedback.isApproved 
                    ? 'bg-[#016A6D]/10 text-[#016A6D]' 
                    : 'bg-[#E16A3D]/10 text-[#E16A3D]'
                }`}>
                  {feedback.isApproved 
                    ? <FiCheckCircle className="w-4 h-4" /> 
                    : <FiXCircle className="w-4 h-4" />}
                  {feedback.isApproved ? 'Approved' : 'Pending Approval'}
                </div>
              </div>
            </motion.div>

            {/* Admin Actions */}
            <motion.div 
              variants={itemVariants}
              className="flex space-x-4 border-t border-[#016A6D]/20 pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => dispatch(feedback.isApproved ? declineFeedback(feedback._id) : approveFeedback(feedback._id))}
                className={`flex items-center px-5 py-2.5 rounded-lg transition-colors duration-200 ${
                  feedback.isApproved 
                    ? 'bg-[#E16A3D]/10 text-[#E16A3D] hover:bg-[#E16A3D]/20' 
                    : 'bg-[#016A6D]/10 text-[#016A6D] hover:bg-[#016A6D]/20'
                }`}
              >
                <FiThumbsUp className="mr-2" />
                {feedback.isApproved ? 'Disapprove' : 'Approve'}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Testimonial_Details;