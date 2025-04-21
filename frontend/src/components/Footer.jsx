// import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

// const Footer = () => {
//   return (
//     <footer className="bg-black text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

//           {/* Section 1: Company */}
//           <div>
//             <h3 className="text-xl font-bold mb-4">BidMart</h3>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               We’re on a mission to reshape digital commerce. Whether you're a buyer or seller,
//               BidMart provides a seamless and secure platform to interact, bid, and grow.
//             </p>
//           </div>

//           {/* Section 2: Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2 text-gray-400 text-sm">
//               <li><a href="/" className="hover:text-white">Home</a></li>
//               <li><a href="/about" className="hover:text-white">About Us</a></li>
//               <li><a href="/products" className="hover:text-white">Products</a></li>
//               <li><a href="/contact" className="hover:text-white">Contact</a></li>
//               <li><a href="/faq" className="hover:text-white">FAQ</a></li>
//             </ul>
//           </div>

//           {/* Section 3: Why Choose Us */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Why Choose Us</h3>
//             <ul className="text-gray-400 text-sm space-y-2">
//               <li>✔ Trusted by 50K+ users</li>
//               <li>✔ Real-time bidding system</li>
//               <li>✔ 24/7 customer support</li>
//               <li>✔ Seamless seller onboarding</li>
//               <li>✔ Data-secure and scalable</li>
//             </ul>
//           </div>

//           {/* Section 4: Connect With Us */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
//             <p className="text-gray-400 text-sm mb-4">
//               Stay in the loop with our latest updates and launches.
//             </p>
//             <div className="flex space-x-4">
//               <FiFacebook className="w-6 h-6 hover:text-white cursor-pointer" />
//               <FiInstagram className="w-6 h-6 hover:text-white cursor-pointer" />
//               <FiTwitter className="w-6 h-6 hover:text-white cursor-pointer" />
//             </div>
//           </div>
//         </div>

//         {/* Bottom Text */}
//         <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
//           &copy; {new Date().getFullYear()} BidMart. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer;
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold">BidMart</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Premium auction marketplace connecting global buyers and sellers through seamless real-time bidding experiences.
            </p>
            <div className="flex items-center space-x-4 text-gray-400">
              <FiMapPin className="flex-shrink-0" />
              <span>123 Kinnaird College, Lahore City, Pakistan</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/buyer-guide" className="hover:text-white transition">Buyer's Guide</a></li>
              <li><a href="/seller-guide" className="hover:text-white transition">Seller's Guide</a></li>
              <li><a href="/products" className="hover:text-white transition">Featured Auctions</a></li>
              <li><a href="/products" className="hover:text-white transition">Browse Categories</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <FiPhone className="flex-shrink-0" />
                <span>1-800-BID-Mart</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="flex-shrink-0" />
                  <a href="mailto:bidmart2025@gmail.com" className="hover:text-white transition">
                  bidmart2025@gmail.com
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-semibold mb-3">Legal</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="/terms" className="hover:text-white transition">Terms of Service</a>
                <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} BidMart. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <FiFacebook className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
            <FiInstagram className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
            <FiTwitter className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer