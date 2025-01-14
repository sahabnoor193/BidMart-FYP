import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart,FiHeart } from 'react-icons/fi';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi';
import Logo from '../assets/Logo.png';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-gray-800 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
      {/* px-4 sm:px-6 lg:px-8 */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold ml-2">BidMart</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-600">Home</Link>
            <Link to="/products" className="hover:text-gray-600">Contact</Link>
            <Link to="/prebuilds" className="hover:text-gray-600">About</Link>
            <Link to="/faqs" className="hover:text-gray-600">FAQs</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-1">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiShoppingCart className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiHeart className="w-5 h-5" />
            </button>
            <Link
              to="/signup"
              className="p-2 rounded-full bg-red-600 text-white hover:bg-black flex items-center"
            >
              <MdOutlinePersonAddAlt className="w-5 h-5" />
            </Link>
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black p-2 rounded-md focus:outline-none"
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full">
          <div className="flex flex-col items-start px-6 py-4 space-y-4">
            <Link to="/" className="text-black hover:text-gray-600">Home</Link>
            <Link to="/products" className="text-black hover:text-gray-600">Products</Link>
            <Link to="/prebuilds" className="text-black hover:text-gray-600">Prebuilds</Link>
            <Link to="/faqs" className="text-black hover:text-gray-600">FAQs</Link>
            <Link to="/wishlist" className="text-black hover:text-gray-600">Wishlist</Link>
            <Link to="/login" className="text-black hover:text-gray-600">Login / Register</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
