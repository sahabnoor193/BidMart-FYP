import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarIcon, PlusIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { FiPackage, FiCalendar, FiPlus, FiX, FiSave, FiImage, FiArrowRight } from "react-icons/fi";
import { FaExchangeAlt, FaTag } from 'react-icons/fa';

const EditProduct = () => {
  const { productId } = useParams();
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

useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const product = response.data;

              // Adjust dates to local time zone
      const toLocalDate = (dateString) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset(); // Offset in minutes
        date.setMinutes(date.getMinutes() - offset); // Adjust to local time
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };
        setFormData({
          name: product.title,
          description: product.details?.description || '',
          brand: product.details?.brand || '',
          quantity: product.details?.quantity?.toString() || '',
          country: product.country,
          city: product.contact?.city || '',
          startingPrice: product.startBid?.toString() || '',
          bidQuantity: product.details?.bidQuantity?.toString() || '1',
          bidIncrease: product.details?.bidIncrease?.toString() || '5',
          category: product.category,
          startDate: product.details?.dateStart ? toLocalDate(product.details.dateStart) : '',
          endDate: product.details?.dateEnd ? toLocalDate(product.details.dateEnd) : '',
          isDraft: product.isDraft
        });
        
        // Handle both string URLs and Cloudinary objects
        setProductImages(
          product.images.thumbnails.map(img => 
            typeof img === 'string' ? { url: img } : img
          )
        );
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
      }
    };
  
    fetchProduct();
  }, [productId]);

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
        console.error('Image upload failed:', error);
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
        let publicId;

        if (typeof imageToRemove === 'string') {
          publicId = imageToRemove.split('/').pop(); // Extract file name from URL
        } else if (imageToRemove.public_id) {
          publicId = imageToRemove.public_id;
        } else if (imageToRemove.url) {
          publicId = imageToRemove.url.split('/').pop(); // Extract file name from URL
        } else {
          throw new Error('Invalid image format');
        }
        console.log('Public ID being sent:', publicId);

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
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
      
        try {
          const productData = {
            ...formData,
            quantity: Number(formData.quantity),
            startingPrice: Number(formData.startingPrice),
            bidQuantity: Number(formData.bidQuantity),
            bidIncrease: Number(formData.bidIncrease),
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
        images: productImages.map(img => img.url || img),
            isDraft
          };
      
          const token = localStorage.getItem('token');
      await axios.put(
            `http://localhost:5000/api/products/${productId}`,
            productData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
      
          toast.success('Product updated successfully');
          navigate(`/products/${productId}`);
        } catch (error) {
          console.error('Update error:', error);
          toast.error(error.response?.data?.message || 'Update failed');
        } finally {
          setIsSubmitting(false);
        }
      };

  return (
    <div className="container mx-auto px-4 py-8 font-serif">
      <form onSubmit={handleSubmit}>
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
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
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
              
              <div className="grid md:grid-cols-2 gap-4">
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
                {productImages[selectedImage]?.url ? (
                  <img 
                    src={productImages[selectedImage].url} 
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
                    className={`relative aspect-square cursor-pointer rounded-xl border-2 ${
                      selectedImage === index 
                        ? 'border-[#FFAA5D]' 
                        : 'border-[#016A6D]/20'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img.url || img}
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
                <option value="electronics">Electronics</option>
                <option value="gaming">Gaming</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Garden</option>
                <option value="collectibles">Collectibles</option>
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

export default EditProduct;