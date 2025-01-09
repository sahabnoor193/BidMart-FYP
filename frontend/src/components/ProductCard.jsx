import { FiHeart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
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
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <FiHeart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
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
