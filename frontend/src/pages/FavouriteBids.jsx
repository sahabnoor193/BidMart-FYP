import React from 'react';
import FavouriteCards from '../components/FavouriteCards';
import SimilarCards from '../components/SimilarCards';

const FavouriteBids = () => {
  // Sample product data - replace with your actual data
  const products = [
    {
      id: 1,
      name: 'RGB Gaming Keyboard',
      price: 20,
      image: '/path-to-keyboard-image.jpg', // Replace with actual image path
    },
    {
      id: 2,
      name: 'Gaming Monitor',
      price: 20,
      image: '/path-to-monitor-image.jpg', // Replace with actual image path
    },
    {
      id: 3,
      name: 'Gaming Controller',
      price: 20,
      image: '/path-to-controller-image.jpg', // Replace with actual image path
    },
    {
      id: 4,
      name: 'RGB Cooler',
      price: 20,
      image: '/path-to-cooler-image.jpg', // Replace with actual image path
    },
    
  ];

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Favourite Bids Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-red-500 w-2 h-6 mr-2 rounded-full"></span>
            Favourite Bids
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <FavouriteCards key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">
              See All Products
            </button>
          </div>
        </div>

        {/* Similar Bids Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-red-500 w-2 h-6 mr-2 rounded-full"></span>
            Similar Bids
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <SimilarCards key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">
              See All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavouriteBids;