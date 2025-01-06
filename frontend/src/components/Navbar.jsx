// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi'; // Icons for the hamburger menu
import Logo from '/assets/Logo.png';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold text-gray-900 ml-2">BidMart</span>
            </Link>
          </div>

          {/* Navigation Links for larger screens */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link to="/" className="text-gray-700 hover:text-gray-900">Bids</Link>
          </div>

          {/* Search, Cart, and Sign-Up */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiShoppingCart className="w-5 h-5" />
            </button>
            <Link
              to="/signup"
              className="p-2 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
            >
              <MdOutlinePersonAddAlt className="w-5 h-5" />
            </Link>
          </div>

          {/* Hamburger Menu Button for smaller screens */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 p-2 rounded-md focus:outline-none"
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu for smaller screens */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-lg shadow-lg absolute w-full">
          <div className="flex flex-col items-start px-4 py-4 space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium"
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium"
            >
              About
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium"
            >
              Bids
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;