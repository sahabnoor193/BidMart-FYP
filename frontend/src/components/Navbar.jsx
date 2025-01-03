// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">BidsMart</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiShoppingCart className="w-5 h-5" />
            </button>
            <Link
              to="/signup"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar