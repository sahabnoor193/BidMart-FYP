// // Navbar.jsx
// import { Link, useLocation } from 'react-router-dom';
// import { FiSearch, FiShoppingCart, FiHeart } from 'react-icons/fi';
// import { MdOutlinePersonAddAlt } from 'react-icons/md';
// import { HiMenu, HiX } from 'react-icons/hi';
// import { useState } from 'react';

// const Navbar = ({ 
//   logo = null, 
//   brandName = "BidMart",
//   menuItems = [
//     { path: "/", label: "Home" },
//     { path: "/contact", label: "Contact" },
//     { path: "/aboutus", label: "About" },
//     { path: "/faq", label: "FAQs" }
//   ],
//   showSearch = true,
//   showCart = true,
//   showFavorites = true,
//   showAuth = true,
//   favoritePath = "/favouritebids",
//   authPath = "/signup",
//   mobileMenuItems = null
// }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   // Check if current path matches favorite path
//   const isOnFavoritesPage = location.pathname === favoritePath;

//   // Use provided mobile menu items or default to desktop menu items
//   const resolvedMobileMenuItems = mobileMenuItems || menuItems;

//   return (
//     <nav className="bg-white text-gray-800 shadow-md fixed w-full z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               {logo && <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />}
//               <span className="text-2xl font-bold ml-2">{brandName}</span>
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden  items-center space-x-6">
//             {menuItems.map((item) => (
//               <Link 
//                 key={item.path} 
//                 to={item.path} 
//                 className="hover:text-gray-600"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="hidden  items-center space-x-1">
//             {showSearch && (
//               <button className="p-2 rounded-full hover:bg-gray-100">
//                 <FiSearch className="w-5 h-5" />
//               </button>
//             )}

//             {showCart && (
//               <button className="p-2 rounded-full hover:bg-gray-100">
//                 <FiShoppingCart className="w-5 h-5" />
//               </button>
//             )}

//             {showFavorites && (
//               <Link to={favoritePath}>
//                 <button className="p-2 rounded-full hover:bg-gray-100">
//                   <FiHeart 
//                     className={`w-5 h-5 ${isOnFavoritesPage ? 'text-red-500' : 'text-gray-600'}`} 
//                   />
//                 </button>
//               </Link>
//             )}

//             {showAuth && (
//               <Link
//                 to={authPath}
//                 className="p-2 rounded-full bg-red-600 text-white hover:bg-black flex items-center"
//               >
//                 <MdOutlinePersonAddAlt className="w-5 h-5" />
//               </Link>
//             )}
//           </div>

//           {/* Hamburger Menu */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-black p-2 rounded-md focus:outline-none"
//             >
//               {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full">
//           <div className="flex flex-col items-start px-6 py-4 space-y-4">
//             {resolvedMobileMenuItems.map((item) => (
//               <Link 
//                 key={item.path} 
//                 to={item.path} 
//                 className="text-black hover:text-gray-600"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/Logo.png';

const Navbar = ({
  brandName = "BidMart"
}) => {
  return (
    <nav className="bg-white/90 backdrop-blur-lg text-[#043E52] shadow-sm fixed w-full z-50 border-b border-[#016A6D]/20 font-serif">
      {/* Gradient Top Border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D]"
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand Name */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold text-[#043E52]">{brandName}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;