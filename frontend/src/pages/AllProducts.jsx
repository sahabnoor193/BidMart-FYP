// import React, { useEffect } from 'react';
// import ProductCard from '../components/ProductCard';

// const AllProducts = () => {
//   const products = [
//     {
//       id: 1,
//       name: 'Gaming Keyboard',
//       price: 20,
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 2,
//       name: 'Gaming Monitor',
//       price: 20,
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 3,
//       name: 'Gaming Controller',
//       price: 20,
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 4,
//       name: 'Cooling Fan',
//       price: 20,
//       image: 'https://via.placeholder.com/150',
//     },
//     // Add more products as needed
//   ];

//   // Scroll to the top when the component mounts
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Add padding to prevent overlapping with the navbar */}
//       <div className="container mx-auto px-4 py-8 mt-16">

//         {/* <h2 className="text-xl font-bold text-red-500 mb-6">Home / All</h2> */}
//         <h2 className="text-2xl font-bold text-black flex items-center mb-6">
//             <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
//             Home / All Products
//           </h2>

//         <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AllProducts;

//responsiveness is not good

// import React, { useEffect, useState } from 'react';
// import { FaFilter } from 'react-icons/fa';
// import ProductCard from '../components/ProductCard';

// const AllProducts = () => {
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: 'Gaming Keyboard',
//       price: 50,
//       date: '2023-12-01',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 2,
//       name: 'Gaming Monitor',
//       price: 150,
//       date: '2023-12-02',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 3,
//       name: 'Gaming Controller',
//       price: 30,
//       date: '2023-12-03',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 4,
//       name: 'Cooling Fan',
//       price: 20,
//       date: '2023-12-04',
//       image: 'https://via.placeholder.com/150',
//     },
//   ]);

//   const [sortOption, setSortOption] = useState('');
//   const [location, setLocation] = useState('');
//   const [priceRange, setPriceRange] = useState(200); // Maximum price
//   const minPrice = 0;
//   const maxPrice = 200;
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle

//   // Scroll to the top when the component mounts
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Handle sorting logic
//   const handleSort = (option) => {
//     setSortOption(option);
//     let sortedProducts = [...products];

//     if (option === 'low-to-high') {
//       sortedProducts.sort((a, b) => a.price - b.price);
//     } else if (option === 'high-to-low') {
//       sortedProducts.sort((a, b) => b.price - a.price);
//     } else if (option === 'new-to-old') {
//       sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
//     } else if (option === 'old-to-new') {
//       sortedProducts.sort((a, b) => new Date(a.date) - new Date(b.date));
//     }

//     setProducts(sortedProducts);
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Toggle Button for Small Screens */}
//       <button
//         className="fixed top-20 left-4 bg-black text-white p-2 rounded-full shadow-lg z-50 sm:block lg:hidden"
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         style={{ transition: 'all 0.3s ease' }}
//       >
//         <FaFilter size={20} />
//       </button>

//       {/* Add padding to prevent overlapping with the navbar */}
//       <div className="container mx-auto px-4 py-8 mt-16">
//         <div className="flex flex-wrap lg:flex-nowrap gap-6">
//           {/* Sidebar */}
//           {/* <div className="w-full lg:w-64 bg-gray-50 p-4 rounded-md shadow-md"> */}
//           <div
//            className={`w-full lg:w-64 bg-gray-50 p-4 rounded-md shadow-md transition-transform ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } z-40 lg:translate-x-0`}>

//           <h3 className="font-semibold mb-4">Filters</h3>

//           {/* Add filter options here */}
//             <div className="mb-4">
//               <h4 className="text-sm font-medium mb-2">Category</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <label>
//                     <input type="checkbox" className="mr-2" />
//                     Accessories
//                   </label>
//                 </li>
//                 <li>
//                   <label>
//                     <input type="checkbox" className="mr-2" />
//                     Monitors
//                   </label>
//                 </li>
//                 <li>
//                   <label>
//                     <input type="checkbox" className="mr-2" />
//                     Hardware
//                   </label>
//                 </li>
//               </ul>
//             </div>

//             {/* <div className="mb-4">
//               <h4 className="text-sm font-medium mb-2">Price Range</h4>
//               <input type="range" min="0" max="200" className="w-full" />
//             </div> */}

