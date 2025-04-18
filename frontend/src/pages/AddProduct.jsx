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
      const requiredFields = ['name', 'description', 'brand', 'quantity', 'country', 'city', 'startingPrice', 'bidQuantity', 'bidIncrease', 'category', 'startDate', 'endDate'];
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
        bidQuantity: parseInt(formData.bidQuantity),
        bidIncrease: parseFloat(formData.bidIncrease),
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
      if (isNaN(productData.bidQuantity) || productData.bidQuantity <= 0) {
        console.log('Invalid bid quantity');
        toast.error('Please enter a valid bid quantity');
        setIsSubmitting(false);
        return;
      }
      if (isNaN(productData.bidIncrease) || productData.bidIncrease <= 0) {
        console.log('Invalid bid increase');
        toast.error('Please enter a valid bid increase percentage');
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
                <div>
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
                </div>
              </div>

              <div className="mt-4">
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
              </div>
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