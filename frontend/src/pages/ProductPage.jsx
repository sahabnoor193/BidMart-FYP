import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { Loader2, AlertCircle, Package } from 'lucide-react'; // Modern icons
import Breadcrumbs from '../components/BreadCrumbs';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import TabPanel from '../components/TabPanel';
import Details from '../components/Details'; // Ensure this is imported and has correct prop signature
import BidProfile from '../components/BidProfile'; // Ensure this is imported and has correct prop signature
import ContactInfo from '../components/ContactInfo';
import PreviousBids from '../components/PreviousBids';
import SellerReviews from '../components/SellerReviews';
import socket from '../socket';
import { toast } from 'react-toastify';
import { FiArrowRight } from "react-icons/fi"; // Specific arrow icon for breadcrumbs

const ProductPage = () => {
  const BASEURL = "http://localhost:5000";
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASEURL}/api/products/${id}`);
        if (isMounted) {
          setProductData(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch product:", err);
          setError(err.message || 'An unexpected error occurred.');
          setLoading(false);
        }
      }
    };

    fetchProduct();

    socket.emit('joinProduct', id);
    console.log(`Joined product room: product_${id}`);

    const handleNewBid = (data) => {
      if (data.productId === id) {
        console.log('Received new bid via socket:', data);

        toast.info(`New bid placed: PKR ${data.bid.amount.toLocaleString()} by ${data.bid.bidder.name}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setProductData((prev) => {
          if (!prev) return prev;
          const newBids = [...(prev.bids || []), {
            amount: data.bid.amount,
            bidder: data.bid.bidder,
            createdAt: data.bid.timestamp,
            status: 'pending'
          }];

          return {
            ...prev,
            latestBid: data.bid.amount,
            totalBids: newBids.length,
            bids: newBids,
          };
        });
      }
    };

    socket.on('newBid', handleNewBid);

    return () => {
      isMounted = false;
      socket.emit('leaveProduct', id);
      console.log(`Left product room: product_${id}`);
      socket.off('newBid', handleNewBid);
    };
  }, [id, BASEURL]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-sans text-[#043E52]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg"
        >
          <Loader2 className="w-16 h-16 text-[#016A6D] animate-spin mb-4" />
          <p className="text-xl font-semibold">Loading product details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
        </motion.div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fef2f2] via-[#ffebeb] to-[#fffafa] font-sans text-red-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
          <p className="text-lg text-gray-700">Error loading product: <span className="font-mono text-red-600">{error}</span></p>
          <p className="text-sm text-gray-500 mt-4">Please try refreshing the page or check your internet connection.</p>
        </motion.div>
      </div>
    );
  }

  // --- Product Not Found State ---
  if (!productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f7fa] via-[#eef2f6] to-[#e6e9ed] font-sans text-gray-700">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg"
        >
          <Package className="w-16 h-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-lg text-gray-600">The product you are looking for does not exist or may have been removed.</p>
          <p className="text-sm text-gray-500 mt-4">Please check the URL or browse other available products.</p>
        </motion.div>
      </div>
    );
  }

  // Define tabs with necessary data structure
  const tabs = [
    {
      id: 'details',
      label: 'Details',
      // This line remains exactly as you provided in your "original" code
      content: <Details {...productData.details} />,
    },
    {
      id: 'profile',
      label: 'Seller Profile', // Updated for clarity
      content: <BidProfile profile={productData.profile} />,
    },
    {
      id: 'reviews',
      label: 'Seller Reviews',
      content: <SellerReviews sellerId={productData.profile.sellerId} />,
    },
    {
      id: 'contact',
      label: 'Contact Seller', // Updated for clarity
      content: <ContactInfo contact={productData.contact} />,
    },
    {
      id: 'previous',
      label: 'Previous Bids',
      content: <PreviousBids bids={productData.bids} />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-sans py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Top Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8 rounded-full"
        />

        {/* Breadcrumbs - Pass actual path segments for better navigation */}
        <Breadcrumbs
          paths={[
            { name: 'Home', link: '/' },
            { name: 'All Products', link: '/products' },
            { name: productData.title, link: `/product/${id}` }
          ]}
          arrowIcon={FiArrowRight} // Pass the specific arrow icon here
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* ProductGallery now expects a single 'images' array prop */}
          <ProductGallery images={[productData.images.main, ...(productData.images.thumbnails || [])]} />
          <ProductInfo
            title={productData.title}
            country={productData.country}
            startBid={productData.startBid}
            latestBid={productData.latestBid}
            totalBids={productData?.bids?.length}
            productId={id}
            bidIncrease={productData.bidIncrease}
            sellerId={productData.profile.sellerId}
          />
        </div>

        <div className="mt-12">
          <TabPanel tabs={tabs} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Breadcrumbs from '../components/BreadCrumbs';
// import ProductGallery from '../components/ProductGallery';
// import ProductInfo from '../components/ProductInfo';
// import TabPanel from '../components/TabPanel';
// import Details from '../components/Details';
// import BidProfile from '../components/BidProfile';
// import ContactInfo from '../components/ContactInfo';
// import PreviousBids from '../components/PreviousBids';
// import socket from '../socket';
// import { toast } from 'react-toastify';
// const ProductPage = () => {
//   // const BASEURL = "https://subhan-project-backend.onrender.com";
//   const BASEURL = "http://localhost:5000";
//   const { id } = useParams();
//   const [productData, setProductData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;
  
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`${BASEURL}/api/products/${id}`);
//         if (isMounted) {
//           setProductData(response.data);
//           setLoading(false);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err.message);
//           setLoading(false);
//         }
//       }
//     };
  
