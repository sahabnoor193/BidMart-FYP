import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/seller/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

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
        <h1 className="text-2xl font-bold text-red-600 mb-4">Your Products</h1>
        
        {loading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left border">Product Name</th>
                  <th className="py-2 px-4 text-left border">Start Price</th>
                  <th className="py-2 px-4 text-left border">Current Price</th>
                  <th className="py-2 px-4 text-left border">Status</th>
                  <th className="py-2 px-4 text-left border">Auction Dates</th>
                  <th className="py-2 px-4 text-left border">Draft</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="py-2 px-4 border">{product.name}</td>
                      <td className="py-2 px-4 border">${product.startingPrice}</td>
                      <td className="py-2 px-4 border">${product.currentPrice || '-'}</td>
                      <td className="py-2 px-4 border capitalize">{product.status}</td>
                      <td className="py-2 px-4 border">
                        {new Date(product.startDate).toLocaleDateString()} - {' '}
                        {new Date(product.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border">{product.isDraft ? 'Yes' : 'No'}</td>
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
        )}
      </div>
    </div>
  );
};

export default SellerProducts;