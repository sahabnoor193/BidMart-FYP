// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import LatestBids from '../components/LatestBids';
import Categories from '../components/Categories';
import ExploreBids from '../components/ExploreBids';
import Testimonials from '../components/Testimonials';

function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <LatestBids />
      <Categories />
      <ExploreBids />
      <Testimonials />
    </div>
  );
}

export default Home;