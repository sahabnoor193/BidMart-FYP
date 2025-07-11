// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import { motion } from "framer-motion";
// // import { FiEdit, FiTrash, FiArrowRight, FiCalendar, FiUser, FiEye } from "react-icons/fi"; // Removed FiDollarSign
// // import { FaCheck, FaTimes } from "react-icons/fa";

// // const SellerProducts = () => {
// //   const navigate = useNavigate();
// //   const [products, setProducts] = useState([]);
// //   const [draftProducts, setDraftProducts] = useState([]);
// //   const [bids, setBids] = useState(null);
// //   const [bidLoading, setBidLoading] = useState(false);
// //   const [displayBids, setDisplayBids] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('active');

// //   const containerVariants = {
// //     hidden: { opacity: 0 },
// //     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
// //   };

// //   const itemVariants = {
// //     hidden: { opacity: 0, y: 20 },
// //     visible: { opacity: 1, y: 0 }
// //   };

// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         const token = localStorage.getItem('token');
// //         if (!token) {
// //           navigate('/login');
// //           return;
// //         }

// //         // Fetch both active and draft products
// //         const [activeResponse, draftResponse] = await Promise.all([
// //           axios.get('http://localhost:5000/api/seller/products', {
// //             headers: { Authorization: `Bearer ${token}` }
// //           }),
// //           axios.get('http://localhost:5000/api/products/drafts', {
// //             headers: { Authorization: `Bearer ${token}` }
// //           })
// //         ]);

// //         setProducts(activeResponse.data);
// //         setDraftProducts(draftResponse.data);
// //       } catch (error) {
// //         console.error('Error fetching products:', error);
// //         toast.error('Failed to load products');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProducts();
// //   }, [navigate]);

// //   const handleDelete = async (productId) => {
// //     if (window.confirm('Are you sure you want to delete this product? This action cannot be undone!')) {
// //       try {
// //         const token = localStorage.getItem('token');
// //         await axios.delete(`http://localhost:5000/api/products/${productId}`, {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });

// //         // Update both active and draft products lists
// //         setProducts(products.filter(product => product._id !== productId));
// //         setDraftProducts(draftProducts.filter(product => product._id !== productId));
// //         toast.success('Product deleted successfully');
// //       } catch (error) {
// //         console.error('Error deleting product:', error);
// //         toast.error(error.response?.data?.message || 'Failed to delete product');
// //       }
// //     }
// //   };

// //   const handleFetchBids = async (productId) => {
// //     setBidLoading(true);
// //     try {
// //       setDisplayBids(true);
// //       const token = localStorage.getItem('token');
// //       const response = await axios.get(`http://localhost:5000/api/bids/product/${productId}`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       setBids(response.data);
// //     } catch (error) {
// //       console.error('Error fetching bids:', error);
// //       toast.error('Failed to load bids.');
// //     } finally {
// //       setBidLoading(false);
// //     }
// //   }

// //   const handleAcceptBid = async (bidId, productId, bidderEmail, bidderName) => {
// //     const toastId = toast.loading('Accepting bid...');
// //     try {
// //       const token = localStorage.getItem('token');
// //       await axios.put(`http://localhost:5000/api/bids/accept`, {
// //         bidId: bidId,
// //         productId: productId,
// //         bidderEmail: bidderEmail
// //       }, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       toast.update(toastId, {
// //         render: `Payment Link has been sent to ${bidderName}!`,
// //         type: "success",
// //         isLoading: false,
// //         autoClose: 3000,
// //       });
// //       setDisplayBids(false);
// //     } catch (error) {
// //       const message = error?.response?.data?.message || "Unknown error occurred";
// //       console.log(message, "message");

// //       // Check for known Stripe capability error
// //       const isStripeCapabilityError = message.includes("capabilities enabled");

