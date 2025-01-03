// src/components/ProductCard.jsx
import { FiHeart } from 'react-icons/fi'

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-gray-100">
          <FiHeart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
        <p className="text-red-600 font-bold">${product.price}</p>
      </div>
    </div>
  )
}

export default ProductCard