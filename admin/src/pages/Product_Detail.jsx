// import { useSelector } from 'react-redux';
// import {
//   FiCalendar,
//   FiDollarSign,
//   FiShoppingBag,
//   FiTag,
//   FiMapPin,
//   FiUser,
// } from 'react-icons/fi';

// const Product = () => {
//   const single_product = useSelector((state) => state.products.single_product);

//   if (!single_product) {
//     return <div className="p-8 text-center text-gray-500">No product selected</div>;
//   }

//   const {
//     name,
//     brand,
//     description,
//     category,
//     country,
//     city,
//     quantity,
//     startingPrice,
//     bidIncrease,
//     bidQuantity,
//     startDate,
//     endDate,
//     images,
//     mainImageIndex,
//     user,
//     status,
//   } = single_product;

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-20 pt-[80px]">
//       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="relative">
//             <img
//               src={images?.[mainImageIndex] || '/placeholder.jpg'}
//               alt={name}
//               className="w-full h-full object-cover"
//             />
//             <span className="absolute top-4 left-4 bg-green-500 text-white text-sm px-3 py-1 rounded-full capitalize">
//               {status}
//             </span>
//           </div>

//           <div className="p-6 flex flex-col justify-between">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">{name}</h2>
//               <p className="text-sm text-gray-500 mb-4">{description}</p>

//               <div className="space-y-3 text-sm text-gray-700">
//                 <p className="flex items-center">
//                   <FiTag className="mr-2" /> <strong>Brand:</strong> {brand}
//                 </p>
//                 <p className="flex items-center">
//                   <FiShoppingBag className="mr-2" /> <strong>Category:</strong> {category}
//                 </p>
//                 <p className="flex items-center">
//                   <FiMapPin className="mr-2" /> <strong>Location:</strong> {city}, {country}
//                 </p>
//                 <p className="flex items-center">
//                   <FiUser className="mr-2" /> <strong>Seller:</strong> {user?.name} ({user?.email})
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
//               <div>
//                 <p>
//                   <FiDollarSign className="inline mr-1" /> <strong>Starting Price:</strong> ${startingPrice}
//                 </p>
//                 <p>
//                   <strong>Bid Increase:</strong> ${bidIncrease}
//                 </p>
//                 <p>
//                   <strong>Bid Quantity:</strong> {bidQuantity}
//                 </p>
//               </div>
//               <div>
//                 <p>
//                   <FiCalendar className="inline mr-1" /> <strong>Start:</strong>{' '}
//                   {new Date(startDate).toLocaleString()}
//                 </p>
//                 <p>
//                   <FiCalendar className="inline mr-1" /> <strong>End:</strong>{' '}
//                   {new Date(endDate).toLocaleString()}
//                 </p>
//                 <p>
//                   <strong>Quantity Available:</strong> {quantity}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;


import { useSelector } from 'react-redux';
import {
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiTag,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Product = () => {
  const single_product = useSelector((state) => state.products.single_product);

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

  if (!single_product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#e6f2f5] to-white p-8 text-center"
      >
        <div className="text-[#043E52]/70">
          <FiShoppingBag className="mx-auto text-4xl mb-4" />
          <p>No product selected</p>
        </div>
      </motion.div>
    );
  }

  const {
    name,
    brand,
    description,
    category,
    country,
    city,
    quantity,
    startingPrice,
    bidIncrease,
    bidQuantity,
    startDate,
    endDate,
    images,
    mainImageIndex,
    user,
    status,
  } = single_product;

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#016A6D]';
      case 'pending':
        return 'bg-[#FFAA5D]';
      case 'sold':
        return 'bg-[#E16A3D]';
      default:
        return 'bg-[#043E52]';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white py-12 px-4 sm:px-6 lg:px-8 pt-[90px] font-serif"
    >
      {/* Decorative Border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
      />

      <motion.div 
        variants={itemVariants}
        className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-[#016A6D]/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Section */}
          <motion.div 
            variants={itemVariants}
            className="relative h-full min-h-[400px]"
          >
            <img
              src={images?.[mainImageIndex] || '/placeholder.jpg'}
              alt={name}
              className="w-full h-full object-cover"
            />
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute top-4 left-4 ${getStatusColor()} text-white text-sm px-3 py-1 rounded-full capitalize shadow-md`}
            >
              {status}
            </motion.span>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            variants={itemVariants}
            className="p-8 flex flex-col justify-between"
          >
            <div>
              <motion.h2 
                variants={itemVariants}
                className="text-3xl font-bold text-[#043E52] mb-3"
              >
                {name}
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-[#043E52]/80 mb-6 leading-relaxed"
              >
                {description}
              </motion.p>

              <motion.div 
                variants={containerVariants}
                className="space-y-4 text-[#043E52]"
              >
                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <FiTag className="mt-0.5 flex-shrink-0 text-[#016A6D]" />
                  <div>
                    <span className="font-medium">Brand:</span> {brand}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <FiShoppingBag className="mt-0.5 flex-shrink-0 text-[#016A6D]" />
                  <div>
                    <span className="font-medium">Category:</span> {category}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <FiMapPin className="mt-0.5 flex-shrink-0 text-[#016A6D]" />
                  <div>
                    <span className="font-medium">Location:</span> {city}, {country}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-3">
                  <FiUser className="mt-0.5 flex-shrink-0 text-[#016A6D]" />
                  <div>
                    <span className="font-medium">Seller:</span> {user?.name} ({user?.email})
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Pricing and Dates */}
            <motion.div 
              variants={containerVariants}
              className="mt-8 border-t border-[#016A6D]/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-lg font-medium text-[#043E52] flex items-center gap-2">
                  <FiDollarSign className="text-[#E16A3D]" />
                  Pricing Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Starting Price:</span>
                    <span className="font-medium text-[#043E52]">PKR {startingPrice}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Bid Increase:</span>
                    <span className="font-medium text-[#043E52]">${bidIncrease}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Bid Quantity:</span>
                    <span className="font-medium text-[#043E52]">{bidQuantity}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-lg font-medium text-[#043E52] flex items-center gap-2">
                  <FiCalendar className="text-[#016A6D]" />
                  Auction Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Start Date:</span>
                    <span className="font-medium text-[#043E52]">
                      {new Date(startDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">End Date:</span>
                    <span className="font-medium text-[#043E52]">
                      {new Date(endDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#043E52]/5">
                    <span className="text-[#043E52]/80">Quantity:</span>
                    <span className="font-medium text-[#043E52]">{quantity}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Product;