// //       if (isStripeCapabilityError) {
// //         toast.update(toastId, {
// //           render: `Seller's Stripe account isn't ready to receive payments. Ask them to complete onboarding.`,
// //           type: "error",
// //           isLoading: false,
// //           autoClose: 5000,
// //         });
// //       } else {
// //         toast.update(toastId, {
// //           render: `Failed to accept bid from ${bidderName}!`,
// //           type: "error",
// //           isLoading: false,
// //           autoClose: 3000,
// //         });
// //       }

// //     }
// //   }

// //   const handleEditProduct = (productId) => {
// //     navigate(`/dashboard/products/edit/${productId}`);
// //   };

// //   const handleViewProduct = (productId) => {
// //     navigate(`/product/${productId}`); // Assuming this is the route for viewing a single product
// //   };

// //   const renderProductsTable = (productsList) => (
// //     <motion.div
// //       variants={containerVariants}
// //       initial="hidden"
// //       animate="visible"
// //       className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 overflow-hidden shadow-sm"
// //     >
// //       <table className="w-full">
// //         <thead className="bg-[#043E52]/5">
// //           <tr>
// //             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Product</th>
// //             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Pricing</th>
// //             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Status</th>
// //             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Auction Dates</th>
// //             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody className="divide-y divide-[#016A6D]/20">
// //           {productsList.length > 0 ? (
// //             productsList.map((product) => (
// //               <motion.tr
// //                 key={product._id}
// //                 variants={itemVariants}
// //                 className="hover:bg-[#016A6D]/5 transition-colors"
// //               >
// //                 <td className="py-4 px-6 text-[#043E52] font-medium">{product.name}</td>
// //                 <td className="py-4 px-6">
// //                   <div className="flex flex-col">
// //                     <span className="text-[#016A6D] flex items-center gap-1">
// //                       PKR {product.startingPrice}
// //                     </span>
// //                     <span className="text-sm text-[#043E52]/80">
// //                       Current: {product.currentPrice ? `PKR ${product.currentPrice}` : '-'}
// //                     </span>
// //                   </div>
// //                 </td>
// //                 <td className="py-4 px-6">
// //                   <span className={`px-3 py-1 rounded-full ${
// //                     product.status === 'active'
// //                       ? 'bg-[#016A6D]/10 text-[#016A6D]'
// //                       : 'bg-[#FFAA5D]/10 text-[#E16A3D]'
// //                     }`}>
// //                     {product.status}
// //                   </span>
// //                 </td>
// //                 <td className="py-4 px-6 text-[#043E52]/80">
// //                   <div className="flex items-center gap-2">
// //                     <FiCalendar className="text-[#FFAA5D]" />
// //                     {new Date(product.startDate).toLocaleDateString()} - {' '}
// //                     {new Date(product.endDate).toLocaleDateString()}
// //                   </div>
// //                 </td>
// //                 <td className="py-4 px-6">
// //                   <div className="flex items-center gap-3">
// //                     <button
// //                       onClick={() => handleViewProduct(product._id)} // New View Product button
// //                       className="text-[#016A6D] hover:text-[#FFAA5D] transition-colors p-2"
// //                       title="View Product"
// //                     >
// //                       <FiEye className="w-5 h-5" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleEditProduct(product._id)}
// //                       className="text-[#016A6D] hover:text-[#FFAA5D] transition-colors p-2"
// //                       title="Edit Product"
// //                     >
// //                       <FiEdit className="w-5 h-5" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(product._id)}
// //                       className="text-[#E16A3D] hover:text-[#FFAA5D] transition-colors p-2"
// //                       title="Delete Product"
// //                     >
// //                       <FiTrash className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </motion.tr>
// //             ))
// //           ) : (
// //             <motion.tr variants={itemVariants}>
// //               <td colSpan="5" className="py-8 text-center text-[#043E52]/50">
// //                 No products found
// //               </td>
// //             </motion.tr>
// //           )}
// //         </tbody>
// //       </table>
// //     </motion.div>
// //   );

