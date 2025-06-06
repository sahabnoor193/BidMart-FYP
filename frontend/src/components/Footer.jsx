// import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'

// const Footer = () => {
//   return (
//     <footer className="bg-black text-white border-t border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <div className="lg:col-span-2">
//             <div className="flex items-center mb-4">
//               <span className="text-2xl font-bold">BidMart</span>
//             </div>
//             <p className="text-gray-400 text-sm mb-6">
//               Premium auction marketplace connecting global buyers and sellers through seamless real-time bidding experiences.
//             </p>
//             <div className="flex items-center space-x-4 text-gray-400">
//               <FiMapPin className="flex-shrink-0" />
//               <span>123 Kinnaird College, Lahore City, Pakistan</span>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
//             <ul className="space-y-2 text-gray-400">
//               <li><a href="/buyer-guide" className="hover:text-white transition">Buyer's Guide</a></li>
//               <li><a href="/seller-guide" className="hover:text-white transition">Seller's Guide</a></li>
//               <li><a href="/products" className="hover:text-white transition">Featured Auctions</a></li>
//               <li><a href="/products" className="hover:text-white transition">Browse Categories</a></li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Support</h3>
//             <div className="space-y-2 text-gray-400">
//               <div className="flex items-center space-x-2">
//                 <FiPhone className="flex-shrink-0" />
//                 <span>1-800-BID-Mart</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <FiMail className="flex-shrink-0" />
//                   <a href="mailto:bidmart2025@gmail.com" className="hover:text-white transition">
//                   bidmart2025@gmail.com
//                 </a>
//               </div>
//             </div>
            
//             <div className="mt-6 pt-4 border-t border-gray-800">
//               <h4 className="text-sm font-semibold mb-3">Legal</h4>
//               <div className="flex flex-wrap gap-4 text-sm">
//                 <a href="/terms" className="hover:text-white transition">Terms of Service</a>
//                 <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
//           <div className="text-gray-400 text-sm mb-4 md:mb-0">
//             © {new Date().getFullYear()} BidMart. All rights reserved.
//           </div>
//           <div className="flex space-x-6">
//             <FiFacebook className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
//             <FiInstagram className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
//             <FiTwitter className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#043E52] to-[#016A6D] text-white font-serif relative">
      {/* Decorative top border */}
      <div className="w-full h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-[#FFAA5D]">BidMart</span>
            </div>
            <p className="text-[#D4E8EC] text-sm mb-6">
              Premium auction marketplace connecting global buyers and sellers through seamless real-time bidding experiences.
            </p>
            <div className="flex items-center space-x-4 text-[#D4E8EC]">
              <FiMapPin className="text-[#FFAA5D]" />
              <span>123 Kinnaird College, Lahore City, Pakistan</span>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFAA5D]">Marketplace</h3>
            <ul className="space-y-2 text-[#D4E8EC]">
              <li><a href="/buyer-guide" className="hover:text-[#FFAA5D] transition">Buyer's Guide</a></li>
              <li><a href="/seller-guide" className="hover:text-[#FFAA5D] transition">Seller's Guide</a></li>
              <li><a href="/products" className="hover:text-[#FFAA5D] transition">Featured Auctions</a></li>
              <li><a href="/products" className="hover:text-[#FFAA5D] transition">Browse Categories</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFAA5D]">Support</h3>
            <div className="space-y-2 text-[#D4E8EC]">
              <div className="flex items-center space-x-2">
                <FiPhone className="text-[#FFAA5D]" />
                <span>1-800-BID-Mart</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="text-[#FFAA5D]" />
                <a href="mailto:bidmart2025@gmail.com" className="hover:text-[#FFAA5D] transition">
                  bidmart2025@gmail.com
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#D4E8EC]/20">
              <h4 className="text-sm font-semibold mb-3 text-[#FFAA5D]">Legal</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="/terms" className="hover:text-[#FFAA5D] transition">Terms of Service</a>
                <a href="/privacy" className="hover:text-[#FFAA5D] transition">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D4E8EC]/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} BidMart. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <FiFacebook className="w-5 h-5 cursor-pointer hover:text-[#FFAA5D] transition" />
            <FiInstagram className="w-5 h-5 cursor-pointer hover:text-[#FFAA5D] transition" />
            <FiTwitter className="w-5 h-5 cursor-pointer hover:text-[#FFAA5D] transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;