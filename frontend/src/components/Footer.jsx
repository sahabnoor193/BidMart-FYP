// src/components/Footer.jsx
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-gray-300">Home</a></li>
              <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
              <li><a href="/about" className="hover:text-gray-300">About</a></li>
              <li><a href="/signup" className="hover:text-gray-300">Sign Up</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Our Mission</h3>
            <p className="text-gray-400">
              Empowering real-time connections for buyers and sellers.
              Seamlessly browse, bid, and interact with confidence.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4">Subscribe to our emails</h3>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Email"
                className="flex-grow px-4 py-2 bg-white/10 rounded-md"
              />
              <button className="px-6 py-2 bg-white text-black rounded-md hover:bg-gray-100">
                Subscribe
              </button>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <FiFacebook className="w-6 h-6 cursor-pointer hover:text-gray-300" />
              <FiInstagram className="w-6 h-6 cursor-pointer hover:text-gray-300" />
              <FiTwitter className="w-6 h-6 cursor-pointer hover:text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer