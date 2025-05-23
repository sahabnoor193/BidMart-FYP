// import { Link , useLocation } from 'react-router-dom';
// import { FiSearch, FiShoppingCart,FiHeart } from 'react-icons/fi';
// import { MdOutlinePersonAddAlt } from 'react-icons/md';
// import { HiMenu, HiX } from 'react-icons/hi';
// import Logo from '../assets/Logo.png';
// import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Navbar = ({isAuthenticated, setIsAuthenticated}) => {
//   // const BASEURL = "https://subhan-project-backend.onrender.com";
//   const BASEURL = "http://localhost:5000";
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);  
//   const [user, setUser] = useState("");
//   const [userRole, setUserRole] = useState("");
  
//     useEffect(() => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         const userName = localStorage.getItem("userName") || localStorage.getItem("name") ;
//         const userType = localStorage.getItem("userType");
//         setUserRole(userType);
//         setUser(userName);
//         setIsAuthenticated(true);
//       }
//       else {
//         setUser(""); // Clear the user state
//         setUserRole(""); // Clear the user role state
//         setIsAuthenticated(false);
//       }
//     }, [isAuthenticated]);
  
//     const [open, setOpen] = useState(false);
//     const menuRef = useRef();
  
//     // Close the dropdown if clicked outside
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (menuRef.current && !menuRef.current.contains(event.target)) {
//           setOpen(false);
//         }
//       };
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, []);
//    // Get the current location
//    const location = useLocation();

//    // Check if the current page is /favouritesBids
//    const isOnFavoritesPage = location.pathname === '/favouritesBids';
//    const logout = async () => {
//     try {
//       const token = localStorage.getItem("token");
  
//       const response = await axios.post(
//         `${BASEURL}/api/auth/logout`,
//         {}, // empty body (if your API doesn't expect any data)
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
  
//       if (response.status === 200) {
//         toast.success('Logout successful!');
  
//         // List of keys to remove
//         const keysToRemove = [
//           'email',
//           'name',
//           'password',
//           'sellerData',
//           'token',
//           'type',
//           'userEmail',
//           'userName',
//           'userType',
//         ];
  
//         keysToRemove.forEach((key) => {
//           localStorage.removeItem(key);
//         });
          
//         // Optionally redirect to login page
//         // window.location.href = '/login';
//         setUser(""); // Clear the user state
//         setUserRole(""); // Clear the user role state
//         setIsAuthenticated(false);
//       } else {
//         toast.error('Logout failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//       toast.error('An error occurred during logout.');
//     }
//   };
  
//   return (
//     <nav className="bg-white text-gray-800 shadow-md fixed w-full z-50">
//       <div className="max-w-7xl mx-auto px-4">
//       {/* px-4 sm:px-6 lg:px-8 */}
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
//               <span className="text-2xl font-bold ml-2">BidMart</span>
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link to="/" className="hover:text-gray-600">Home</Link>
//             <Link to="/contact" className="hover:text-gray-600">Contact</Link>
//             <Link to="/aboutus" className="hover:text-gray-600">About</Link>
//             <Link to="/faq" className="hover:text-gray-600">FAQs</Link>
//           </div>