// //   return (
// //     <div className="container mx-auto px-4 py-8 font-serif">
// //       {displayBids && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
// //           <motion.div
// //             initial={{ scale: 0.95, opacity: 0 }}
// //             animate={{ scale: 1, opacity: 1 }}
// //             className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-[#016A6D]/20 w-full max-w-2xl relative shadow-xl"
// //           >
// //             <button
// //               onClick={() => {
// //                 setDisplayBids(false);
// //                 setBids(null);
// //               }}
// //               className="absolute top-4 right-4 text-[#043E52]/50 hover:text-[#E16A3D] transition-colors"
// //             >
// //               <FaTimes className="w-6 h-6" />
// //             </button>

// //             <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
// //               <FiUser className="text-[#FFAA5D]" />
// //               Live Bids
// //             </h2>

// //             {bidLoading ? (
// //               <div className="flex justify-center items-center py-6">
// //                 <div className="w-8 h-8 border-4 border-[#FFAA5D] border-t-transparent rounded-full animate-spin" />
// //               </div>
// //             ) : (
// //               <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
// //                 {bids && bids.length > 0 ? (
// //                   bids.map((bid) => (
// //                     <motion.div
// //                       key={bid._id}
// //                       initial={{ opacity: 0, y: 10 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       className="p-4 rounded-xl bg-[#016A6D]/5 hover:bg-[#016A6D]/10 transition-colors"
// //                     >
// //                       <div className="flex items-center justify-between">
// //                         <div>
// //                           <div className="font-medium text-[#043E52] flex items-center gap-2">
// //                             PKR {bid.amount.toLocaleString()}
// //                           </div>
// //                           <div className="text-sm text-[#043E52]/80 mt-1">
// //                             Bidder: {bid?.bidderId.name}
// //                           </div>
// //                         </div>
// //                         <div className="flex gap-2">
// //                           <button
// //                             onClick={() => handleAcceptBid(bid._id, bid.productId, bid.bidderId.email, bid.bidderId.name)}
// //                             className="p-2 bg-[#016A6D] text-white rounded-xl hover:bg-[#043E52] transition-colors"
// //                           >
// //                             <FaCheck className="w-5 h-5" />
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </motion.div>
// //                   ))
// //                 ) : (
// //                   <div className="text-center text-[#043E52]/60 py-4">
// //                     No active bids found
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </motion.div>
// //         </div>
// //       )}

// //       {/* Breadcrumb */}
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         className="mb-8"
// //       >
// //         <nav className="flex items-center text-[#043E52]/80 space-x-2">
// //           <motion.div
// //             initial={{ scale: 0 }}
// //             animate={{ scale: 1 }}
// //             className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
// //           />
// //           <button
// //             onClick={() => navigate('/dashboard')}
// //             className="hover:text-[#FFAA5D] transition-colors"
// //           >
// //             Dashboard
// //           </button>
// //           <FiArrowRight className="text-[#FFAA5D]" />
// //           <span className="font-medium text-[#043E52]">Products</span>
// //         </nav>
// //       </motion.div>

// //       {/* Products Table */}
// //       <div className="space-y-8">
// //         <div className="flex justify-between items-center">
// //           <h1 className="text-2xl font-bold text-[#043E52]">Your Products</h1>
// //           <div className="flex gap-3">
// //             <motion.button
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //               onClick={() => setActiveTab('active')}
// //               className={`px-6 py-2.5 rounded-xl transition-all ${
// //                 activeTab === 'active'
// //                   ? 'bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white'
// //                   : 'bg-[#016A6D]/10 text-[#043E52]'
// //                 }`}
// //             >
// //               Active Products
// //             </motion.button>
// //             <motion.button
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //               onClick={() => setActiveTab('drafts')}
// //               className={`px-6 py-2.5 rounded-xl transition-all ${
// //                 activeTab === 'drafts'
// //                   ? 'bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white'
// //                   : 'bg-[#016A6D]/10 text-[#043E52]'
// //                 }`}
// //             >
// //               Draft Products
// //             </motion.button>
// //           </div>
// //         </div>

