import React, { useState } from 'react';
import { CalendarIcon, PlusIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    quantity: '',
    country: '',
    city: '',
    startingPrice: '',
    bidQuantity: '',
    bidIncrease: '',
    category: '',
    startDate: '',
    endDate: '',
    isDraft: false
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productImages.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };

      const res = await axios.post('http://localhost:5000/api/upload', formData, config);
      setProductImages([...productImages, ...res.data]);
    } catch (error) {
      toast.error('Image upload failed');
    }
  };

  // const removeImage = (index) => {
  //   const newImages = [...productImages];
  //   newImages.splice(index, 1);
  //   setProductImages(newImages);
  //   if (selectedImage >= index) {
  //     setSelectedImage(Math.max(0, selectedImage - 1));
  //   }
  // };

  const removeImage = async (index) => {
    const imageToRemove = productImages[index];
    console.log('Removing image:', imageToRemove);
  
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
    if (selectedImage >= index) {
      setSelectedImage(Math.max(0, selectedImage - 1));
    }
  
    try {
      const token = localStorage.getItem('token');
      const publicId = imageToRemove.includes('http') 
      ? imageToRemove.split('/').pop() // Extract file name from URL
      : imageToRemove;
      const response = await axios.delete('http://localhost:5000/api/upload', {
        headers: { Authorization: `Bearer ${token}` },
        data: { publicId }
      });
      console.log('Delete response:', response.data);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e, draftStatus) => {
    e.preventDefault();
    console.log('Form submission started');
    setIsSubmitting(true);
    setIsDraft(draftStatus);

    try {
      console.log('Checking required fields');
      // Validate required fields
      const requiredFields = ['name', 'description', 'brand', 'quantity', 'country', 'city', 'startingPrice', 'category', 'startDate', 'endDate'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      console.log('Formatting product data');
      // Format the data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        quantity: parseInt(formData.quantity),
        country: formData.country.trim(),
        city: formData.city.trim(),
        startingPrice: parseFloat(formData.startingPrice),

        category: formData.category,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        images: productImages,
        isDraft: draftStatus
      };

      console.log('Submitting product with draft status:', draftStatus);
      console.log('Product data:', productData);

      // Validate numeric fields
      if (isNaN(productData.quantity) || productData.quantity <= 0) {
        console.log('Invalid quantity');
        toast.error('Please enter a valid quantity');
        setIsSubmitting(false);
        return;
      }
      if (isNaN(productData.startingPrice) || productData.startingPrice <= 0) {
        console.log('Invalid starting price');
        toast.error('Please enter a valid starting price');
        setIsSubmitting(false);
        return;
      }

      // Only validate dates if not a draft
      if (!draftStatus) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const now = new Date();

        // Use UTC for comparison
        const utcStart = Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        const utcNow = Date.UTC(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (utcStart < utcNow) {
          console.log('Invalid start date');
          toast.error('Start date cannot be in the past');
          setIsSubmitting(false);
          return;
        }
        if (endDate <= startDate) {
          console.log('Invalid end date');
          toast.error('End date must be after start date');
          setIsSubmitting(false);
          return;
        }
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('Auth token:', token ? 'Present' : 'Missing');
      if (!token) {
        toast.error('Please login to continue');
        setIsSubmitting(false);
        navigate('/login');
        return;
      }

      console.log('Creating new product');
      const response = await axios.post('http://localhost:5000/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Create response:', response.data);
      toast.success(draftStatus ? 'Product saved as draft' : 'Product created successfully');

      // Update active bids count in seller dashboard if not a draft
      if (!draftStatus) {
        try {
          const dashboardResponse = await axios.get('http://localhost:5000/api/seller/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          // Update the seller data in localStorage to reflect the new active bids count
          localStorage.setItem('sellerData', JSON.stringify(dashboardResponse.data));
        } catch (error) {
          console.error('Error updating dashboard data:', error);
        }
      }

      // Clear form and navigate
      console.log('Clearing form and preparing to navigate');
      setFormData({
        name: '',
        description: '',
        brand: '',
        quantity: '',
        country: '',
        city: '',
        startingPrice: '',
        bidQuantity: '',
        bidIncrease: '',
        category: '',
        startDate: '',
        endDate: '',
        isDraft: false
      });
      setProductImages([]);
      
      // Navigate after a short delay to show the success message
      console.log('Navigating to products page');
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 1000);
    } catch (error) {
      console.error('Error in form submission:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      console.log('Form submission completed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={(e) => handleSubmit(e, isDraft)}>
        {/* Breadcrumb Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-red-600 w-3 h-6 mr-2"></div>
            <nav className="text-sm md:text-base">
              <ol className="flex items-center space-x-2">
                <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
                <li>/</li>
                <li><a href="/dashboard" className="hover:text-red-600 transition-colors">Dashboard</a></li>
                <li>/</li>
                <li className="font-medium text-gray-700">Add Product</li>
              </ol>
            </nav>
          </div>
          <div className="flex space-x-3">
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded transition-all ${isDraft ? 'bg-gray-600 text-white' : 'bg-gray-200'} disabled:opacity-50`}
            >
              {isSubmitting && isDraft ? 'Saving...' : 'Save as Draft'}
            </button>
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all disabled:opacity-50"
            >
              {isSubmitting && !isDraft ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information Card */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-red-600 mb-6">Product Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name*</label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Brand*</label>
                  <input 
                    type="text" 
                    id="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                <textarea 
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity*</label>
                  <input 
                    type="number" 
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country*</label>
                  <input 
                    type="text" 
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City*</label>
                  <input 
                    type="text" 
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Bid Price Card */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-red-600 mb-6">Bid Price</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-2">Starting Price*</label>
                  <input 
                    type="number" 
                    id="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                {/* <div>
                  <label htmlFor="bidQuantity" className="block text-sm font-medium text-gray-700 mb-2">Bid Quantity*</label>
                  <input 
                    type="number" 
                    id="bidQuantity"
                    value={formData.bidQuantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div> */}
              </div>

              {/* <div className="mt-4">
                <label htmlFor="bidIncrease" className="block text-sm font-medium text-gray-700 mb-2">Bid Increase (%)*</label>
                <input 
                  type="number" 
                  id="bidIncrease"
                  value={formData.bidIncrease}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="100"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div> */}
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            {/* Product Image Gallery */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="mb-4">
                {productImages.length > 0 ? (
                  <img 
                    src={productImages[selectedImage]} 
                    alt="Product" 
                    className="w-full h-48 md:h-64 object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-48 md:h-64 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-400">No images</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {productImages.map((img, index) => (
                  <div 
                    key={index}
                    className={`relative border cursor-pointer w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded 
                      ${selectedImage === index ? 'border-red-600 border-2' : 'border-gray-300'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index}`} 
                      className="max-h-full max-w-full p-1 rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {productImages.length < 5 && (
                  <label 
                    className="border border-dashed w-16 h-16 md:w-20 md:h-20 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded"
                  >
                    <PlusIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Category</h2>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Product Category*</label>
                <select 
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="gaming">Gaming</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="collectibles">Collectibles</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Auction Dates</h2>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date*</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date*</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { motion } from 'framer-motion';
// import { FiBox, FiDollarSign, FiTag, FiMapPin, FiImage, FiCalendar, FiPlus, FiX } from 'react-icons/fi';
// import DatePicker from 'react-datepicker';
// import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
// import 'react-datepicker/dist/react-datepicker.css';

// // Comprehensive electronics categories based on standard taxonomies
// const ELECTRONICS_CATEGORIES = [
//   "Smartphones & Accessories",
//   "Laptops & Computers",
//   "Tablets & Accessories",
//   "Computer Components",
//   "Computer Peripherals",
//   "Networking Devices",
//   "Printers & Scanners",
//   "Computer Software",
//   "Home Entertainment",
//   "TVs & Accessories",
//   "Home Audio & Theater Systems",
//   "Cameras & Photography",
//   "DSLR Cameras",
//   "Mirrorless Cameras",
//   "Camera Lenses",
//   "Camera Accessories",
//   "Drones & Accessories",
//   "Wearable Technology",
//   "Smart Watches",
//   "Fitness Trackers",
//   "VR Headsets",
//   "Gaming Consoles",
//   "Video Games",
//   "Gaming Accessories",
//   "Portable Audio & Video",
//   "Headphones & Earphones",
//   "Speakers & Sound Systems",
//   "Car Electronics",
//   "Smart Home Devices",
//   "Home Security Systems",
//   "Office Electronics",
//   "Storage Devices",
//   "External Hard Drives",
//   "USB Flash Drives",
//   "Memory Cards",
//   "Cables & Adapters",
//   "Chargers & Power Supplies",
//   "Batteries & Power Banks",
//   "Electronic Tools & Test Equipment"
// ];

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [productImages, setProductImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDraft, setIsDraft] = useState(false);
//   const [query, setQuery] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     brand: '',
//     quantity: 1,
//     country: '',
//     city: '',
//     startingPrice: '',
//     category: '',
//     startDate: null,
//     endDate: null,
//     isDraft: false
//   });

//   const filteredCategories = query === ''
//     ? ELECTRONICS_CATEGORIES
//     : ELECTRONICS_CATEGORIES.filter(category =>
//         category.toLowerCase().includes(query.toLowerCase())
//       );

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1, when: "beforeChildren" }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [id]: value
//     }));
//   };

//   const handleQuantityChange = (e) => {
//     const value = Math.max(1, parseInt(e.target.value) || 1);
//     setFormData(prev => ({ ...prev, quantity: value }));
//   };

//   const handleDateChange = (date, field) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: date
//     }));
//   };

//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + productImages.length > 5) {
//       toast.error('You can upload a maximum of 5 images');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       files.forEach(file => formData.append('images', file));

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       };

//       const res = await axios.post('http://localhost:5000/api/upload', formData, config);
//       setProductImages([...productImages, ...res.data]);
//     } catch {
//       toast.error('Image upload failed');
//     }
//   };

//   const removeImage = async (index) => {
//     const imageToRemove = productImages[index];
//     const newImages = productImages.filter((_, i) => i !== index);
//     setProductImages(newImages);

//     try {
//       const token = localStorage.getItem('token');
//       const publicId = imageToRemove.url?.split('/').pop() || imageToRemove.public_id;
//       await axios.delete('http://localhost:5000/api/upload', {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { publicId }
//       });
//       toast.success('Image removed successfully');
//     } catch (error) {
//       toast.error('Failed to delete image');
//     }
//   };

//   const handleSubmit = async (e, draftStatus) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setIsDraft(draftStatus);

//     try {
//       const requiredFields = ['name', 'description', 'brand', 'quantity', 'country', 
//         'city', 'startingPrice', 'category', 'startDate', 'endDate'];
//       const missingFields = requiredFields.filter(field => !formData[field]);
      
//       if (missingFields.length > 0) {
//         toast.error(`Missing required fields: ${missingFields.join(', ')}`);
//         return;
//       }

//       const productData = {
//         ...formData,
//         quantity: Number(formData.quantity),
//         startingPrice: Number(formData.startingPrice),
//         images: productImages,
//         isDraft: draftStatus,
//         startDate: formData.startDate.toISOString(),
//         endDate: formData.endDate.toISOString()
//       };

//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:5000/api/products', productData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success(draftStatus ? 'Draft saved successfully' : 'Product published successfully');
//       navigate('/dashboard/products');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Submission failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8"
//     >
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.8 }}
//           className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
//         />

//         {/* Breadcrumb */}
//         <motion.div variants={itemVariants} className="mb-8">
//           <div className="flex items-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
//             />
//             <nav className="text-sm md:text-base text-[#043E52]/80">
//               <ol className="flex items-center space-x-2">
//                 <li>
//                   <button onClick={() => navigate('/')} className="hover:text-[#FFAA5D] transition-colors">
//                     Home
//                   </button>
//                 </li>
//                 <li className="mx-1">/</li>
//                 <li>
//                   <button onClick={() => navigate('/dashboard')} className="hover:text-[#FFAA5D] transition-colors">
//                     Dashboard
//                   </button>
//                 </li>
//                 <li className="mx-1">/</li>
//                 <li className="font-medium text-[#043E52]">Add Product</li>
//               </ol>
//             </nav>
//           </div>
//         </motion.div>

//         <motion.form 
//           onSubmit={(e) => handleSubmit(e, isDraft)}
//           className="grid lg:grid-cols-3 gap-8"
//         >
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Product Information */}
//             <motion.div 
//               variants={itemVariants}
//               className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#016A6D]/20"
//             >
//               <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
//                 <FiBox className="text-[#FFAA5D]" /> Product Information
//               </h2>
              
//               <div className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="relative">
//                     <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                     <input
//                       type="text"
//                       id="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       placeholder="Product Name"
//                       className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                       required
//                     />
//                   </div>

//                   <div className="relative">
//                     <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                     <input
//                       type="text"
//                       id="brand"
//                       value={formData.brand}
//                       onChange={handleInputChange}
//                       placeholder="Brand Name"
//                       className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Product Description"
//                     rows={4}
//                     className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                     required
//                   />
//                   <FiBox className="absolute left-3 top-4 text-[#043E52]/50" />
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-6">
//                   <div className="relative">
//                     <input
//                       type="number"
//                       id="quantity"
//                       value={formData.quantity}
//                       onChange={handleQuantityChange}
//                       min="1"
//                       className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                       required
//                     />
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50">Qty</span>
//                   </div>

//                   <div className="relative">
//                     <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                     <input
//                       type="text"
//                       id="country"
//                       value={formData.country}
//                       onChange={handleInputChange}
//                       placeholder="Country"
//                       className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                       required
//                     />
//                   </div>

//                   <div className="relative">
//                     <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                     <input
//                       type="text"
//                       id="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       placeholder="City"
//                       className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Pricing Section */}
//             <motion.div 
//               variants={itemVariants}
//               className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#016A6D]/20"
//             >
//               <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
//                 <FiDollarSign className="text-[#FFAA5D]" /> Pricing Details
//               </h2>
              
//               <div className="relative">
//                 <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                 <input
//                   type="number"
//                   id="startingPrice"
//                   value={formData.startingPrice}
//                   onChange={handleInputChange}
//                   placeholder="Starting Price"
//                   min="0"
//                   step="0.01"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                   required
//                 />
//               </div>
//             </motion.div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-8">
//             {/* Category Selector */}
//             <motion.div 
//               variants={itemVariants}
//               className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-[#016A6D]/20"
//             >
//               <h2 className="text-xl font-bold text-[#043E52] mb-4 flex items-center gap-2">
//                 <FiTag className="text-[#FFAA5D]" /> Product Category
//               </h2>
//               <Combobox 
//                 value={formData.category} 
//                 onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
//               >
//                 <div className="relative">
//                   <ComboboxInput
//                     className="w-full py-3 px-4 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                     displayValue={(category) => category || ''}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="Search category..."
//                     required
//                   />
//                   <ComboboxButton className="absolute right-3 top-1/2 -translate-y-1/2">
//                     <FiPlus className="text-[#043E52]/50" />
//                   </ComboboxButton>
//                 </div>

//                 <ComboboxOptions className="mt-2 max-h-60 overflow-auto rounded-lg border border-[#016A6D]/20">
//                   {filteredCategories.map((category) => (
//                     <ComboboxOption
//                       key={category}
//                       value={category}
//                       className={({ active }) => 
//                         `px-4 py-2 ${active ? 'bg-[#FFAA5D]/10 text-[#043E52]' : 'text-[#043E52]'}`
//                       }
//                     >
//                       {category}
//                     </ComboboxOption>
//                   ))}
//                 </ComboboxOptions>
//               </Combobox>
//             </motion.div>

//             {/* Image Upload */}
//             <motion.div 
//               variants={itemVariants}
//               className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-[#016A6D]/20"
//             >
//               <h2 className="text-xl font-bold text-[#043E52] mb-4 flex items-center gap-2">
//                 <FiImage className="text-[#FFAA5D]" /> Product Images
//               </h2>
//               <div className="space-y-4">
//                 <div className="aspect-square bg-[#016A6D]/10 rounded-xl flex items-center justify-center">
//                   {productImages[selectedImage] ? (
//                     <img 
//                       src={productImages[selectedImage].url || productImages[selectedImage]} 
//                       alt="Main Preview" 
//                       className="w-full h-full object-contain p-4"
//                     />
//                   ) : (
//                     <span className="text-[#043E52]/50">No image selected</span>
//                   )}
//                 </div>
                
//                 <div className="grid grid-cols-4 gap-2">
//                   {productImages.map((img, index) => (
//                     <motion.div 
//                       key={index}
//                       whileHover={{ scale: 1.05 }}
//                       className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
//                         selectedImage === index ? 'border-2 border-[#FFAA5D]' : 'border-2 border-transparent'
//                       }`}
//                       onClick={() => setSelectedImage(index)}
//                     >
//                       <img 
//                         src={img.url || img} 
//                         alt="" 
//                         className="w-full h-full object-cover" 
//                       />
//                       <button 
//                         onClick={(e) => { e.stopPropagation(); removeImage(index); }}
//                         className="absolute top-1 right-1 bg-[#E16A3D] text-white p-1 rounded-full hover:bg-[#FFAA5D] transition-colors"
//                       >
//                         <FiX className="w-3 h-3" />
//                       </button>
//                     </motion.div>
//                   ))}
                  
//                   {productImages.length < 5 && (
//                     <motion.label 
//                       whileHover={{ scale: 1.05 }}
//                       className="aspect-square border-2 border-dashed border-[#016A6D]/30 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#016A6D]/10"
//                     >
//                       <FiPlus className="text-[#043E52]/50" />
//                       <input 
//                         type="file" 
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="hidden"
//                       />
//                     </motion.label>
//                   )}
//                 </div>
//               </div>
//             </motion.div>

//             {/* Date Pickers */}
//             <motion.div 
//               variants={itemVariants}
//               className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-[#016A6D]/20"
//             >
//               <h2 className="text-xl font-bold text-[#043E52] mb-4 flex items-center gap-2">
//                 <FiCalendar className="text-[#FFAA5D]" /> Auction Dates
//               </h2>
//               <div className="space-y-4">
//                 <div className="relative">
//                   <DatePicker
//                     selected={formData.startDate}
//                     onChange={(date) => handleDateChange(date, 'startDate')}
//                     minDate={new Date()}
//                     dateFormat="MMMM d, yyyy"
//                     placeholderText="Select start date"
//                     className="w-full py-3 px-4 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                     required
//                   />
//                   <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                 </div>
//                 <div className="relative">
//                   <DatePicker
//                     selected={formData.endDate}
//                     onChange={(date) => handleDateChange(date, 'endDate')}
//                     minDate={formData.startDate || new Date()}
//                     dateFormat="MMMM d, yyyy"
//                     placeholderText="Select end date"
//                     className="w-full py-3 px-4 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                     required
//                   />
//                   <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Form Actions */}
//           <motion.div 
//             variants={itemVariants}
//             className="lg:col-span-3 flex flex-col sm:flex-row gap-4 justify-end"
//           >
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="button"
//               onClick={(e) => handleSubmit(e, true)}
//               disabled={isSubmitting}
//               className="px-6 py-3 rounded-xl bg-[#043E52]/10 hover:bg-[#043E52]/20 text-[#043E52] transition-colors disabled:opacity-50"
//             >
//               {isSubmitting && isDraft ? 'Saving...' : 'Save Draft'}
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={isSubmitting}
//               className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white hover:shadow-lg disabled:opacity-50 transition-all"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Publishing...
//                 </div>
//               ) : 'Publish Product'}
//             </motion.button>
//           </motion.div>
//         </motion.form>
//       </div>
//     </motion.div>
//   );
// };

// export default AddProduct;