//     fetchProduct();
  
//     // Join the product room
//     socket.emit('joinProduct', id);
//     console.log(`Joined product room: product_${id}`);
  
//     const handleNewBid = (data) => {
//       if (data.productId === id) {
//         console.log('Received new bid via socket:', data);
  
//         toast.info(`New bid placed: Rs: ${data.bid.amount.toFixed(2)} by ${data.bid.bidder.name}`);
  
//         setProductData((prev) => ({
//           ...prev,
//           latestBid: data.bid.amount,
//           totalBids: (prev?.totalBids || 0) + 1,
//           bids: [
//             ...(prev?.bids || []),
//             {
//               amount: data.bid.amount,
//               bidder: data.bid.bidder,
//               createdAt: data.bid.timestamp,
//               status: 'pending'
//             }
//           ],
//         }));
//       }
//     };
  
//     socket.on('newBid', handleNewBid);
  
//     return () => {
//       isMounted = false;
//       socket.emit('leaveProduct', id);
//       socket.off('newBid', handleNewBid);
//     };
//   }, [id]);
  

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-24 flex justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-24 text-center">
//         <p className="text-red-500">Error loading product: {error}</p>
//       </div>
//     );
//   }

//   if (!productData) {
//     return (
//       <div className="container mx-auto px-4 py-24 text-center">
//         <p>Product not found</p>
//       </div>
//     );
//   }

//   const tabs = [
//     {
//       id: 'details',
//       label: 'Details',
//       content: <Details {...productData.details} />,
//     },
//     {
//       id: 'profile',
//       label: 'Bid Profile',
//       content: <BidProfile profile={productData.profile} />,
//     },
//     {
//       id: 'contact',
//       label: 'Contact Info',
//       content: <ContactInfo contact={productData.contact} />,
//     },
//     {
//       id: 'previous',
//       label: 'Previous Bids',
//       content: <PreviousBids bids={productData.bids} />,
//     },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-24">
//       <Breadcrumbs paths={['Home', 'All Products', productData.title]} />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <ProductGallery
//           mainImage={productData.images.main}
//           thumbnails={productData.images.thumbnails}
//         />
//         <ProductInfo
//           title={productData.title}
//           country={productData.country}
//           startBid={productData.startBid}
//           latestBid={productData.latestBid}
//           totalBids={productData?.bids?.length}
//           productId={id}
//           bidIncrease={productData.bidIncrease}
//           sellerId={productData.profile.sellerId}
//         />
//       </div>

//       <TabPanel tabs={tabs} />
//     </div>
//   );
// };

// export default ProductPage;