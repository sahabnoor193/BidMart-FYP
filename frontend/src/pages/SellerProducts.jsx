import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [draftProducts, setDraftProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'drafts'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch both active and draft products
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
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone!')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update both active and draft products lists
        setProducts(products.filter(product => product._id !== productId));
        setDraftProducts(draftProducts.filter(product => product._id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/dashboard/products/edit/${productId}`);
  };

  const renderProductsTable = (productsList) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left border">Product Name</th>
            <th className="py-2 px-4 text-left border">Start Price</th>
            <th className="py-2 px-4 text-left border">Current Price</th>
            <th className="py-2 px-4 text-left border">Status</th>
            <th className="py-2 px-4 text-left border">Auction Dates</th>
            <th className="py-2 px-4 text-left border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsList.length > 0 ? (
            productsList.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="py-2 px-4 border">{product.name}</td>
                <td className="py-2 px-4 border">${product.startingPrice}</td>
                <td className="py-2 px-4 border">${product.currentPrice || '-'}</td>
                <td className="py-2 px-4 border capitalize">{product.status}</td>
                <td className="py-2 px-4 border">
                  {new Date(product.startDate).toLocaleDateString()} - {' '}
                  {new Date(product.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex space-x-2">
                  <Link className="text-green-600 hover:text-green-800" to={`/dashboard/products/${product._id}`}>
                      View                     
                    </Link>
                    <button 
                      onClick={() => handleEditProduct(product._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center text-gray-500 border">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <div className="bg-red-600 w-3 h-6 mr-2"></div>
        <nav className="text-sm md:text-base">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/dashboard" className="hover:text-red-600 transition-colors">Dashboard</a></li>
            <li>/</li>
            <li className="font-medium text-gray-700">Products</li>
          </ol>
        </nav>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">Your Products</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded ${
                activeTab === 'active' ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            >
              Active Products
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-4 py-2 rounded ${
                activeTab === 'drafts' ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            >
              Draft Products
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
          activeTab === 'active' ? renderProductsTable(products) : renderProductsTable(draftProducts)
        )}
      </div>
    </div>
  );
};

export default SellerProducts;