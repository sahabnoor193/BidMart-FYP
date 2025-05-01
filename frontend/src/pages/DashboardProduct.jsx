import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import axios from "axios";
const DashboardProduct = () => {
      // const BASEURL = "https://subhan-project-backend.onrender.com";
  const BASEURL = "http://localhost:5000";
    const {id} = useParams();
      const [error, setError] = useState(null);
      
    
      const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    const handleAccept = (bidId) => {
      console.log("Accepted bid:", bidId);
      // Your accept logic here
    };
  
    const handleReject = (bidId) => {
      console.log("Rejected bid:", bidId);
      // Your reject logic here
    };

    useEffect(()=>{
        const fetchProduct = async () => {
            try {
              const response = await axios.get(`${BASEURL}/api/products/${id}`);
            //   if (isMounted) {
                setProduct(response.data);
                setLoading(false);
            //   }
            } catch (err) {
            //   if (isMounted) {
                setError(err.message);
                setLoading(false);
            //   }
            }
          };
        
          fetchProduct();
        
    },[id])
  
  console.log(id,"Id");
  const [selectedImage, setSelectedImage] = useState(product?.images?.thumbnails[0]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-red-500">Error loading product: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p>Product not found</p>
      </div>
    );
  }

    return (
<div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl mt-10">
  <div className="md:flex gap-10">
    {/* Image Gallery */}
    <div className="md:w-1/2 w-full">
      {/* Main Image */}
      <div className="rounded-xl overflow-hidden shadow-md mb-4">
        <img
          src={selectedImage || product?.images?.thumbnails[0]}
          alt="Product"
          className="w-full h-96 object-contain transition duration-300"
        />
      </div>

      {/* Thumbnail Row */}
      <div className="flex gap-3 overflow-x-auto">
        {product?.images.thumbnails?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedImage(img)}
            className={`h-20 w-20 object-contain rounded-lg cursor-pointer border-2 ${
              selectedImage === img ? 'border-blue-600' : 'border-transparent'
            } hover:border-blue-400 transition`}
          />
        ))}
      </div>
    </div>

    {/* Product Details */}
    <div className="md:w-1/2 w-full space-y-6 mt-6 md:mt-0">
      <h1 className="text-4xl font-extrabold text-gray-900">{product?.title}</h1>
      <p className="text-gray-700 leading-relaxed">{product?.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold">🏷 Brand:</span> {product?.details.brand}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">📦 Quantity:</span> {product?.details?.quantity}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">💰 Starting Price:</span> PKR {product?.startBid.toLocaleString()}
        </div>
      </div>

      <button
        onClick={openModal}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-medium rounded-xl transition"
      >
        See Bids ({product?.bids.length})
      </button>
    </div>
  </div>

  {/* Modal (same as before, unchanged) */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Live Bids</h2>

        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scroll">
          {product?.bids.length > 0 ? (
            product?.bids.map((bid) => (
              <div
                key={bid.id}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition"
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    💵 Amount: PKR {bid.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">👤 User: {bid?.bidder.name}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(bid.id)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleReject(bid.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No bids yet.</div>
          )}
        </div>
      </div>
    </div>
  )}
</div>

    )
}
export default DashboardProduct;