import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const FavouriteBids = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [similarProducts, setSimilarProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filter out any null products and map to get only valid products
        const validFavorites = response.data.filter(fav => fav.product !== null);
        setFavorites(validFavorites.map(fav => fav.product));

        // Fetch similar products for each favorite
        const similarPromises = validFavorites.map(async (favorite) => {
          if (!favorite.product || !favorite.product._id) return null;
          
          try {
            const similarResponse = await axios.get(
              `http://localhost:5000/api/products/similar/${favorite.product._id}`
            );
            return {
              productId: favorite.product._id,
              products: similarResponse.data
            };
          } catch (error) {
            console.error('Error fetching similar products:', error);
            return null;
          }
        });

        const similarResults = await Promise.all(similarPromises);
        const similarMap = {};
        similarResults.forEach(result => {
          if (result) {
            similarMap[result.productId] = result.products;
          }
        });
        setSimilarProducts(similarMap);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Group similar products by category
  const getSimilarProductsByCategory = () => {
    const categoryMap = {};
    
    // Collect all similar products
    Object.values(similarProducts).forEach(products => {
      products.forEach(product => {
        if (!categoryMap[product.category]) {
          categoryMap[product.category] = [];
        }
        categoryMap[product.category].push(product);
      });
    });

    return categoryMap;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const similarProductsByCategory = getSimilarProductsByCategory();

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Favourite Bids Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-red-500 w-2 h-6 mr-2 rounded-full"></span>
            Favourite Bids
          </h2>
          
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't favorited any products yet.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Similar Products by Category */}
              {Object.keys(similarProductsByCategory).length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-red-500 w-2 h-5 mr-2 rounded-full"></span>
                    Similar Products by Category
                  </h3>
                  {Object.entries(similarProductsByCategory).map(([category, products]) => (
                    <div key={category} className="mb-8">
                      <h4 className="text-lg font-semibold mb-4">{category}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavouriteBids;