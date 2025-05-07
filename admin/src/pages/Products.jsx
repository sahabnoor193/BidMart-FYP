import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserEmail } from '../features/Dashboard_Slices';
import { fetchAllProducts, selectAllProducts, selectLoadingState, selectError , setSingleProduct, deleteProduct } from '../features/Products_Slice';
import { FiDelete } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [displaeyDeleteModel, setDisplayDeleteModel] = useState(null);
 const [loadingDelete, setLoadingDelete] = useState(false);
  // const ha
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
  const handleDeleteProduct = () => {
    const loadingToast = toast.loading("Deleting product...");
    setLoadingDelete(true);
    dispatch(deleteProduct(displaeyDeleteModel._id))
      .unwrap()
      .then(() => {
        toast.update(loadingToast, {
          render: "Product deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        dispatch(fetchAllProducts());
        setDisplayDeleteModel(null);
      })
      .catch((error) => {
        toast.update(loadingToast, {
          render: error?.message || "Failed to delete product.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
    setLoadingDelete(false);
  };
  // /api/products
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
      {displaeyDeleteModel && (
      <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/50'>
      <div className='bg-white p-8 rounded-lg max-w-4xl'>
        <h2 className='text-2xl font-bold mb-4'>Delete Product</h2>
        <p className='mb-4'>Are you sure you want to delete this product?</p>
        <div className='flex justify-end'>
          <button className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2 cursor-pointer' onClick={() => setDisplayDeleteModel(null)}>Cancel</button>
          <button className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer' onClick={handleDeleteProduct}>{loadingDelete ? "Deleting..." : "Delete"}</button>
      </div>
  </div>
  </div>
      )}

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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
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
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  
                  <button className=' cursor-pointer flex items-center justify-center w-full h-full'>
                  <MdDelete color='red' size={20} onClick={() => setDisplayDeleteModel(product)}/>
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