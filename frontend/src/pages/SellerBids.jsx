import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';

const SellerBids = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [draftProducts, setDraftProducts] = useState([]);
  const [bids, setBids] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [displayBids, setDisplayBids] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'drafts'
  // const BASEURL = "https://subhan-project-backend.onrender.com";
  // const BASEURL = "http://localhost:5000";api/bids/product/:productId
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
        ]);

        setProducts(activeResponse.data);
        setDraftProducts(draftResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // toast.error('Failed to load products');
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
const handleFetchBids = async (productId) => {
   setBidLoading(true);
  try {
    setDisplayBids(true);
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/bids/product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBids(response.data);
    // console.log('Bids:', response.data);
  } catch (error) {
    console.error('Error fetching bids:', error);
  }finally{
    setBidLoading(false);
  }
}

const handleAcceptBid = async (bidId,productId,bidderEmail,bidderName) => {
      const toastId = toast.loading('Accepting bid...');
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/bids/accept`, {
      bidId:bidId,
      productId:productId,
      bidderEmail:bidderEmail
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
     console.log(message,"message");
     
    // Check for known Stripe capability error
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

    console.error('Error accepting bid:', message);
  }
}
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
    {displayBids && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
      <button
        onClick={() => {
          setDisplayBids(false);
          setBids(null);
        }}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <X size={28} />
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center">Live Bids</h2>

      {bidLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scroll">
          {bids && bids.length > 0 ? (
            bids.map((bid) => (
              <div
                key={bid._id}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition"
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    💵 Amount: PKR {bid.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    👤 User: {bid?.bidderId.name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAcceptBid(
                        bid._id,
                        bid.productId,
                        bid.bidderId.email,
                        bid.bidderId.name
                      )
                    }
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleReject(bid._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No bids yet.</div>
          )}
        </div>
      )}
    </div>
  </div>
)}

      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <div className="bg-red-600 w-3 h-6 mr-2"></div>
        <nav className="text-sm md:text-base">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/seller-dashboard" className="hover:text-red-600 transition-colors">Dashboard</a></li>
            <li>/</li>
            <li className="font-medium text-gray-700">Active Bids</li>
          </ol>
        </nav>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {products.length > 0 && products?.map((item) => (
    <Link
    to={`/dashboard/products/${item._id}`}
      key={item._id}
      className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden"
    >
      {/* Image */}
      <div className="md:w-1/3 w-full h-64 md:h-[200px]">
        <img
          src={item.images?.[0] || 'https://via.placeholder.com/300'}
          alt={item.name}
          className="object-contain h-full w-full"
        />
      </div>

      {/* Info */}
      <div className="md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          <p className="text-gray-600 mb-1">
            Status: <span className="capitalize text-yellow-600">{item.status}</span>
          </p>
          <p className="text-gray-600 mb-1">
            Start Date: <span className="text-black">{new Date(item.startDate).toDateString()}</span>
          </p>
          <p className="text-gray-600 mb-1">
            End Date: <span className="text-black">{new Date(item.endDate).toDateString()}</span>
          </p>
          <p className="text-gray-800 text-lg mt-2">Starting Price: Rs:{item.startingPrice.toLocaleString()}</p>
          <button className='mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>See Bids</button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.isDraft && (
            <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full">Draft</span>
          )}
          <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
            ID: {item._id}
          </span>
        </div>
      </div>
    </Link>
  ))}
</div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* <div className="flex justify-between items-center mb-6">
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
        </div> */}
        
        {loading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
          activeTab === 'active' ? "" : renderProductsTable(draftProducts)
        )}
      </div>
    </div>
  );
};

export default SellerBids;