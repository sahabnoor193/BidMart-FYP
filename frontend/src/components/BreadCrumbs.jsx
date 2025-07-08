import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// FiArrowRight will be passed as a prop from ProductPage
// import { FiArrowRight } from "react-icons/fi"; // No longer needed if passed as prop

const Breadcrumbs = ({ paths, arrowIcon: ArrowIcon }) => { // Destructure arrowIcon and rename to ArrowIcon
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav
      className="flex items-center gap-1.5 md:gap-2 text-sm sm:text-base text-gray-600 mb-6 font-medium font-sans" // Apply font-sans
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.08 }}
      aria-label="breadcrumb"
    >
      {/* Visual accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#E16A3D] h-4 w-1.5 rounded-full mr-2"
      />

      {paths.map((path, index) => (
        <React.Fragment key={path.link || index}>
          {index > 0 && (
            <motion.div variants={itemVariants}>
              {/* Use the passed ArrowIcon component */}
              {ArrowIcon && <ArrowIcon size={18} className="text-[#FFAA5D]" />} {/* Use accent color for arrow */}
            </motion.div>
          )}
          <motion.div variants={itemVariants}>
            {index === paths.length - 1 ? (
              <span className="text-[#016A6D] font-semibold"> {/* Primary accent for active */}
                {path.name}
              </span>
            ) : (
              <Link to={path.link} className="hover:text-[#E16A3D] transition-colors duration-200"> {/* Secondary accent on hover */}
                {path.name}
              </Link>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </motion.nav>
  );
};

export default Breadcrumbs;