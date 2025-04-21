import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp , FiPhone,FiMail} from 'react-icons/fi';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');

  const faqCategories = {
    general: [
      {
        question: 'How do I create an account on Bidmart?',
        answer: 'Click the "Sign Up" button in the top right corner. You can register using your email address or social media accounts. Verification will be required to start bidding.'
      },
      {
        question: 'Is there a registration fee?',
        answer: 'No, creating an account on Bidmart is completely free. We only charge a small commission on successful sales.'
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
      }
    ]
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Breadcrumb Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-red-600 w-3 h-6 mr-2"></div>
          <nav className="text-sm md:text-base">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
              <li>/</li>
              <li className="font-medium text-gray-700">FAQs</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-3 gap-8 p-6">
          {/* Categories Sidebar */}
          <div className="md:border-r md:pr-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
            <div className="space-y-2">
              {Object.keys(faqCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === category 
                      ? 'bg-red-100 text-red-600' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              Frequently Asked Questions
            </h1>
            
            <div className="space-y-4">
              {faqCategories[selectedCategory].map((item, index) => (
                <div 
                  key={index}
                  className="border rounded-lg transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-4 py-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">{item.question}</span>
                    {activeIndex === index ? (
                      <FiChevronUp className="text-red-600 w-5 h-5" />
                    ) : (
                      <FiChevronDown className="text-gray-400 w-5 h-5" />
                    )}
                  </button>
                  
                  {activeIndex === index && (
                    <div className="px-4 py-4 bg-gray-50 border-t">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Get in touch with our support team for personalized assistance.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              <FiMail className="w-5 h-5" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;