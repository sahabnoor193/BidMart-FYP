import React from 'react';
import Breadcrumbs from '../components/BreadCrumbs';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import TabPanel from '../components/TabPanel';
import Details from '../components/Details';
import BidProfile from '../components/BidProfile';
import ContactInfo from '../components/ContactInfo';
import PreviousBids from '../components/PreviousBids';
import Breadcrumbs from '../components/BreadCrumbs';

const ProductPage = () => {
  const productData = {
    title: 'Havic HV G-92 Gamepad',
    country: 'United States',
    startBid: 99.99,
    latestBid: 120.0,
    totalBids: 5,
    images: {
      main: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
      ],
    },
    details: {
      quantity: 2,
      brand: 'Havic',
      dateStart: '00/00/00',
      dateEnd: '00/00/00',
      description:
        'PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.',
    },
    profile: {
      name: 'XYZ',
      years: 'XYZ',
      time: 'XYZ',
      bids: 'XYZ',
    },
    contact: {
      name: 'XYZ',
      email: 'XYZ@gmail.com',
      phone: 'XYZ-XYZ-XYZ',
    },
    previousBids: [
      { item: 'Item1', price: 100 },
      { item: 'Item2', price: 150 },
      { item: 'Item3', price: 200 },
    ],
  };

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
      <Breadcrumbs paths={['Home', 'Product']} />

      <div className="grid grid-cols-2 gap-8">
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
        />
      </div>

      <TabPanel tabs={tabs} />
    </div>
  );
};

export default ProductPage;
