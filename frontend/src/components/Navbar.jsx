// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaUserPlus } from 'react-icons/fa'; // For Sign Up icon
import Logo from '/assets/Logo.png'; // Import your logo

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <img
                src={Logo}
                alt="Logo"
                className="h-8 w-8 object-contain" // Adjust size as needed
              />
              <span className="text-2xl font-bold text-gray-900 ml-2">BidMart</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link to="/" className="text-gray-700 hover:text-gray-900">Bids</Link>
          </div>

          {/* Search, Cart, and Sign Up */}
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
              <FaUserPlus className="w-5 h-5" /> {/* Sign Up Icon */}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