// //         {loading ? (
// //           <div className="flex justify-center items-center py-12">
// //             <div className="w-8 h-8 border-4 border-[#FFAA5D] border-t-transparent rounded-full animate-spin" />
// //           </div>
// //         ) : (
// //           activeTab === 'active'
// //             ? renderProductsTable(products)
// //             : renderProductsTable(draftProducts)
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SellerProducts;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { motion } from "framer-motion";
// import { FiEdit, FiTrash, FiArrowRight, FiCalendar, FiUser, FiEye } from "react-icons/fi";
// import { FaCheck, FaTimes } from "react-icons/fa";

// const SellerProducts = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [draftProducts, setDraftProducts] = useState([]);
//   const [bids, setBids] = useState(null);
//   const [bidLoading, setBidLoading] = useState(false);
//   const [displayBids, setDisplayBids] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('active');

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     // Listen for storage events (token removal in other tabs)
//     const handleStorageChange = (e) => {
//       if (e.key === 'token') {
//         if (!e.newValue) {
//           navigate('/login');
//         }
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     // Fetch products
//     const fetchProducts = async () => {
//       try {
//         const [activeResponse, draftResponse] = await Promise.all([
//           axios.get('http://localhost:5000/api/seller/products', {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           axios.get('http://localhost:5000/api/products/drafts', {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         setProducts(activeResponse.data);
//         setDraftProducts(draftResponse.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem('token');
//           toast.error('Session expired. Please log in again.');
//           navigate('/login');
//         } else {
//           toast.error('Failed to load products');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();

//     // Cleanup
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, [navigate]);

//   const handleDelete = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product? This action cannot be undone!')) {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         await axios.delete(`http://localhost:5000/api/products/${productId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setProducts(products.filter(product => product._id !== productId));
//         setDraftProducts(draftProducts.filter(product => product._id !== productId));
//         toast.success('Product deleted successfully');
//       } catch (error) {
//         console.error('Error deleting product:', error);
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem('token');
//           toast.error('Session expired. Please log in again.');
//           navigate('/login');
//         } else {
//           toast.error(error.response?.data?.message || 'Failed to delete product');
//         }
//       }
//     }
//   };

//   const handleFetchBids = async (productId) => {
//     setBidLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       setDisplayBids(true);
//       const response = await axios.get(`http://localhost:5000/api/bids/product/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setBids(response.data);
//     } catch (error) {
//       console.error('Error fetching bids:', error);
//       if (error.response && error.response.status === 401) {
//         localStorage.removeItem('token');
//         toast.error('Session expired. Please log in again.');
//         navigate('/login');
//       } else {
//         toast.error('Failed to load bids.');
//       }
//     } finally {
//       setBidLoading(false);
//     }
//   }

