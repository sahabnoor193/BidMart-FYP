import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const SellerGuide = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-16"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Top Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-10"
        />

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-[#043E52] mb-6"
        >
          Seller's <span className="text-[#FFAA5D]">Guide</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-[#043E52]/90 mb-10 leading-relaxed"
        >
          Start selling on BidMart with confidence. This guide outlines every step you need to list products, run auctions, and manage successful sales.
        </motion.p>

        {[
          {
            heading: "1. Register as a Seller",
            body: "From your dashboard, switch your user type to 'Seller'. Fill in your seller profile to ensure buyers can trust your listings."
          },
          {
            heading: "2. List a Product",
            body: "Add detailed product info, upload high-quality images, choose a starting bid, and set the auction duration. Hit publish to go live."
          },
          {
            heading: "3. Manage Listings",
            body: "From your seller dashboard, you can edit listings before bidding starts, monitor their status, or remove expired items."
          },
          {
            heading: "4. Monitor Bids",
            body: "Watch bids roll in live. Stay informed about the highest bid and remaining time, so you're ready to close the deal."
          },
          {
            heading: "5. Finalize the Sale",
            body: "Once the auction ends, the winner will be notified. Coordinate delivery and confirm payment as per BidMart’s process."
          }
        ].map((section, idx) => (
          <motion.div key={idx} variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-semibold text-[#043E52] mb-2">{section.heading}</h2>
            <p className="text-[#043E52]/80 leading-relaxed">{section.body}</p>
          </motion.div>
        ))}

        <motion.div variants={itemVariants} className="mt-12 border-t pt-6 border-[#FFAA5D]/30">
          <p className="text-[#FFAA5D] font-medium text-center">Need support?</p>
          <p className="text-center">
            <a href="mailto:bidmart2025@gmail.com" className="text-[#016A6D] underline hover:text-[#FFAA5D]">
              bidmart2025@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SellerGuide;
