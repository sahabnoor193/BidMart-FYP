
import React, { useState } from 'react';

const ProductGallery = ({ 
  mainImage = 'https://via.placeholder.com/400',
  thumbnails = ['https://via.placeholder.com/100']
}) => {
  const [currentImage, setCurrentImage] = useState(mainImage);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-2 order-2 md:order-1">
        {thumbnails.map((thumb, index) => (
          <button
            key={index}
            className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden transition-opacity duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentImage === thumb ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setCurrentImage(thumb)}
          >
            <img 
              src={thumb} 
              alt={`Product view ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/100';
              }}
            />
          </button>
        ))}
      </div>
      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden h-96 order-1 md:order-2">
        <img 
          src={currentImage} 
          alt="Product main view" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400';
          }}
        />
      </div>
    </div>
  );
};

export default ProductGallery;