import React, { useEffect, useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState(200);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const minPrice = 0;
  const maxPrice = 500000; // Max price set to 500,000 PKR
  const categories = [
    { id: 1, name: 'Mobile Phones' },
    { id: 2, name: 'Laptops' },
    { id: 3, name: 'Cameras' },
    { id: 4, name: 'Tablets' },
    { id: 5, name: 'Accessories' },
    { id: 6, name: 'Home Appliances' },
  ];

  const locations = [
    { id: 'karachi', name: 'Karachi' },
    { id: 'lahore', name: 'Lahore' },
    { id: 'islamabad', name: 'Islamabad' },
    { id: 'rawalpindi', name: 'Rawalpindi' },
    { id: 'peshawar', name: 'Peshawar' },
    { id: 'quetta', name: 'Quetta' },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('[Frontend] Starting products fetch');
        const response = await axios.get('http://localhost:5000/api/products/active');
        console.log('API Response:', response.data); // Debugging log

        // Ensure response.data is an array
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
  }, []);

  useEffect(() => {
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

  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
      console.log('After category filter:', filtered.length);
    }

    // Apply price filter
    filtered = filtered.filter((product) => product.startingPrice <= priceRange);
    console.log('After price filter:', filtered.length);

    // Apply sorting
    if (sortOption) {
      handleSort(sortOption);
    } else {
      setFilteredProducts(filtered);
    }
    console.log('Final filtered products:', filtered.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen relative">
      {/* Filter Toggle Button */}
      {!isSidebarOpen && (
        <button
          className="fixed top-40 left-4 bg-black text-white p-2 rounded-full shadow-lg z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaFilter size={20} />
        </button>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div
            className={`
              fixed lg:relative top-20 left-0 lg:top-0 lg:left-0 
              max-h-[90vh] lg:max-h-full h-auto lg:h-auto
              w-[80%] sm:w-[60%] md:w-[40%] lg:w-64 
              bg-gray-50 p-4 rounded-md shadow-md z-40
              transform lg:transform-none transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
              lg:translate-x-0 overflow-y-auto
            `}
          >
            {/* Close button for mobile */}
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Category</h4>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="flex justify-between mb-2">
                <span>${minPrice}</span>
                <span>${priceRange}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Sorting */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Sort By</h4>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Select Sorting Option</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="new-to-old">Date: New to Old</option>
                <option value="old-to-new">Date: Old to New</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Location</h4>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold text-black flex items-center mb-6">
              <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
              <span>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                {' / '}
                <Link to="/allproducts" className="hover:underline">
                  All Products
                </Link>
              </span>
            </h2>

            <div className="grid gap-4 grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center mt-8">
              <button className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600">
                See More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
