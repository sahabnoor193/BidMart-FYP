// // import { useState } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";

// // const FeedbackForm = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     rating: 5,
// //     comment: "",
// //     role: "Buyer"
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       await axios.post("http://localhost:5000/api/feedback", formData);
      
// //       toast.success("Thank you for your feedback! It will be reviewed and published soon.", {
// //         position: "top-center",
// //         autoClose: 5000,
// //         hideProgressBar: false,
// //         closeOnClick: true,
// //         pauseOnHover: true,
// //         draggable: true,
// //         progress: undefined,
// //         theme: "light",
// //       });

// //       // Reset form
// //       setFormData({
// //         name: "",
// //         email: "",
// //         rating: 5,
// //         comment: "",
// //         role: "Buyer"
// //       });

// //       // Navigate back after 2 seconds
// //       setTimeout(() => {
// //         navigate(-1);
// //       }, 2000);

// //     } catch (error) {
// //       console.error("Error submitting feedback:", error);
// //       toast.error(error.response?.data?.message || "Failed to submit feedback. Please try again later.", {
// //         position: "top-center",
// //         autoClose: 5000,
// //         hideProgressBar: false,
// //         closeOnClick: true,
// //         pauseOnHover: true,
// //         draggable: true,
// //         progress: undefined,
// //         theme: "light",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-3xl mx-auto">
// //         <div className="bg-white shadow rounded-lg p-8">
// //           <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
// //             Share Your Feedback
// //           </h2>
          
// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
// //               <div>
// //                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
// //                   Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   id="name"
// //                   value={formData.name}
// //                   onChange={handleChange}
// //                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
// //                   Email
// //                 </label>
// //                 <input
// //                   type="email"
// //                   name="email"
// //                   id="email"
// //                   value={formData.email}
// //                   onChange={handleChange}
// //                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
// //                   required
// //                 />
// //               </div>
// //             </div>

// //             <div>
// //               <label htmlFor="role" className="block text-sm font-medium text-gray-700">
// //                 Role
// //               </label>
// //               <select
// //                 name="role"
// //                 id="role"
// //                 value={formData.role}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
// //                 required
// //               >
// //                 <option value="Buyer">Buyer</option>
// //                 <option value="Seller">Seller</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
// //                 Rating
// //               </label>
// //               <div className="mt-1 flex items-center">
// //                 {[1, 2, 3, 4, 5].map((star) => (
// //                   <button
// //                     key={star}
// //                     type="button"
// //                     onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
// //                     className="text-2xl focus:outline-none"
// //                   >
// //                     {star <= formData.rating ? "★" : "☆"}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <div>
// //               <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
// //                 Your Feedback
// //               </label>
// //               <textarea
// //                 name="comment"
// //                 id="comment"
// //                 rows={4}
// //                 value={formData.comment}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
// //                 required
// //                 placeholder="Share your experience with us..."
// //               />
// //             </div>

// //             <div className="flex justify-end">
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 {loading ? "Submitting..." : "Submit Feedback"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FeedbackForm;
// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FiUser, FiMail, FiStar, FiMessageSquare, FiArrowLeft } from "react-icons/fi";

// const FeedbackForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     rating: 5,
//     comment: "",
//     role: "Buyer"
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1, when: "beforeChildren" }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("http://localhost:5000/api/feedback", formData);
      
//       toast.success("Thank you for your feedback! It will be reviewed and published soon.", {
//         position: "top-center",
//         style: { background: '#016A6D', color: '#fff' }
//       });

//       setFormData({ name: "", email: "", rating: 5, comment: "", role: "Buyer" });
//       setTimeout(() => navigate(-1), 2000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit feedback. Please try again later.", {
//         position: "top-center",
//         style: { background: '#E16A3D', color: '#fff' }
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8"
//     >
//       <div className="max-w-3xl mx-auto">
//         {/* Decorative Border */}
//         <motion.div
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.8 }}
//           className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
//         />

//         {/* Header */}
//         <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center text-[#043E52] hover:text-[#FFAA5D] transition-colors"
//           >
//             <FiArrowLeft className="mr-2" /> Back
//           </button>
//           <h2 className="text-3xl font-bold text-[#043E52]">
//             Share Your <span className="text-[#FFAA5D]">Feedback</span>
//           </h2>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#016A6D]/20"
//         >
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               {/* Name Input */}
//               <motion.div variants={itemVariants} className="relative">
//                 <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Your Name"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                   required
//                 />
//               </motion.div>

