// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { format } from 'date-fns'; // Import format for date utility

// // const Details = ({ quantity, brand, dateStart, dateEnd, description }) => {
// //   const detailItemVariants = {
// //     hidden: { opacity: 0, y: 10 },
// //     visible: { opacity: 1, y: 0 }
// //   };

// //   return (
// //     <motion.div
// //       initial="hidden"
// //       animate="visible"
// //       variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
// //       className="space-y-6 font-sans"
// //     >
// //       {/* Key Details Grid */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //         <motion.div variants={detailItemVariants} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-medium text-gray-500 mb-1">Quantity</h3>
// //           <p className="text-base font-semibold text-[#043E52]">{quantity || 'N/A'}</p>
// //         </motion.div>
// //         <motion.div variants={detailItemVariants} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-medium text-gray-500 mb-1">Brand</h3>
// //           <p className="text-base font-semibold text-[#043E52]">{brand || 'N/A'}</p>
// //         </motion.div>
// //         <motion.div variants={detailItemVariants} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-medium text-gray-500 mb-1">Auction Start</h3>
// //           <p className="text-base font-semibold text-[#043E52]">{dateStart ? format(new Date(dateStart), 'MMM dd, yyyy') : 'N/A'}</p>
// //         </motion.div>
// //         <motion.div variants={detailItemVariants} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-medium text-gray-500 mb-1">Auction End</h3>
// //           <p className="text-base font-semibold text-[#043E52]">{dateEnd ? format(new Date(dateEnd), 'MMM dd, yyyy') : 'N/A'}</p>
// //         </motion.div>
// //       </div>

// //       {/* Description Section */}
// //       <motion.div variants={detailItemVariants} className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
// //         <h3 className="text-lg font-bold text-[#043E52] mb-3">Product Description</h3>
// //         <p className="text-gray-700 leading-relaxed text-base">
// //           {description || 'No description available for this product.'}
// //         </p>
// //       </motion.div>
// //     </motion.div>
// //   );
// // };

// // export default Details;

// import React from 'react';

// const Details = ({ quantity, brand, dateStart, dateEnd, description }) => {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-4 gap-4">
//         <div className="p-4 bg-white rounded-lg">
//           <h3 className="text-lg font-medium">Quantity</h3>
//           <p>{quantity}</p>
//         </div>
//         <div className="p-4 bg-white rounded-lg">
//           <h3 className="text-lg font-medium">Brand</h3>
//           <p>{brand}</p>
//         </div>
//         <div className="p-4 bg-white rounded-lg">
//           <h3 className="text-lg font-medium">Date Start</h3>
//           <p>{dateStart}</p>
//         </div>
//         <div className="p-4 bg-white rounded-lg">
//           <h3 className="text-lg font-medium">Date End</h3>
//           <p>{dateEnd}</p>
//         </div>
//       </div>
//       <div className="p-4 bg-white rounded-lg">
//         <h3 className="text-lg font-medium mb-2">Description</h3>
//         <p className="text-gray-600">{description}</p>
//       </div>
//     </div>
//   );
// };

// export default Details;
import React from 'react';
import { FiBox, FiTag, FiCalendar, FiClock, FiAlignLeft } from 'react-icons/fi';

const Details = ({ quantity, brand, dateStart, dateEnd, description }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quantity Card */}
        <div className="p-6 bg-white rounded-xl border border-[#016A6D]/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#043E52]/10 rounded-lg">
              <FiBox className="w-5 h-5 text-[#016A6D]" />
            </div>
            <h3 className="text-sm font-medium text-[#043E52]">Quantity</h3>
          </div>
          <p className="text-2xl font-semibold text-[#E16A3D]">{quantity}</p>
        </div>

        {/* Brand Card */}
        <div className="p-6 bg-white rounded-xl border border-[#016A6D]/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#043E52]/10 rounded-lg">
              <FiTag className="w-5 h-5 text-[#016A6D]" />
            </div>
            <h3 className="text-sm font-medium text-[#043E52]">Brand</h3>
          </div>
          <p className="text-lg text-[#043E52] font-medium">{brand}</p>
        </div>

        {/* Date Start Card */}
        <div className="p-6 bg-white rounded-xl border border-[#016A6D]/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#043E52]/10 rounded-lg">
              <FiCalendar className="w-5 h-5 text-[#016A6D]" />
            </div>
            <h3 className="text-sm font-medium text-[#043E52]">Date Start</h3>
          </div>
          <p className="text-[#016A6D] font-medium">{dateStart}</p>
        </div>

        {/* Date End Card */}
        <div className="p-6 bg-white rounded-xl border border-[#016A6D]/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#043E52]/10 rounded-lg">
              <FiClock className="w-5 h-5 text-[#016A6D]" />
            </div>
            <h3 className="text-sm font-medium text-[#043E52]">Date End</h3>
          </div>
          <p className="text-[#016A6D] font-medium">{dateEnd}</p>
        </div>
      </div>

      {/* Description Card */}
      <div className="p-8 bg-white rounded-xl border border-[#016A6D]/20 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#043E52]/10 rounded-lg">
            <FiAlignLeft className="w-5 h-5 text-[#016A6D]" />
          </div>
          <h3 className="text-lg font-medium text-[#043E52]">Description</h3>
        </div>
        <p className="text-[#043E52]/90 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default Details;