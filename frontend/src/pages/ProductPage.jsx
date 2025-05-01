import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from '../components/BreadCrumbs';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import TabPanel from '../components/TabPanel';
import Details from '../components/Details';
import BidProfile from '../components/BidProfile';
import ContactInfo from '../components/ContactInfo';
import PreviousBids from '../components/PreviousBids';
import socket from '../socket';
import { toast } from 'react-toastify';
const ProductPage = () => {
  // const BASEURL = "https://subhan-project-backend.onrender.com";
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
          setError(err.message);
          setLoading(false);
        }
      }
    };
  
    fetchProduct();
  
    // Join the product room
    socket.emit('joinProduct', id);
    console.log(`Joined product room: product_${id}`);
  
    const handleNewBid = (data) => {
      if (data.productId === id) {
        console.log('Received new bid via socket:', data);
  
        toast.info(`New bid placed: Rs: ${data.bid.amount.toFixed(2)} by ${data.bid.bidder.name}`);
  
        setProductData((prev) => ({
          ...prev,
          latestBid: data.bid.amount,
          totalBids: (prev?.totalBids || 0) + 1,
          bids: [
            ...(prev?.bids || []),
            {
              amount: data.bid.amount,
              bidder: data.bid.bidder,
              createdAt: data.bid.timestamp,
              status: 'pending'
            }
          ],
        }));
      }
    };
  
    socket.on('newBid', handleNewBid);
  
    return () => {
      isMounted = false;
      socket.emit('leaveProduct', id);
      socket.off('newBid', handleNewBid);
    };
  }, [id]);
  

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

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p>Product not found</p>
      </div>
    );
  }

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: <Details {...productData.details} />,
    },
    {
      id: 'profile',
      label: 'Bid Profile',
      content: <BidProfile profile={productData.profile} />,
    },
    {
      id: 'contact',
      label: 'Contact Info',
      content: <ContactInfo contact={productData.contact} />,
    },
    {
      id: 'previous',
      label: 'Previous Bids',
      content: <PreviousBids bids={productData.bids} />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <Breadcrumbs paths={['Home', 'All Products', productData.title]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductGallery
          mainImage={productData.images.main}
          thumbnails={productData.images.thumbnails}
        />
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

      <TabPanel tabs={tabs} />
    </div>
  );
};

export default ProductPage;