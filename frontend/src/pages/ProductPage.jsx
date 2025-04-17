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

const ProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProductData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
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
      content: <PreviousBids bids={productData.previousBids} />,
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
          totalBids={productData.totalBids}
          productId={id}
        />
      </div>

      <TabPanel tabs={tabs} />
    </div>
  );
};

export default ProductPage;