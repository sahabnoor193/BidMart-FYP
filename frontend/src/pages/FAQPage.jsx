import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiMail, FiHelpCircle, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const faqCategories = {
    general: [
      {
        question: 'How do I create an account on Bidmart?',
        answer: 'Click the "Sign Up" button in the top right corner. You can register using your email address or social media accounts. Verification will be required to start bidding.'
      },
      {
        question: 'Is there a registration fee?',
        answer: 'No, creating an account on Bidmart is completely free. We only charge a small commission on successful sales.'
      },
      {
        question: 'How do I verify my account?',
        answer: 'After signing up, you\'ll receive a verification email. Click the link in the email to verify your account. You may also need to provide identification documents for seller verification.'
      },
      {
        question: 'Can I use multiple accounts?',
        answer: 'No, each user is allowed only one account. Multiple accounts may result in suspension of all associated accounts.'
      }
    ],
    bidding: [
      {
        question: 'How does the bidding process work?',
        answer: 'Find an item you like, place your maximum bid amount, and our system will automatically bid for you up to that amount. You\'ll be notified if you\'re outbid.'
      },
      {
        question: 'Can I retract a bid?',
        answer: 'Bids are binding. You may only retract bids in exceptional circumstances, which must be approved by our support team.'
      },
      {
        question: 'What is the auto-bidding system?',
        answer: 'Our auto-bidding system will place bids on your behalf up to your maximum specified amount, only bidding enough to maintain your position as the highest bidder.'
      },
      {
        question: 'How do I know if I won an auction?',
        answer: 'You\'ll receive an email and app notification immediately when you win an auction. The item will also appear in your "Won Auctions" section.'
      }
    ],
    payments: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers. All transactions are securely processed through our encrypted payment gateway.'
      },
      {
        question: 'When is payment required?',
        answer: 'Payment is required immediately after winning an auction. Items will be shipped once payment is confirmed.'
      },
      {
        question: 'Is there buyer protection?',
        answer: 'Yes, we offer buyer protection for all transactions. If the item doesn\'t match the description or isn\'t delivered, you may be eligible for a refund.'
      },
      {
        question: 'What currency are prices in?',
        answer: 'All prices are in USD. International users will see approximate conversions based on current exchange rates.'
      }
    ],
    shipping: [
      {
        question: 'How long does shipping take?',
        answer: 'Shipping times vary by seller and location. Most domestic shipments arrive within 3-5 business days after payment confirmation.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, many sellers offer international shipping. Check the item listing for specific shipping options and costs.'
      },
      {
        question: 'How are shipping costs calculated?',
        answer: 'Shipping costs are determined by the seller based on item size, weight, and destination. You\'ll see the shipping cost before placing your bid.'
      },
      {
        question: 'Can I track my shipment?',
        answer: 'Yes, once your item ships, you\'ll receive a tracking number via email that you can use to monitor your package\'s progress.'
      }
    ]
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredQuestions(faqCategories[selectedCategory]);
    } else {
      const results = Object.values(faqCategories)
        .flat()
        .filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8);
      setFilteredQuestions(results);
    }
  }, [searchQuery, selectedCategory]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const categoryVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    tap: { scale: 0.98 }
  };

  const answerVariants = {
    open: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Floating decorative elements bg-gradient-to-br from-[#e6f2f5] via-[#d4e8ec] to-[#c2dfe3] */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              opacity: [0, 0.1, 0],
              y: [0, Math.random() * 200 - 100],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            className={`absolute rounded-full ${
              i % 2 === 0 ? 'bg-[#FFAA5D]/20' : 'bg-[#E16A3D]/20'
            }`}
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Animated header with breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 100 }
          }}
          className="mb-8"
        >
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                transition: { type: "spring", stiffness: 200 }
              }}
              className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
            />
            <nav className="text-xs md:text-sm">
              <ol className="flex items-center space-x-2 text-[#043E52]/80">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#FFAA5D] transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="font-medium text-[#043E52]">FAQs</li>
              </ol>
            </nav>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.2 }
            }}
            className="text-2xl md:text-3xl font-bold mt-4 text-[#043E52]"
          >
            How can we <span className="text-[#FFAA5D]">help</span> you?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.4 }
            }}
            className="text-[#043E52]/80 mt-2 max-w-2xl text-sm"
          >
            Find answers to common questions about our platform, bidding process, and payments.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/95 backdrop-blur-lg shadow-sm rounded-lg overflow-hidden relative"
        >
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D]"></div>
          
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Categories Sidebar */}
            <motion.div
              variants={itemVariants}
              className="md:border-r md:pr-6 border-[#016A6D]/20"
            >
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-[#016A6D]/10 p-3 rounded-lg mb-4 flex items-center"
              >
                <FiHelpCircle className="text-[#043E52] w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold text-[#043E52]">
                  FAQ Categories
                </h2>
              </motion.div>
              
              <div className="space-y-2">
                {Object.keys(faqCategories).map((category) => (
                  <motion.button
                    key={category}
                    variants={categoryVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveIndex(null);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center text-sm ${
                      selectedCategory === category && searchQuery === ''
                        ? 'bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white font-medium'
                        : 'text-[#043E52] hover:bg-[#016A6D]/10 border border-transparent hover:border-[#016A6D]/20'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                      selectedCategory === category && searchQuery === '' 
                        ? 'bg-white/20' 
                        : 'bg-[#016A6D]/10'
                    }`}>
                      {category.charAt(0).toUpperCase()}
                    </span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* FAQ Content */}
            <div className="md:col-span-2">
              <motion.div
                variants={itemVariants}
                className="flex items-center mb-6"
              >
                <div className="w-8 h-8 rounded-full bg-[#FFAA5D]/20 flex items-center justify-center mr-3">
                  <FiHelpCircle className="text-[#E16A3D] w-4 h-4" />
                </div>
                <h1 className="text-xl font-semibold text-[#043E52]">
                  {searchQuery ? 'Search Results' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Questions
                </h1>
              </motion.div>

              {/* Search box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.4 }
                }}
                className="mb-6"
              >
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#016A6D] w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions or answers..."
                    className="w-full pl-10 pr-6 py-2 text-sm rounded-lg border border-[#016A6D]/30 focus:outline-none focus:ring-1 focus:ring-[#FFAA5D] focus:border-transparent"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#016A6D] hover:text-[#E16A3D] text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-xs text-[#043E52]/70 mt-1">
                    {filteredQuestions.length} results found
                  </p>
                )}
              </motion.div>
              
              <AnimatePresence mode='wait'>
                <motion.div
                  variants={containerVariants}
                  className="space-y-3"
                  key={selectedCategory + searchQuery}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {(searchQuery ? filteredQuestions : faqCategories[selectedCategory]).map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="border rounded-lg border-[#016A6D]/20 hover:shadow-xs transition-shadow duration-200 overflow-hidden"
                      whileHover={{ y: -1 }}
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-[#FFAA5D]/5 transition-colors duration-200 group text-sm"
                      >
                        <span className="font-medium text-[#043E52] group-hover:text-[#E16A3D] transition-colors duration-200">
                          {item.question}
                        </span>
                        <motion.div
                          animate={{ rotate: activeIndex === index ? 180 : 0 }}
                          className="w-6 h-6 rounded-full bg-[#016A6D]/10 flex items-center justify-center group-hover:bg-[#E16A3D]/10 transition-colors duration-200"
                        >
                          {activeIndex === index ? (
                            <FiChevronUp className="text-[#E16A3D] w-3 h-3" />
                          ) : (
                            <FiChevronDown className="text-[#016A6D] w-3 h-3" />
                          )}
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {activeIndex === index && (
                          <motion.div
                            variants={answerVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="px-4 overflow-hidden"
                          >
                            <div className="pb-3 pt-1 border-t border-[#016A6D]/20">
                              <p className="text-[#043E52] text-sm leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                  {searchQuery && filteredQuestions.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="text-[#043E52]/70 mb-3">
                        <FiHelpCircle className="w-8 h-8 mx-auto" />
                      </div>
                      <h3 className="text-base font-medium text-[#043E52] mb-1">No results found</h3>
                      <p className="text-[#043E52]/70 text-sm">Try different search terms or browse our categories</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Support CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.8 }
            }}
            className="bg-gradient-to-r from-[#043E52] to-[#016A6D] p-8 text-center relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-[#FFAA5D] blur-xl"></div>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-[#E16A3D] blur-xl"></div>
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.h3
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: 10, opacity: 0 }}
                viewport={{ once: true }}
                className="text-xl font-semibold mb-4 text-white"
              >
                Still have questions?
              </motion.h3>
              <motion.p
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: 10, opacity: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/90 mb-6 text-sm"
              >
                Our dedicated support team is available 24/7 to assist you with any questions or concerns.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center space-x-2 bg-[#E16A3D] hover:bg-[#FFAA5D] text-white px-6 py-2 rounded-lg transition-all duration-200 shadow text-sm"
                >
                  <FiMail className="w-4 h-4" />
                  <span>Contact Our Support Team</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;