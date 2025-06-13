import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { FiPackage, FiCalendar, FiPlus, FiX, FiSave, FiImage, FiArrowRight } from "react-icons/fi";
import { FaTag } from 'react-icons/fa';

const AddProduct = () => {
  const navigate = useNavigate();
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
    <div className="container mx-auto px-4 py-8 font-serif">
      <form onSubmit={(e) => handleSubmit(e, isDraft)}>
        {/* Breadcrumb Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div variants={itemVariants} className="mb-8">
              <nav className="flex items-center text-[#043E52]/80 space-x-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
                />
                <button
                  onClick={() => navigate('/Dashboard')}
                  className="hover:text-[#FFAA5D] transition-colors"
                >
                  Dashboard
                </button>
                <FiArrowRight className="text-[#FFAA5D]" />
                <span className="font-medium text-[#043E52]">Add Product</span>
              </nav>
            </motion.div>
          </div>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 rounded-xl transition-all ${isDraft ? 'bg-gradient-to-r from-[#016A6D] to-[#043E52] text-white' : 'bg-[#016A6D]/10 text-[#043E52]'
                } disabled:opacity-50`}
            >
              <div className="flex items-center gap-2">
                <FiSave className="w-5 h-5" />
                {isSubmitting && isDraft ? 'Saving...' : 'Save Draft'}
              </div>
            </motion.button>
            <motion.button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                {isSubmitting && !isDraft ? 'Publishing...' : 'Add Product'}
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
                <FiPackage className="text-[#FFAA5D]" />
                Product Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-[#043E52]">Name*</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="brand" className="block text-sm font-medium text-[#043E52]">Brand*</label>
                  <input
                    type="text"
                    id="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-[#043E52]">Description*</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="quantity" className="block text-sm font-medium text-[#043E52]">Quantity*</label>
                  <input
                    type="number"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-medium text-[#043E52]">Country*</label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-[#043E52]">City*</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
                <FiPackage className="text-[#FFAA5D]" />
                Pricing Details
              </h2>

              <div className="space-y-2">
                <label htmlFor="startingPrice" className="block text-sm font-medium text-[#043E52]">Starting Price (PKR)*</label>
                <input
                  type="number"
                  id="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
                <FiImage className="text-[#FFAA5D]" />
                Product Images
              </h2>
              <div className="mb-4 aspect-square bg-[#016A6D]/5 rounded-xl flex items-center justify-center">
                {productImages[selectedImage] ? (
                  <img
                    src={productImages[selectedImage]}
                    alt="Product"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <span className="text-[#043E52]/40">No images selected</span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square cursor-pointer rounded-xl border-2 ${selectedImage === index
                        ? 'border-[#FFAA5D]'
                        : 'border-[#016A6D]/20'
                      }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute -top-2 -right-2 bg-[#E16A3D] text-white rounded-full p-1"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {productImages.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-[#016A6D]/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#016A6D]/5 transition-colors">
                    <FiPlus className="text-[#043E52]/40 w-8 h-8" />
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
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
                <FaTag className="text-[#FFAA5D]" />
                Product Category
              </h2>
              <select
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] appearance-none bg-white"
              >
                <option value="">Select Category</option>
                  <option value="Mobile Phones">Mobile Phones</option>
                  <option value="Laptop">Laptops</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Camera Equipment">Camera Equipment</option>
                  {/* <option value="home">Accessories</option> */}
                  <option value="Home Appliances">Home Appliances</option>
              </select>
            </motion.div>

            {/* Auction Dates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
                <FiCalendar className="text-[#FFAA5D]" />
                Auction Timeline
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-[#043E52]">Start Date*</label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-[#043E52]">End Date*</label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full border border-[#016A6D]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;