//               {/* Email Input */}
//               <motion.div variants={itemVariants} className="relative">
//                 <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Email Address"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                   required
//                 />
//               </motion.div>

//               {/* Role Select */}
//               <motion.div variants={itemVariants} className="relative">
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="w-full py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-transparent appearance-none pl-4 pr-8"
//                   required
//                 >
//                   <option value="Buyer" className="bg-white">Buyer</option>
//                   <option value="Seller" className="bg-white">Seller</option>
//                 </select>
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#043E52]/50">
//                   ▼
//                 </div>
//               </motion.div>

//               {/* Rating */}
//               <motion.div variants={itemVariants} className="md:col-span-2">
//                 <label className="block text-sm text-[#043E52]/90 mb-4">Rating</label>
//                 <div className="flex items-center justify-center gap-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <motion.button
//                       key={star}
//                       type="button"
//                       onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       className="text-3xl focus:outline-none"
//                     >
//                       <FiStar className={
//                         star <= formData.rating 
//                           ? "text-[#FFAA5D] fill-current" 
//                           : "text-[#043E52]/30"
//                       } />
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>

//               {/* Comment Input */}
//               <motion.div variants={itemVariants} className="md:col-span-2 relative">
//                 <FiMessageSquare className="absolute left-3 top-4 text-[#043E52]/50" />
//                 <textarea
//                   name="comment"
//                   value={formData.comment}
//                   onChange={handleChange}
//                   rows={4}
//                   placeholder="Share your experience with us..."
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                   required
//                 />
//               </motion.div>
//             </div>

//             {/* Submit Button */}
//             <motion.button
//               variants={itemVariants}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 </div>
//               ) : (
//                 <>
//                   <FiStar className="w-5 h-5" />
//                   Submit Feedback
//                 </>
//               )}
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default FeedbackForm;
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiStar, FiMessageSquare, FiArrowLeft } from "react-icons/fi";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    role: "Buyer"
  });
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/feedback", formData);
      
      toast.success("Thank you for your feedback! It will be reviewed and published soon.", {
        position: "top-center",
        style: { background: '#016A6D', color: '#fff' }
      });

      setFormData({ name: "", email: "", rating: 5, comment: "", role: "Buyer" });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback. Please try again later.", {
        position: "top-center",
        style: { background: '#E16A3D', color: '#fff' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-serif py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Preserved animated top border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-[#043E52] hover:text-[#FFAA5D] transition-colors group"
          >
            <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
            <span className="border-b border-transparent group-hover:border-[#FFAA5D]">
              Back
            </span>
          </motion.button>
          <h2 className="text-3xl font-bold text-[#043E52]">
            Share Your <span className="text-[#FFAA5D]">Feedback</span>
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#016A6D]/10 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFAA5D]/10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#016A6D]/10 rounded-full" />

          <form onSubmit={handleSubmit} className="space-y-8 z-10">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Input */}
                <motion.div variants={itemVariants} className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                  />
                </motion.div>

                {/* Email Input */}
                <motion.div variants={itemVariants} className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                  />
                </motion.div>
              </div>

              {/* Role Select */}
              <motion.div variants={itemVariants} className="relative group">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-8 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40 appearance-none"
                  required
                >
                  <option value="Buyer" className="bg-white">Buyer</option>
                  <option value="Seller" className="bg-white">Seller</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]">
                  <FiUser />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#043E52]/50">
                  ▼
                </div>
              </motion.div>

              {/* Rating */}
              <motion.div variants={itemVariants} className="pt-2">
                <label className="block text-[#043E52]/90 mb-4">Rating</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-3xl focus:outline-none transition-all"
                    >
                      <FiStar className={
                        star <= formData.rating 
                          ? "text-[#FFAA5D] fill-current" 
                          : "text-[#043E52]/30"
                      } />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Comment Input */}
              <motion.div variants={itemVariants} className="relative group">
                <FiMessageSquare className="absolute left-4 top-4 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Share your experience with us..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                  required
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] text-white py-3.5 rounded-xl font-medium hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Submitting...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2 tracking-wide">
                  <FiStar className="w-5 h-5" />
                  Submit Feedback
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;