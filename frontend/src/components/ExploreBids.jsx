import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExploreBids = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/active');
        const productsData = Array.isArray(response.data) ? response.data : [];
        // Get only 4 random products for explore section
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
        
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="pb-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-black flex items-center mb-4">
          <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
          Explore Bids
        </h2>
        <h1 className="text-3xl font-bold text-red-500 mb-6">
          Browse All The Bids
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(products) && products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link to="/allproducts">
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded shadow-lg">
              View All Bids
            </button>
          </Link>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="flex justify-center mt-8">
        <hr
          className="border-black w-11/12 border-2"
          style={{ margin: '0 auto' }}
        />
      </div>
    </section>
  );
};

export default ExploreBids;
