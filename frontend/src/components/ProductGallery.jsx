import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ images }) => {
  const validImages = Array.isArray(images) && images.length > 0
    ? images
    : ['https://via.placeholder.com/600x400/e0e0e0/ffffff?text=No+Image'];

  const [currentImage, setCurrentImage] = useState(validImages[0]);

  useEffect(() => {
    setCurrentImage(validImages[0]);
  }, [images]);

  const imageVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-100 font-sans">
      {/* Main Image Display */}
      <div className="relative flex-1 rounded-lg overflow-hidden h-80 sm:h-96 lg:h-[400px] bg-gray-50 flex items-center justify-center border border-gray-200">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="Product main view"
            className="w-full h-full object-contain p-2 md:p-4"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/600x400/e0e0e0/ffffff?text=Image+Error';
            }}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails (Adjusted for single row, smaller boxes) */}
      <div className="flex flex-wrap justify-center gap-2"> {/* Use flex-wrap and justify-center */}
        {validImages.map((thumb, index) => (
          <motion.button
            key={index}
            // Smaller size: w-16 h-16 or w-20 h-20, remove flex-shrink-0 if it was causing issues
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 transform
                        ${currentImage === thumb ? 'ring-3 ring-[#E16A3D] scale-105 shadow-md' : 'hover:scale-105 hover:opacity-80 ring-2 ring-transparent'}
                        focus:outline-none focus:ring-4 focus:ring-[#016A6D]/50`}
            onClick={() => setCurrentImage(thumb)}
            whileHover={{ y: -2 }}
            aria-label={`View product image ${index + 1}`}
          >
            <img
              src={thumb}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/100/e0e0e0/ffffff?text=Thumb+Error';
              }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

// import React, { useState } from 'react';

// const ProductGallery = ({ 
//   mainImage = 'https://via.placeholder.com/400',
//   thumbnails = ['https://via.placeholder.com/100']
// }) => {
//   const [currentImage, setCurrentImage] = useState(mainImage);

//   return (
//     <div className="flex flex-col md:flex-row gap-4">
//       <div className="flex md:flex-col gap-2 order-2 md:order-1">
//         {thumbnails.map((thumb, index) => (
//           <button
//             key={index}
//             className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden transition-opacity duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentImage === thumb ? 'ring-2 ring-blue-500' : ''}`}
//             onClick={() => setCurrentImage(thumb)}
//           >
//             <img 
//               src={thumb} 
//               alt={`Product view ${index + 1}`} 
//               className="w-full h-full object-contain"
//               onError={(e) => {
//                 e.currentTarget.src = 'https://via.placeholder.com/100';
//               }}
//             />
//           </button>
//         ))}
//       </div>
//       <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden h-96 order-1 md:order-2">
//         <img 
//           src={currentImage} 
//           alt="Product main view" 
//           className="w-full h-full object-contain"
//           onError={(e) => {
//             e.currentTarget.src = 'https://via.placeholder.com/400';
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductGallery;