//             <div className="mb-4">
//               <h4 className="text-sm font-medium mb-2">Price Range</h4>
//               <div className="flex justify-between mb-1">
//                 <span>${minPrice}</span>
//                 <span>${priceRange}</span>
//               </div>
//               <input 
//                 type="range" 
//                 min={minPrice} 
//                 max={maxPrice} 
//                 value={priceRange}
//                 onChange={(e) => setPriceRange(e.target.value)}
//                 className="w-full accent-red-500"
//               />
//             </div>
            
            
//             {/* Sorting Dropdown */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Sort By</h4>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={sortOption}
//                 onChange={(e) => handleSort(e.target.value)}
//               >
//                 <option value="" disabled>
//                   Select Sorting Option
//                 </option>
//                 <option value="low-to-high">Price: Low to High</option>
//                 <option value="high-to-low">Price: High to Low</option>
//                 <option value="new-to-old">Date: New to Old</option>
//                 <option value="old-to-new">Date: Old to New</option>
//               </select>
//             </div>

//             {/* Location Dropdown */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Location</h4>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               >
//                 <option value="" disabled>
//                   Select Location
//                 </option>
//                 <option value="new-york">New York</option>
//                 <option value="los-angeles">Los Angeles</option>
//                 <option value="chicago">Chicago</option>
//                 <option value="houston">Houston</option>
//               </select>
//             </div>
//             </div>

//           {/* Product Grid */}
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-black flex items-center mb-6">
//               <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
//               Home / All Products
//               </h2>

//               <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllProducts;

//Correct code

// import React, { useEffect, useState } from 'react';
// import ProductCard from '../components/ProductCard';

// const AllProducts = () => {
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: 'Gaming Keyboard',
//       price: 50,
//       date: '2023-12-01',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 2,
//       name: 'Gaming Monitor',
//       price: 150,
//       date: '2023-12-02',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 3,
//       name: 'Gaming Controller',
//       price: 30,
//       date: '2023-12-03',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 4,
//       name: 'Cooling Fan',
//       price: 20,
//       date: '2023-12-04',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 1,
//       name: 'Gaming Keyboard',
//       price: 50,
//       date: '2023-12-01',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 2,
//       name: 'Gaming Monitor',
//       price: 150,
//       date: '2023-12-02',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 3,
//       name: 'Gaming Controller',
//       price: 30,
//       date: '2023-12-03',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 4,
//       name: 'Cooling Fan',
//       price: 20,
//       date: '2023-12-04',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 1,
//       name: 'Gaming Keyboard',
//       price: 50,
//       date: '2023-12-01',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 2,
//       name: 'Gaming Monitor',
//       price: 150,
//       date: '2023-12-02',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 3,
//       name: 'Gaming Controller',
//       price: 30,
//       date: '2023-12-03',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       id: 4,
//       name: 'Cooling Fan',
//       price: 20,
//       date: '2023-12-04',
//       image: 'https://via.placeholder.com/150',
//     },
//   ]);

//   const [sortOption, setSortOption] = useState('');
//   const [location, setLocation] = useState('');
//   const [priceRange, setPriceRange] = useState(200); // Maximum price
//   const minPrice = 0;
//   const maxPrice = 200;

//   // Scroll to the top when the component mounts
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Handle sorting logic
//   const handleSort = (option) => {
//     setSortOption(option);
//     let sortedProducts = [...products];

//     if (option === 'low-to-high') {
//       sortedProducts.sort((a, b) => a.price - b.price);
//     } else if (option === 'high-to-low') {
//       sortedProducts.sort((a, b) => b.price - a.price);
//     } else if (option === 'new-to-old') {
//       sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
//     } else if (option === 'old-to-new') {
//       sortedProducts.sort((a, b) => new Date(a.date) - new Date(b.date));
//     }

//     setProducts(sortedProducts);
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Add padding to prevent overlapping with the navbar */}
//       <div className="container mx-auto px-4 py-8 mt-16">
//         <div className="flex flex-wrap lg:flex-nowrap gap-6">
//           {/* Sidebar */}
//           <div className="w-full lg:w-64 bg-gray-50 p-4 rounded-md shadow-md">
//             <h3 className="font-semibold mb-4">Filters</h3>

//             {/* Add filter options here */}
//             <div className="mb-4">
//               <h4 className="text-sm font-medium mb-2">Category</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <label>
//                     <input type="checkbox" className="mr-2" />
//                     Accessories
//                   </label>
//                 </li>
//                 <li>
//                   <label>
//                     <input type="checkbox" className="mr-2" />
//                     Monitors
//                   </label>
//                 </li>
//                 <li>
//                   <label>
//                     <input type="checkbox" className="mr-2" />
//                     Hardware
//                   </label>
//                 </li>
//               </ul>
//             </div>

//             {/* <div className="mb-4">
//               <h4 className="text-sm font-medium mb-2">Price Range</h4>
//               <input type="range" min="0" max="200" className="w-full" />
//             </div> */}

