
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#e6f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#016A6D]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-[#e6f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#E16A3D]">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#e6f2f5] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-[#016A6D] uppercase tracking-wider mb-2">
            Featured Auctions
          </h2>
          <h1 className="text-4xl font-bold text-[#043E52] mb-4">
            Explore <span className="text-[#FFAA5D]">Premium</span> Bids
          </h1>
          <p className="text-lg text-[#043E52]/80 max-w-2xl mx-auto">
            Hand-picked auctions featuring exclusive items
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-[#016A6D] rounded-full"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Array.isArray(products) && products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link to="/allproducts">
            <button className="bg-[#FFAA5D] hover:bg-[#E16A3D] text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] focus:ring-opacity-50">
              Browse All Auctions
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreBids;