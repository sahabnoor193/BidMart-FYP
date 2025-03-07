import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';

const SimilarCards = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false); // State to track if the product is a favorite

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Toggle the favorite status
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden transition-transform transform hover:scale-105">
      {/* Image Section */}
      <div className="w-full">
        <img
          src={product.image}
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

        {/* Price and Heart */}
        <div className="flex items-center justify-between">
          <p className="text-red-500 font-bold text-lg">${product.price}</p>
          <button 
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
            onClick={toggleFavorite} // Toggle favorite on click
          >
            <FiHeart 
              className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`} // Change heart color based on favorite status
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarCards;