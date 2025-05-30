import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserEmail } from '../features/Dashboard_Slices';
import { fetchAllProducts, selectAllProducts, selectLoadingState, selectError , setSingleProduct } from '../features/Products_Slice';

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoadingState);
  const error = useSelector(selectError);
  const user_Email = useSelector((state) => state.dashboard.user_Email);
  const single_product = useSelector((state) => state.products.single_product);
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.startingPrice?.toLocaleString() || '0'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.user?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => Product_Redirection(product)}
                    className="text-blue-600 hover:text-blue-900 border border-blue-600 p-2 rounded-md lg:ms-2 cursor-pointer"
                  >
                    VIEW
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className={`${
                      product.status === 'active' || product.status === 'ACTIVE'
                        ? 'text-green-600 hover:text-green-900 border-green-300'
                        : 'text-red-600 hover:text-red-900 border-red-600'
                    } border rounded-md cursor-pointer p-2`}
                  >
                    {product.status || 'PENDING'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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