//             <div className="mb-4">
//               <h4 className="text-sm font-medium mb-2">Price Range</h4>
//               <div className="flex justify-between mb-1">
//                 <span>${minPrice}</span>
//                 <span>${priceRange}</span>
//               </div>
//               <input 
//                 type="range" 
//                 min={minPrice} 
//                 max={maxPrice} 
//                 value={priceRange}
//                 onChange={(e) => setPriceRange(e.target.value)}
//                 className="w-full accent-red-500"
//               />
//             </div>
            
            
//             {/* Sorting Dropdown */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Sort By</h4>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={sortOption}
//                 onChange={(e) => handleSort(e.target.value)}
//               >
//                 <option value="" disabled>
//                   Select Sorting Option
//                 </option>
//                 <option value="low-to-high">Price: Low to High</option>
//                 <option value="high-to-low">Price: High to Low</option>
//                 <option value="new-to-old">Date: New to Old</option>
//                 <option value="old-to-new">Date: Old to New</option>
//               </select>
//             </div>

//             {/* Location Dropdown */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Location</h4>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               >
//                 <option value="" disabled>
//                   Select Location
//                 </option>
//                 <option value="new-york">New York</option>
//                 <option value="los-angeles">Los Angeles</option>
//                 <option value="chicago">Chicago</option>
//                 <option value="houston">Houston</option>
//               </select>
//             </div>

//           </div>

//           {/* Product Grid */}
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold text-black flex items-center mb-6">
//               <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
//               Home / All Products
//             </h2>

//             <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllProducts;

// src/pages/AllProducts.jsx
// import React, { useEffect, useState } from 'react';
// import { FaFilter, FaTimes } from 'react-icons/fa';
// import ProductCard from '../components/ProductCard';

// const AllProducts = () => {
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: 'Gaming Keyboard RGB',
//       price: 50,
//       date: '2023-12-01',
//       image: 'https://via.placeholder.com/150',
//       category: 'Accessories'
//     },
//     {
//       id: 2,
//       name: '4K Gaming Monitor',
//       price: 150,
//       date: '2023-12-02',
//       image: 'https://via.placeholder.com/150',
//       category: 'Monitors'
//     },
//     {
//       id: 3,
//       name: 'Wireless Controller',
//       price: 30,
//       date: '2023-12-03',
//       image: 'https://via.placeholder.com/150',
//       category: 'Accessories'
//     },
//     {
//       id: 4,
//       name: 'RGB Cooling Fan',
//       price: 20,
//       date: '2023-12-04',
//       image: 'https://via.placeholder.com/150',
//       category: 'Hardware'
//     },
//     // Add more products as needed
//   ]);

//   const [filteredProducts, setFilteredProducts] = useState(products);
//   const [sortOption, setSortOption] = useState('');
//   const [location, setLocation] = useState('');
//   const [priceRange, setPriceRange] = useState(200);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const minPrice = 0;
//   const maxPrice = 200;

//   const categories = [
//     { id: 1, name: 'Accessories' },
//     { id: 2, name: 'Monitors' },
//     { id: 3, name: 'Hardware' },
//   ];

//   const locations = [
//     { id: 'new-york', name: 'New York' },
//     { id: 'los-angeles', name: 'Los Angeles' },
//     { id: 'chicago', name: 'Chicago' },
//     { id: 'houston', name: 'Houston' },
//   ];

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [selectedCategories, priceRange, sortOption]);

//   const handleCategoryChange = (category) => {
//     setSelectedCategories(prev => 
//       prev.includes(category)
//         ? prev.filter(cat => cat !== category)
//         : [...prev, category]
//     );
//   };

//   const handleSort = (option) => {
//     setSortOption(option);
//     let sorted = [...filteredProducts];

//     switch(option) {
//       case 'low-to-high':
//         sorted.sort((a, b) => a.price - b.price);
//         break;
//       case 'high-to-low':
//         sorted.sort((a, b) => b.price - a.price);
//         break;
//       case 'new-to-old':
//         sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
//         break;
//       case 'old-to-new':
//         sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
//         break;
//       default:
//         break;
//     }

//     setFilteredProducts(sorted);
//   };

//   const applyFilters = () => {
//     let filtered = [...products];

//     // Apply category filter
//     if (selectedCategories.length > 0) {
//       filtered = filtered.filter(product => 
//         selectedCategories.includes(product.category)
//       );
//     }

//     // Apply price filter
//     filtered = filtered.filter(product => product.price <= priceRange);

//     // Apply sorting
//     if (sortOption) {
//       handleSort(sortOption);
//     }

//     setFilteredProducts(filtered);
//   };

//   return (
//     <div className="bg-white min-h-screen relative">
//       {/* Filter Toggle Button */}
//       <button
//         className="fixed top-40 left-4 bg-black text-white p-2 rounded-full shadow-lg z-50 lg:hidden"
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//       >
//         <FaFilter size={20} />
//       </button>

