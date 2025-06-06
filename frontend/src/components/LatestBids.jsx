import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const LatestBids = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/active');
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
        setProducts([]);
      }
    };

    fetchLatestProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#e6f2f5] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#016A6D]"
            />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#e6f2f5] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#043E52] bg-white/80 p-6 rounded-xl shadow-lg border border-[#016A6D]/20">
            {error}
            <motion.button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#E16A3D] text-white px-4 py-2 rounded-lg hover:bg-[#C45A2D] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#e6f2f5] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block relative">
            <h1 className="text-4xl font-bold text-[#043E52] mb-4 relative z-10">
              Latest <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D]">Live</span> Auctions
            </h1>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute bottom-0 h-2 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] z-0"
              style={{ originX: 0 }}
            />
          </div>
          <p className="text-lg text-[#043E52]/80 max-w-2xl mx-auto">
            Discover the hottest items up for bid right now. Don't miss your chance to win!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Array.isArray(products) && products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -10 }}
              className="hover:shadow-xl transition-shadow duration-300"
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
            <motion.button 
              className="bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] hover:brightness-110 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Auctions <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Animated decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute left-0 -bottom-20 w-full h-40 bg-gradient-to-r from-[#016A6D] to-[#FFAA5D] blur-3xl -z-10"
        />
      </div>
    </section>
  );
};

export default LatestBids;