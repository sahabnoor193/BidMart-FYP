// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import LatestBids from '../components/LatestBids';
import Categories from '../components/Categories';
import CustomerReviews from '../components/CustomerReviews';

function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <LatestBids />
      <Categories />
      <CustomerReviews />
    </div>
  );
}

export default Home;