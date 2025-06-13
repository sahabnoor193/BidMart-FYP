// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { setUserEmail } from '../features/Dashboard_Slices';
// import { fetchAllProducts, selectAllProducts, selectLoadingState, selectError , setSingleProduct } from '../features/Products_Slice';

// const Products = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   // Redux state
//   const products = useSelector(selectAllProducts);
//   const loading = useSelector(selectLoadingState);
//   const error = useSelector(selectError);
//   const user_Email = useSelector((state) => state.dashboard.user_Email);
//   const single_product = useSelector((state) => state.products.single_product);
//   // Fetch products on component mount
//   useEffect(() => {
//     dispatch(fetchAllProducts());
//   }, [dispatch]);

//   const Product_Redirection = (id) => {
//     dispatch(setSingleProduct(id));
//     navigate("/Product_Detail");
//   };
  
//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Product Management</h1>
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.map((product) => (
//               <tr key={product._id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.startingPrice?.toLocaleString() || '0'}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {product.user?.name || 'Unknown'}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <button
//                     onClick={() => Product_Redirection(product)}
//                     className="text-blue-600 hover:text-blue-900 border border-blue-600 p-2 rounded-md lg:ms-2 cursor-pointer"
//                   >
//                     VIEW
//                   </button>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <button
//                     className={`${
//                       product.status === 'active' || product.status === 'ACTIVE'
//                         ? 'text-green-600 hover:text-green-900 border-green-300'
//                         : 'text-red-600 hover:text-red-900 border-red-600'
//                     } border rounded-md cursor-pointer p-2`}
//                   >
//                     {product.status || 'PENDING'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Products;



//UPDATED UI BY SANIA
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserEmail } from '../features/Dashboard_Slices';
import { fetchAllProducts, selectAllProducts, selectLoadingState, selectError, setSingleProduct } from '../features/Products_Slice';
import { motion } from 'framer-motion';
import { FiLoader, FiAlertCircle, FiEye, FiDollarSign, FiTag, FiPackage, FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoadingState);
  const error = useSelector(selectError);
  const user_Email = useSelector((state) => state.dashboard.user_Email);
  const single_product = useSelector((state) => state.products.single_product);

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

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const Product_Redirection = (id) => {
    dispatch(setSingleProduct(id));
    navigate("/Product_Detail");
  };
  
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-[#016A6D]"
          >
            <FiLoader className="w-12 h-12" />
          </motion.div>
        </div>
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
              <h3 className="font-semibold">Error loading products</h3>
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
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8 w-full"
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
        {/* <motion.div variants={itemVariants} className="mb-8">
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
                <li className="font-medium text-[#043E52]">Products</li>
              </ol>
            </nav>
          </div>
        </motion.div> */}

        {/* Page Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-[#043E52] mb-8 flex items-center gap-3"
        >
          <FiPackage className="text-[#FFAA5D]" />
          Product Management
        </motion.h1>

        {/* Products Table */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-[#016A6D]/20"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#016A6D]/20">
              <thead className="bg-[#043E52]/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiTag className="w-4 h-4" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4" />
                      Price
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      Seller
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">View</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#043E52] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#016A6D]/20">
                {products.map((product, index) => (
                  <motion.tr 
                    key={product._id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: 'rgba(1, 106, 109, 0.03)' }}
                    className="transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#043E52]">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#016A6D] font-medium">
                      PKR {product.startingPrice?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#043E52]/90 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#043E52]/90">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#043E52]/90">
                      {product.user?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => Product_Redirection(product)}
                        className="text-[#016A6D] hover:text-[#FFAA5D] border border-[#016A6D]/30 hover:border-[#FFAA5D]/50 p-2 rounded-lg flex items-center gap-1 transition-colors duration-200"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View</span>
                      </motion.button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        (product.status === 'active' || product.status === 'ACTIVE') 
                          ? 'bg-[#016A6D]/10 text-[#016A6D]' 
                          : 'bg-[#E16A3D]/10 text-[#E16A3D]'
                      }`}>
                        {(product.status === 'active' || product.status === 'ACTIVE') 
                          ? <FiCheckCircle className="w-4 h-4" /> 
                          : <FiXCircle className="w-4 h-4" />}
                        {product.status || 'PENDING'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Products;

// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { FiTrash2, FiEye } from 'react-icons/fi';
// import { 
//   fetchAllProducts, 
//   selectAllProducts, 
//   selectLoadingState, 
//   selectError, 
//   setSingleProduct,
//   deleteProduct 
// } from '../features/Products_Slice';

// const Products = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   // Redux state
//   const products = useSelector(selectAllProducts);
//   const loading = useSelector(selectLoadingState);
//   const error = useSelector(selectError);

//   // Fetch products on component mount
//   useEffect(() => {
//     dispatch(fetchAllProducts());
//   }, [dispatch]);

//   const handleViewProduct = (product) => {
//     dispatch(setSingleProduct(product._id));
//     navigate("/Product_Detail");
//   };

//   const handleDelete = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
//       try {
//         const resultAction = await dispatch(deleteProduct(productId));
//         if (deleteProduct.fulfilled.match(resultAction)) {
//           alert('Product deleted successfully');
//         } else {
//           throw new Error(resultAction.payload || 'Failed to delete product');
//         }
//       } catch (error) {
//         alert(error.message);
//         console.error('Delete product error:', error);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 mt-32">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8 mt-32">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow-md rounded-lg p-8 text-center">
//           <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
//           <p className="text-gray-500 mt-2">There are currently no products to display</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Product Management</h1>
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {products.map((product) => (
//                 <tr key={product._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.startingPrice?.toLocaleString() || '0'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {product.user?.name || 'Unknown'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleViewProduct(product)}
//                         className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50"
//                         title="View"
//                       >
//                         <FiEye size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product._id)}
//                         className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
//                         title="Delete"
//                         disabled={loading}
//                       >
//                         <FiTrash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       product.status === 'active' || product.status === 'ACTIVE'
//                         ? 'bg-green-100 text-green-800'
//                         : product.status === 'draft'
//                         ? 'bg-gray-100 text-gray-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {product.status || 'PENDING'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;