//           {/* Actions */}
//           <div className="hidden md:flex items-center space-x-1">
//             <button className="p-2 rounded-full hover:bg-gray-100">
//               <FiSearch className="w-5 h-5" />
//             </button>
//             {/* <button className="p-2 rounded-full hover:bg-gray-100">
//               <FiShoppingCart className="w-5 h-5" />
//             </button> */}
//             {/* Heart Button with Conditional Color */}
//             <Link to="/favouritebids">
//               <button className="p-2 rounded-full hover:bg-gray-100">
//                 <FiHeart 
//                   className={`w-5 h-5 ${isOnFavoritesPage ? 'text-red-500' : 'text-gray-600'}`} 
//                 />
//               </button>
//             </Link>
//             <div className="relative" ref={menuRef}>
//       {isAuthenticated ? (
//         <div
//           className="flex items-center cursor-pointer space-x-2"
//           onClick={() => setOpen(!open)}
//         >
//           {/* <img
//             src={user?.profilePic || '/default-avatar.png'}
//             alt="Profile"
//             className="w-8 h-8 rounded-full object-cover"
//           /> */}
//           <span className="text-sm font-medium">{user || 'User'}</span>
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       ) : (
//         <Link
//           to="/signup"
//           className="p-2 rounded-full bg-red-600 text-white hover:bg-black flex items-center"
//         >
//           <MdOutlinePersonAddAlt className="w-5 h-5" />
//         </Link>
//       )}

//       {open && isAuthenticated && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
//           <Link
//             to={userRole === "seller" ? "/seller-dashboard" : "/buyer-dashboard"}
//             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             onClick={() => setOpen(false)}
//           >
//             Dashboard
//           </Link>
//           {/* <Link
//             to="/chats"
//             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             onClick={() => setOpen(false)}
//           >
//             Chats
//           </Link> */}
//           <button
//             onClick={() => {
//               setOpen(false);
//               logout();
//             }}
//             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
            
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
//             <Link to="/" className="text-black hover:text-gray-600">Home</Link>
//             <Link to="/products" className="text-black hover:text-gray-600">Products</Link>
//             <Link to="/prebuilds" className="text-black hover:text-gray-600">Prebuilds</Link>
//             <Link to="/faqs" className="text-black hover:text-gray-600">FAQs</Link>
//             <Link to="/wishlist" className="text-black hover:text-gray-600">Wishlist</Link>
//             <Link to="/login" className="text-black hover:text-gray-600">Login / Register</Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiHeart } from 'react-icons/fi';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi';
import Logo from '../assets/Logo.png';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const BASEURL = "http://localhost:5000";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
      const decoded = jwtDecode(token);
        const userName = localStorage.getItem("userName") || localStorage.getItem("name") ;
        // const userType = localStorage.getItem("userType");
        const userType = decoded.type;
        console.log(userType,"userType");
        
        setUserRole(userType);
        setUser(userName);
        setIsAuthenticated(true);
      }
      else {
        setUser(""); // Clear the user state
        setUserRole(""); // Clear the user role state
        setIsAuthenticated(false);
      }
    }, [isAuthenticated]);
  
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
  
    // Close the dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
   // Get the current location
   const location = useLocation();
   // Check if the current page is /favouritebids
   const isOnFavoritesPage = location.pathname === '/favouritebids';

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userName = localStorage.getItem("userName") || localStorage.getItem("name");
      const userType = localStorage.getItem("userType");
      setUserRole(userType);
      setUser(userName);
      setIsAuthenticated(true);
    } else {
      setUser("");
      setUserRole("");
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASEURL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Logout successful!');
      ['email', 'name', 'password', 'sellerData', 'token', 'type', 'userEmail', 'userName', 'userType']
        .forEach(key => localStorage.removeItem(key));
      
      setUser("");
      setUserRole("");
      setIsAuthenticated(false);
    } catch (error) {
      toast.error('An error occurred during logout.');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/30 text-[#043E52] font-serif fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold ml-2 text-[#FFAA5D]">BidMart</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-[#FFAA5D] transition-colors">Home</Link>
            <Link to="/contact" className="hover:text-[#FFAA5D] transition-colors">Contact</Link>
            <Link to="/aboutus" className="hover:text-[#FFAA5D] transition-colors">About</Link>
            <Link to="/faq" className="hover:text-[#FFAA5D] transition-colors">FAQs</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100/50">
              <FiSearch className="w-5 h-5 text-[#043E52]" />
            </button>

            <Link to="/favouritebids">
              <button className="p-2 rounded-full hover:bg-gray-100/50">
                <FiHeart className={`w-5 h-5 ${isOnFavoritesPage ? 'text-[#FFAA5D]' : 'text-[#043E52]'}`} />
              </button>
            </Link>

            <div className="relative" ref={menuRef}>
              {isAuthenticated ? (
                <div
                  className="flex items-center cursor-pointer space-x-2 group"
                  onClick={() => setOpen(!open)}
                >
                  <span className="text-sm font-medium group-hover:text-[#FFAA5D]">
                    {user || 'User'}
                  </span>
                  <svg
                    className="w-4 h-4 group-hover:text-[#FFAA5D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ) : (
                <Link
                  to="/signup"
                  className="p-2 rounded-lg bg-[#FFAA5D] hover:bg-[#E16A3D] text-white flex items-center transition-colors"
                >
                  <MdOutlinePersonAddAlt className="w-5 h-5" />
                </Link>
              )}

              {open && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden z-20 border border-gray-200/30">
                  <Link
                    to={userRole === "seller" ? "/seller-dashboard" : "/buyer-dashboard"}
                    className="block px-4 py-2 text-sm hover:bg-gray-100/50"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100/50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:text-[#FFAA5D]"
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg absolute top-16 left-0 w-full border-t border-gray-200/30">
          <div className="flex flex-col items-start px-6 py-4 space-y-4">
            <Link to="/" className="hover:text-[#FFAA5D]" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/contact" className="hover:text-[#FFAA5D]" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link to="/aboutus" className="hover:text-[#FFAA5D]" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/faq" className="hover:text-[#FFAA5D]" onClick={() => setIsMenuOpen(false)}>FAQs</Link>
            <Link to="/favouritebids" className="hover:text-[#FFAA5D]" onClick={() => setIsMenuOpen(false)}>Favorites</Link>
            {isAuthenticated ? (
              <button onClick={logout} className="hover:text-[#FFAA5D]">
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-[#FFAA5D]">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;