//   const handleAcceptBid = async (bidId, productId, bidderEmail, bidderName) => {
//     const toastId = toast.loading('Accepting bid...');
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       await axios.put(`http://localhost:5000/api/bids/accept`, {
//         bidId: bidId,
//         productId: productId,
//         bidderEmail: bidderEmail
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.update(toastId, {
//         render: `Payment Link has been sent to ${bidderName}!`,
//         type: "success",
//         isLoading: false,
//         autoClose: 3000,
//       });
//       setDisplayBids(false);
//     } catch (error) {
//       const message = error?.response?.data?.message || "Unknown error occurred";
//       console.log(message, "message");

//       if (error.response && error.response.status === 401) {
//         localStorage.removeItem('token');
//         toast.update(toastId, {
//           render: `Session expired. Please log in again.`,
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//         navigate('/login');
//         return;
//       }

//       const isStripeCapabilityError = message.includes("capabilities enabled");
//       if (isStripeCapabilityError) {
//         toast.update(toastId, {
//           render: `Seller's Stripe account isn't ready to receive payments. Ask them to complete onboarding.`,
//           type: "error",
//           isLoading: false,
//           autoClose: 5000,
//         });
//       } else {
//         toast.update(toastId, {
//           render: `Failed to accept bid from ${bidderName}!`,
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//       }
//     }
//   }

//   const handleEditProduct = (productId) => {
//     navigate(`/dashboard/products/edit/${productId}`);
//   };

//   const handleViewProduct = (productId) => {
//     navigate(`/product/${productId}`);
//   };

//   const renderProductsTable = (productsList) => (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 overflow-hidden shadow-sm"
//     >
//       <table className="w-full">
//         <thead className="bg-[#043E52]/5">
//           <tr>
//             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Product</th>
//             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Pricing</th>
//             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Status</th>
//             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Auction Dates</th>
//             <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-[#016A6D]/20">
//           {productsList.length > 0 ? (
//             productsList.map((product) => (
//               <motion.tr
//                 key={product._id}
//                 variants={itemVariants}
//                 className="hover:bg-[#016A6D]/5 transition-colors"
//               >
//                 <td className="py-4 px-6 text-[#043E52] font-medium">{product.name}</td>
//                 <td className="py-4 px-6">
//                   <div className="flex flex-col">
//                     <span className="text-[#016A6D] flex items-center gap-1">
//                       PKR {product.startingPrice}
//                     </span>
//                     <span className="text-sm text-[#043E52]/80">
//                       Current: {product.currentPrice ? `PKR ${product.currentPrice}` : '-'}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="py-4 px-6">
//                   <span className={`px-3 py-1 rounded-full ${
//                     product.status === 'active'
//                       ? 'bg-[#016A6D]/10 text-[#016A6D]'
//                       : 'bg-[#FFAA5D]/10 text-[#E16A3D]'
//                     }`}>
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="py-4 px-6 text-[#043E52]/80">
//                   <div className="flex items-center gap-2">
//                     <FiCalendar className="text-[#FFAA5D]" />
//                     {new Date(product.startDate).toLocaleDateString()} - {' '}
//                     {new Date(product.endDate).toLocaleDateString()}
//                   </div>
//                 </td>
//                 <td className="py-4 px-6">
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => handleViewProduct(product._id)}
//                       className="text-[#016A6D] hover:text-[#FFAA5D] transition-colors p-2"
//                       title="View Product"
//                     >
//                       <FiEye className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleEditProduct(product._id)}
//                       className="text-[#016A6D] hover:text-[#FFAA5D] transition-colors p-2"
//                       title="Edit Product"
//                     >
//                       <FiEdit className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       className="text-[#E16A3D] hover:text-[#FFAA5D] transition-colors p-2"
//                       title="Delete Product"
//                     >
//                       <FiTrash className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </td>
//               </motion.tr>
//             ))
//           ) : (
//             <motion.tr variants={itemVariants}>
//               <td colSpan="5" className="py-8 text-center text-[#043E52]/50">
//                 No products found
//               </td>
//             </motion.tr>
//           )}
//         </tbody>
//       </table>
//     </motion.div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8 font-serif">
//       {displayBids && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-[#016A6D]/20 w-full max-w-2xl relative shadow-xl"
//           >
//             <button
//               onClick={() => {
//                 setDisplayBids(false);
//                 setBids(null);
//               }}
//               className="absolute top-4 right-4 text-[#043E52]/50 hover:text-[#E16A3D] transition-colors"
//             >
//               <FaTimes className="w-6 h-6" />
//             </button>

//             <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
//               <FiUser className="text-[#FFAA5D]" />
//               Live Bids
//             </h2>

//             {bidLoading ? (
//               <div className="flex justify-center items-center py-6">
//                 <div className="w-8 h-8 border-4 border-[#FFAA5D] border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : (
//               <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//                 {bids && bids.length > 0 ? (
//                   bids.map((bid) => (
//                     <motion.div
//                       key={bid._id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="p-4 rounded-xl bg-[#016A6D]/5 hover:bg-[#016A6D]/10 transition-colors"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <div className="font-medium text-[#043E52] flex items-center gap-2">
//                             PKR {bid.amount.toLocaleString()}
//                           </div>
//                           <div className="text-sm text-[#043E52]/80 mt-1">
//                             Bidder: {bid?.bidderId.name}
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleAcceptBid(bid._id, bid.productId, bid.bidderId.email, bid.bidderId.name)}
//                             className="p-2 bg-[#016A6D] text-white rounded-xl hover:bg-[#043E52] transition-colors"
//                           >
//                             <FaCheck className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))
//                 ) : (
//                   <div className="text-center text-[#043E52]/60 py-4">
//                     No active bids found
//                   </div>
//                 )}
//               </div>
//             )}
//           </motion.div>
//         </div>
//       )}

//       {/* Breadcrumb */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="mb-8"
//       >
//         <nav className="flex items-center text-[#043E52]/80 space-x-2">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
//           />
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="hover:text-[#FFAA5D] transition-colors"
//           >
//             Dashboard
//           </button>
//           <FiArrowRight className="text-[#FFAA5D]" />
//           <span className="font-medium text-[#043E52]">Products</span>
//         </nav>
//       </motion.div>

//       {/* Products Table */}
//       <div className="space-y-8">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-[#043E52]">Your Products</h1>
//           <div className="flex gap-3">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setActiveTab('active')}
//               className={`px-6 py-2.5 rounded-xl transition-all ${
//                 activeTab === 'active'
//                   ? 'bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white'
//                   : 'bg-[#016A6D]/10 text-[#043E52]'
//                 }`}
//             >
//               Active Products
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setActiveTab('drafts')}
//               className={`px-6 py-2.5 rounded-xl transition-all ${
//                 activeTab === 'drafts'
//                   ? 'bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white'
//                   : 'bg-[#016A6D]/10 text-[#043E52]'
//                 }`}
//             >
//               Draft Products
//             </motion.button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="w-8 h-8 border-4 border-[#FFAA5D] border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : (
//           activeTab === 'active'
//             ? renderProductsTable(products)
//             : renderProductsTable(draftProducts)
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerProducts;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { FiEdit, FiTrash, FiArrowRight, FiCalendar, FiUser, FiEye } from "react-icons/fi";
import { FaCheck, FaTimes } from "react-icons/fa";

const SellerProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [draftProducts, setDraftProducts] = useState([]);
  const [bids, setBids] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [displayBids, setDisplayBids] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Listen for storage events (token removal in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          navigate('/login');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Fetch products
    const fetchProducts = async () => {
      try {
        const [activeResponse, draftResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/seller/products', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/products/drafts', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProducts(activeResponse.data);
        setDraftProducts(draftResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone!')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProducts(products.filter(product => product._id !== productId));
        setDraftProducts(draftProducts.filter(product => product._id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to delete product');
        }
      }
    }
  };

  const handleFetchBids = async (productId) => {
    setBidLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setDisplayBids(true);
      const response = await axios.get(`http://localhost:5000/api/bids/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to load bids.');
      }
    } finally {
      setBidLoading(false);
    }
  }

  const handleAcceptBid = async (bidId, productId, bidderEmail, bidderName) => {
    const toastId = toast.loading('Accepting bid...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

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
    } catch (error) {
      const message = error?.response?.data?.message || "Unknown error occurred";
      console.log(message, "message");

      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        toast.update(toastId, {
          render: `Session expired. Please log in again.`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        navigate('/login');
        return;
      }

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
          render: `Failed to accept bid from ${bidderName}!`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  }

  const handleEditProduct = (productId) => {
    navigate(`/dashboard/products/edit/${productId}`);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderProductsTable = (productsList) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 overflow-hidden shadow-sm"
    >
      <table className="w-full">
        <thead className="bg-[#043E52]/5">
          <tr>
            <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Product</th>
            <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Pricing</th>
            <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Status</th>
            <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Auction Dates</th>
            <th className="py-4 px-6 text-left text-[#043E52] font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#016A6D]/20">
          {productsList.length > 0 ? (
            productsList.map((product) => (
              <motion.tr
                key={product._id}
                variants={itemVariants}
                className="hover:bg-[#016A6D]/5 transition-colors"
              >
                <td className="py-4 px-6 text-[#043E52] font-medium">{product.name}</td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-[#016A6D] flex items-center gap-1">
                      PKR {product.startingPrice}
                    </span>
                    <span className="text-sm text-[#043E52]/80">
                      Current: {product.currentPrice ? `PKR ${product.currentPrice}` : '-'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full ${
                    product.status === 'active'
                      ? 'bg-[#016A6D]/10 text-[#016A6D]'
                      : 'bg-[#FFAA5D]/10 text-[#E16A3D]'
                    }`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-[#043E52]/80">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-[#FFAA5D]" />
                    {new Date(product.startDate).toLocaleDateString()} - {' '}
                    {new Date(product.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewProduct(product._id)}
                      className="text-[#016A6D] hover:text-[#FFAA5D] transition-colors p-2"
                      title="View Product"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditProduct(product._id)}
                      className="text-[#016A6D] hover:text-[#FFAA5D] transition-colors p-2"
                      title="Edit Product"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-[#E16A3D] hover:text-[#FFAA5D] transition-colors p-2"
                      title="Delete Product"
                    >
                      <FiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))
          ) : (
            <motion.tr variants={itemVariants}>
              <td colSpan="5" className="py-8 text-center text-[#043E52]/50">
                No products found
              </td>
            </motion.tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 font-serif">
      {displayBids && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-[#016A6D]/20 w-full max-w-2xl relative shadow-xl"
          >
            <button
              onClick={() => {
                setDisplayBids(false);
                setBids(null);
              }}
              className="absolute top-4 right-4 text-[#043E52]/50 hover:text-[#E16A3D] transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
              <FiUser className="text-[#FFAA5D]" />
              Live Bids
            </h2>

            {bidLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="w-8 h-8 border-4 border-[#FFAA5D] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {bids && bids.length > 0 ? (
                  bids.map((bid) => (
                    <motion.div
                      key={bid._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-[#016A6D]/5 hover:bg-[#016A6D]/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-[#043E52] flex items-center gap-2">
                            PKR {bid.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-[#043E52]/80 mt-1">
                            Bidder: {bid?.bidderId.name}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptBid(bid._id, bid.productId, bid.bidderId.email, bid.bidderId.name)}
                            className="p-2 bg-[#016A6D] text-white rounded-xl hover:bg-[#043E52] transition-colors"
                          >
                            <FaCheck className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-[#043E52]/60 py-4">
                    No active bids found
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <nav className="flex items-center text-[#043E52]/80 space-x-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
          />
          <button
            onClick={() => navigate('/dashboard')}
            className="hover:text-[#FFAA5D] transition-colors"
          >
            Dashboard
          </button>
          <FiArrowRight className="text-[#FFAA5D]" />
          <span className="font-medium text-[#043E52]">Products</span>
        </nav>
      </motion.div>

      {/* Products Table */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#043E52]">Your Products</h1>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2.5 rounded-xl transition-all ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white'
                  : 'bg-[#016A6D]/10 text-[#043E52]'
                }`}
            >
              Active Products
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('drafts')}
              className={`px-6 py-2.5 rounded-xl transition-all ${
                activeTab === 'drafts'
                  ? 'bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white'
                  : 'bg-[#016A6D]/10 text-[#043E52]'
                }`}
            >
              Draft Products
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-[#FFAA5D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          activeTab === 'active'
            ? renderProductsTable(products)
            : renderProductsTable(draftProducts)
        )}
      </div>
    </div>
  );
};

export default SellerProducts;