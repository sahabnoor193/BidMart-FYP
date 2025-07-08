import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns'; // For professional date formatting

const PreviousBids = ({ bids = [] }) => {
  const bidItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-3 font-sans" // Applied font-sans, tighter spacing
    >
      {bids.length > 0 ? (
        bids.map((bid, index) => (
          <motion.div
            key={index}
            variants={bidItemVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="mb-1 sm:mb-0">
              <span className="text-gray-800 font-semibold text-base">{bid.bidder?.name || 'Anonymous Bidder'}</span>
              {bid.createdAt && (
                <p className="text-gray-500 text-xs mt-0.5">
                  {format(new Date(bid.createdAt), 'MMM dd, yyyy hh:mm a')} {/* Formatted date */}
                </p>
              )}
            </div>
            <span className="font-bold text-lg text-[#E16A3D] whitespace-nowrap"> {/* Secondary accent for amount */}
              PKR {typeof bid.amount === 'number' ? bid.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 }) : '0.00'}
            </span>
          </motion.div>
        ))
      ) : (
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100 text-gray-500 text-base">
          No previous bids found for this product. Be the first to bid!
        </div>
      )}
    </motion.div>
  );
};

export default PreviousBids;