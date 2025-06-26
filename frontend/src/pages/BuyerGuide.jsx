import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const BuyerGuide = () => {
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
          Buyer's <span className="text-[#FFAA5D]">Guide</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-[#043E52]/90 mb-10 leading-relaxed"
        >
          Welcome to BidMart — your trusted auction marketplace. Whether you're new to online bidding or a seasoned buyer, this guide will walk you through the steps to find, bid on, and win your next amazing product.
        </motion.p>

        {[
          {
            heading: "1. Create Your Account",
            body: "Sign up on BidMart as a buyer. Once registered, verify your email to unlock full access to the marketplace, including bidding, notifications, and dashboard features."
          },
          {
            heading: "2. Explore Auctions",
            body: "Head over to the 'Featured Auctions' or browse by category to find products. Use filters to narrow down your preferences by price, time left, and categories."
          },
          {
            heading: "3. Place Bids",
            body: "Click on any product to view its details. Enter your bid amount and confirm. You’ll be able to see real-time updates if someone outbids you."
          },
          {
            heading: "4. Winning & Payment",
            body: "If your bid wins, you'll receive a confirmation via dashboard and email. Head to your dashboard to complete the secure payment and await delivery."
          },
          {
            heading: "5. Get Support",
            body: "If you face any issues, BidMart’s support team is available at bidmart2025@gmail.com. You can also expect built-in messaging and real-time chat in future updates."
          }
        ].map((section, idx) => (
          <motion.div key={idx} variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-semibold text-[#043E52] mb-2">{section.heading}</h2>
            <p className="text-[#043E52]/80 leading-relaxed">{section.body}</p>
          </motion.div>
        ))}

        <motion.div variants={itemVariants} className="mt-12 border-t pt-6 border-[#FFAA5D]/30">
          <p className="text-[#FFAA5D] font-medium text-center">Need help?</p>
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

export default BuyerGuide;
