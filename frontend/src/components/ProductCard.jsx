import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        console.log('[ProductCard] Checking favorite status for product:', product._id);
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('[ProductCard] No token found, user not logged in');
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/favorites/${product._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('[ProductCard] Favorite status response:', response.data);
        setIsFavorite(response.data.isFavorited);
      } catch (error) {
        console.error('[ProductCard] Error checking favorite status:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          console.log('[ProductCard] User not authenticated');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [product._id]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent the Link navigation
    try {
      console.log('[ProductCard] Toggling favorite for product:', product._id);
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('[ProductCard] No token found, redirecting to login');
        // You might want to redirect to login here
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/favorites/${product._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[ProductCard] Toggle favorite response:', response.data);
      setIsFavorite(response.data.isFavorited);

      // Trigger a refresh of the seller dashboard data
      if (localStorage.getItem('userType') === 'seller') {
        try {
          const dashboardResponse = await axios.get('http://localhost:5000/api/seller/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Update local storage to trigger a refresh in the dashboard
          localStorage.setItem('sellerData', JSON.stringify(dashboardResponse.data));
          // Dispatch a storage event to notify other components
          window.dispatchEvent(new Event('storage'));
        } catch (error) {
          console.error('[ProductCard] Error refreshing seller dashboard:', error);
        }
      }
    } catch (error) {
      console.error('[ProductCard] Error toggling favorite:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.log('[ProductCard] User not authenticated');
        // You might want to redirect to login here
      }
    }
  };

  // Get the first image from the images array or use a placeholder
  const productImage = product.images && product.images.length > 0
    ? product.images[product.mainImageIndex || 0]
    : 'https://via.placeholder.com/150';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden transition-transform transform hover:scale-105">
      <Link to={`/product/${product._id}`}>
        {/* Image Section */}
        <div className="w-full">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
        </div>

        {/* Product Details Section */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-center text-lg font-medium text-black mb-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-2">
            {(() => {
              const now = new Date();
              const startDate = new Date(product.startDate);
              const endDate = new Date(product.endDate);

              let status, style;
              if (now < startDate) {
                status = 'Not Started';
                style = 'bg-gray-100 text-gray-800';
              } else if (now >= startDate || now <= endDate) {
                status = 'Live Now';
                style = 'bg-green-100 text-green-800';
              } else {
                status = 'Ended';
                style = 'bg-gray-100 text-gray-800';
              }

              return (
                <span className={`text-sm px-2 py-1 rounded-full ${style}`}>
                  {status}
                </span>
              );
            })()}
          </div>


          {/* Price and Heart */}
          <div className="flex items-center justify-between">
            <p className="text-red-500 font-bold text-lg">PKR {product.startingPrice}</p>
            <button
              className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={toggleFavorite}
              disabled={isLoading}
            >
              <FiHeart
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
              />
            </button>
          </div>

          {/* Additional Details */}
          <div className="mt-2 text-sm text-gray-600">
            <p>Location: {product.city || 'N/A'}, {product.country || 'N/A'}</p>
            <p>Category: {product.category || 'Uncategorized'}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    startingPrice: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    mainImageIndex: PropTypes.number,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;

// src/components/ProductCard.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaShoppingCart, FaRegHeart } from 'react-icons/fa';

// const ProductCard = ({ product }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//       {/* Image Container */}
//       <div className="relative group">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-48 object-cover"
//         />
//         {/* Hover Overlay */}
//         <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
//           <button className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
//             <FaShoppingCart size={20} />
//           </button>
//           <button className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
//             <FaRegHeart size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="p-4">
//         <Link to={`/product/${product.id}`}>
//           <h3 className="text-lg font-semibold mb-2 hover:text-red-500 transition-colors">
//             {product.name}
//           </h3>
//         </Link>
//         <div className="flex justify-between items-center">
//           <span className="text-xl font-bold text-red-500">${product.price}</span>
//           <span className="text-sm text-gray-500">{product.date}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;



