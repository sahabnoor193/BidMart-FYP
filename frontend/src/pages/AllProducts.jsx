import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes, FaArrowUp, FaArrowDown, FaCalendarAlt } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState(200);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const minPrice = 0;
  const maxPrice = 500000;
  
  const categories = [
    { id: 1, name: 'Mobile Phones' },
    { id: 2, name: 'Laptops' },
    { id: 3, name: 'Camera Equipment' },
    { id: 4, name: 'Tablets' },
    { id: 6, name: 'Home Appliances' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Grab the `?category=` param
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const initialCategory = urlParams.get('category');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/active');
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
        setFilteredProducts(productsData);
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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, priceRange, sortOption, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...filteredProducts];

    switch (option) {
      case 'low-to-high':
        sorted.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'high-to-low':
        sorted.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'new-to-old':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'old-to-new':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  // Seed selectedCategories from URL on first load
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply price filter
    filtered = filtered.filter((product) => product.startingPrice <= priceRange);

    // Apply sorting
    if (sortOption) {
      handleSort(sortOption);
    } else {
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f2f5] to-white">
        <div className="text-xl text-[#043E52]">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f2f5] to-white">
        <div className="text-xl text-[#E16A3D]">Error: {error}</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Decorative Border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
      />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
            />
            <nav className="text-sm md:text-base text-[#043E52]/80">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#FFAA5D] transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="font-medium text-[#043E52]">All Products</li>
              </ol>
            </nav>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Toggle Button */}
          <button
            className="fixed top-40 left-4 bg-[#016A6D] text-white p-3 rounded-full shadow-lg z-50 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaFilter size={20} />
          </button>

          {/* Sidebar */}
          <motion.div
            variants={itemVariants}
            className={`
              fixed lg:relative top-0 left-0 
              h-screen lg:h-auto
              w-[85%] sm:w-[70%] md:w-[50%] lg:w-80 
              bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl z-40
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
              lg:translate-x-0 overflow-y-auto
            `}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-xl text-[#043E52]">Filters</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-[#043E52] hover:text-[#E16A3D] lg:hidden"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4 text-[#043E52] border-b border-[#016A6D]/20 pb-2">
                Category
              </h4>
              <div className="space-y-3">
                {categories.map((category) => (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    key={category.id}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                      className="h-5 w-5 rounded border-gray-300 text-[#016A6D] focus:ring-[#016A6D]"
                    />
                    <label 
                      htmlFor={`cat-${category.id}`}
                      className="ml-3 text-[#043E52] cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4 text-[#043E52] border-b border-[#016A6D]/20 pb-2">
                Price Range
              </h4>
              <div className="mb-4">
                <div className="flex justify-between text-[#043E52] mb-2">
                  <span>PKR {minPrice.toLocaleString()}</span>
                  <span>PKR {priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#016A6D]"
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4 text-[#043E52] border-b border-[#016A6D]/20 pb-2">
                Sort By
              </h4>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left flex items-center p-3 rounded-lg ${sortOption === 'low-to-high' ? 'bg-[#016A6D]/10 border border-[#016A6D]/30' : 'bg-white'}`}
                  onClick={() => handleSort('low-to-high')}
                >
                  <FaArrowUp className="text-[#016A6D] mr-3" />
                  <span className="text-[#043E52]">Price: Low to High</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left flex items-center p-3 rounded-lg ${sortOption === 'high-to-low' ? 'bg-[#016A6D]/10 border border-[#016A6D]/30' : 'bg-white'}`}
                  onClick={() => handleSort('high-to-low')}
                >
                  <FaArrowDown className="text-[#016A6D] mr-3" />
                  <span className="text-[#043E52]">Price: High to Low</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left flex items-center p-3 rounded-lg ${sortOption === 'new-to-old' ? 'bg-[#016A6D]/10 border border-[#016A6D]/30' : 'bg-white'}`}
                  onClick={() => handleSort('new-to-old')}
                >
                  <FaCalendarAlt className="text-[#016A6D] mr-3" />
                  <span className="text-[#043E52]">Newest First</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left flex items-center p-3 rounded-lg ${sortOption === 'old-to-new' ? 'bg-[#016A6D]/10 border border-[#016A6D]/30' : 'bg-white'}`}
                  onClick={() => handleSort('old-to-new')}
                >
                  <FaCalendarAlt className="text-[#016A6D] mr-3" />
                  <span className="text-[#043E52]">Oldest First</span>
                </motion.button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3 rounded-lg font-semibold"
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange(maxPrice);
                setSortOption('');
              }}
            >
              Clear All Filters
            </motion.button>
          </motion.div>

          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-3xl font-bold text-[#043E52] mb-2">
                Discover Amazing Products
              </h2>
              <p className="text-[#016A6D]">
                {filteredProducts.length} products available
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="grid gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
            >
              {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* See More Button */}
            {filteredProducts.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="flex justify-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3 px-8 rounded-full font-semibold shadow-lg"
                >
                  Load More Products
                </motion.button>
              </motion.div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <motion.div 
                variants={itemVariants}
                className="text-center py-16"
              >
                <div className="text-4xl mb-4 text-[#016A6D]">🛍️</div>
                <h3 className="text-2xl font-semibold text-[#043E52] mb-2">
                  No Products Found
                </h3>
                <p className="text-[#043E52]/90 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#016A6D] to-[#043E52] text-white py-2 px-6 rounded-full"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange(maxPrice);
                    setSortOption('');
                  }}
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AllProducts;