//       <div className="container mx-auto px-4 py-8 mt-16">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Sidebar */}
//           <div
//             className={`
//               fixed lg:relative top-20 left-0 h-full lg:h-auto w-[280px] lg:w-64 
//               bg-gray-50 p-4 rounded-md shadow-md z-40
//               transform lg:transform-none transition-transform duration-300 ease-in-out
//               ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//               lg:translate-x-0 overflow-y-auto
//               ${isSidebarOpen ? 'block' : 'hidden lg:block'}
//             `}
//           >
//             {/* Close button for mobile */}
//             <div className="flex justify-between items-center lg:hidden mb-4">
//               <h3 className="font-semibold">Filters</h3>
//               <button 
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FaTimes size={20} />
//               </button>
//             </div>

//             {/* Categories */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Category</h4>
//               {categories.map(category => (
//                 <label key={category.id} className="flex items-center space-x-2 mb-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedCategories.includes(category.name)}
//                     onChange={() => handleCategoryChange(category.name)}
//                     className="rounded border-gray-300 text-red-500 focus:ring-red-500"
//                   />
//                   <span>{category.name}</span>
//                 </label>
//               ))}
//             </div>

//             {/* Price Range */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Price Range</h4>
//               <div className="flex justify-between mb-2">
//                 <span>${minPrice}</span>
//                 <span>${priceRange}</span>
//               </div>
//               <input
//                 type="range"
//                 min={minPrice}
//                 max={maxPrice}
//                 value={priceRange}
//                 onChange={(e) => setPriceRange(Number(e.target.value))}
//                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
//               />
//             </div>

//             {/* Sorting */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Sort By</h4>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={sortOption}
//                 onChange={(e) => handleSort(e.target.value)}
//               >
//                 <option value="">Select Sorting Option</option>
//                 <option value="low-to-high">Price: Low to High</option>
//                 <option value="high-to-low">Price: High to Low</option>
//                 <option value="new-to-old">Date: New to Old</option>
//                 <option value="old-to-new">Date: Old to New</option>
//               </select>
//             </div>

//             {/* Location */}
//             <div className="mb-6">
//               <h4 className="text-sm font-medium mb-2">Location</h4>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               >
//                 <option value="">Select Location</option>
//                 {locations.map(loc => (
//                   <option key={loc.id} value={loc.id}>{loc.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Overlay */}
//           {isSidebarOpen && (
//             <div 
//               className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//               onClick={() => setIsSidebarOpen(false)}
//             />
//           )}

//           {/* Product Grid */}
//           <div className="flex-1 w-full">
//             <h2 className="text-2xl font-bold text-black flex items-center mb-6">
//               <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
//               Home / All Products
//             </h2>

//             <div className="grid gap-4 grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
//               {filteredProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllProducts;

import React, { useEffect, useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Gaming Keyboard RGB',
      price: 50,
      date: '2023-12-01',
      image: 'https://via.placeholder.com/150',
      category: 'Accessories',
    },
    {
      id: 2,
      name: '4K Gaming Monitor',
      price: 150,
      date: '2023-12-02',
      image: 'https://via.placeholder.com/150',
      category: 'Monitors',
    },
    {
      id: 3,
      name: 'Wireless Controller',
      price: 30,
      date: '2023-12-03',
      image: 'https://via.placeholder.com/150',
      category: 'Accessories',
    },
    {
      id: 4,
      name: 'RGB Cooling Fan',
      price: 20,
      date: '2023-12-04',
      image: 'https://via.placeholder.com/150',
      category: 'Hardware',
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState(200);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const minPrice = 0;
  const maxPrice = 200;

  const categories = [
    { id: 1, name: 'Accessories' },
    { id: 2, name: 'Monitors' },
    { id: 3, name: 'Hardware' },
  ];

  const locations = [
    { id: 'new-york', name: 'New York' },
    { id: 'los-angeles', name: 'Los Angeles' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'houston', name: 'Houston' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, priceRange, sortOption]);

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
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-to-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'new-to-old':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'old-to-new':
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
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
    }

    // Apply price filter
    filtered = filtered.filter((product) => product.price <= priceRange);

    // Apply sorting
    if (sortOption) {
      handleSort(sortOption);
    }

    setFilteredProducts(filtered);
  };

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

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div
            // className={`
            //   fixed lg:relative top-20 left-0 lg:top-0 lg:left-0 h-screen lg:h-auto
            //   w-[80%] sm:w-[60%] md:w-[40%] lg:w-64 
            //   bg-gray-50 p-4 rounded-md shadow-md z-40
            //   transform lg:transform-none transition-transform duration-300 ease-in-out
            //   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            //   lg:translate-x-0 overflow-y-auto
            // `}
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
            {/* <h2 className="text-2xl font-bold text-black flex items-center mb-6">
              <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
              Home / All Products
            </h2> */}

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
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
