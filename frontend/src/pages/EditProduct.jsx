import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarIcon, PlusIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { productId } = useParams();
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

useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const product = response.data;
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
          startDate: product.details?.dateStart ? 
            new Date(product.details.dateStart).toISOString().split('T')[0] : '',
          endDate: product.details?.dateEnd ? 
            new Date(product.details.dateEnd).toISOString().split('T')[0] : '',
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
  
    const removeImage = (index) => {
      const newImages = [...productImages];
      newImages.splice(index, 1);
      setProductImages(newImages);
      if (selectedImage >= index) {
        setSelectedImage(Math.max(0, selectedImage - 1));
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
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
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
                  <li className="font-medium text-gray-700">Edit Product</li>
                </ol>
              </nav>
            </div>
            <div className="flex space-x-3">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Update Product'}
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
                    src={productImages[selectedImage].url || productImages[selectedImage]} 
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
                        src={img.url || img}
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
                      min={formData.startDate}
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

export default EditProduct;