// import { motion,AnimatePresence  } from 'framer-motion';
// import { Link, useLocation } from 'react-router-dom';
// import { FiSearch, FiHeart, FiX} from 'react-icons/fi';
// import { MdOutlinePersonAddAlt } from 'react-icons/md';
// import { HiMenu, HiX } from 'react-icons/hi';
// import Logo from '../assets/Logo.png';
// import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';
// import { Dialog } from '@headlessui/react';
// import { useNavigate } from 'react-router-dom';

// const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {

//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [category, setCategory] = useState('');
//   const [locationFilter, setLocationFilter] = useState('');
//   const navigate = useNavigate();

//   const BASEURL = "http://localhost:5000";
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [user, setUser] = useState("");
//   const [userRole, setUserRole] = useState("");

//   // List of major Pakistani cities
//   const pakistaniCities = [
//     'Karachi',
//     'Lahore',
//     'Islamabad',
//     'Faisalabad',
//     'Rawalpindi',
//     'Multan',
//     'Hyderabad',
//     'Peshawar',
//     'Quetta',
//     'Sialkot',
//     'Gujranwala',
//     'Bahawalpur',
//     'Sargodha',
//     'Sukkur',
//     'Larkana',
//     'Sheikhupura',
//     'Rahim Yar Khan',
//     'Jhang',
//     'Mardan',
//     'Gujrat'
//   ];

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       const userName = localStorage.getItem("userName") || localStorage.getItem("name");
//       // const userType = localStorage.getItem("userType");
//       const userType = decoded.type;
//       console.log(userType, "userType");

//       setUserRole(userType);
//       setUser(userName);
//       setIsAuthenticated(true);
//     }
//     else {
//       setUser(""); // Clear the user state
//       setUserRole(""); // Clear the user role state
//       setIsAuthenticated(false);
//     }
//   }, [isAuthenticated]);

//   const [open, setOpen] = useState(false);
//   const menuRef = useRef();

//   // Close the dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
//   // Get the current location
//   const location = useLocation();
//   // Check if the current page is /favouritebids
//   const isOnFavoritesPage = location.pathname === '/favouritebids';

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const userName = localStorage.getItem("userName") || localStorage.getItem("name");
//       const userType = localStorage.getItem("userType");
//       setUserRole(userType);
//       setUser(userName);
//       setIsAuthenticated(true);
//     } else {
//       setUser("");
//       setUserRole("");
//       setIsAuthenticated(false);
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const logout = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(`${BASEURL}/api/auth/logout`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success('Logout successful!');
//       ['email', 'name', 'password', 'sellerData', 'token', 'type', 'userEmail', 'userName', 'userType']
//         .forEach(key => localStorage.removeItem(key));

//       setUser("");
//       setUserRole("");
//       setIsAuthenticated(false);
//     } catch (error) {
//       toast.error('An error occurred during logout.');
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     navigate(`/search?term=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(locationFilter)}`);
//     setSearchOpen(false);
//   };

import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiHeart, FiX } from 'react-icons/fi';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi';
import Logo from '../assets/Logo.png';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const navigate = useNavigate();

  const BASEURL = "http://localhost:5000";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");

  // List of major Pakistani cities
  const pakistaniCities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Faisalabad',
    'Rawalpindi',
    'Multan',
    'Hyderabad',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Bahawalpur',
    'Sargodha',
    'Sukkur',
    'Larkana',
    'Sheikhupura',
    'Rahim Yar Khan',
    'Jhang',
    'Mardan',
    'Gujrat'
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("sessionToken");

    if (token) {
      const decoded = jwtDecode(token);
      const userName = localStorage.getItem("userName") || localStorage.getItem("name");
      const userType = decoded.type;

      setUserRole(userType);
      setUser(userName);
      setIsAuthenticated(true);
    } else {
      setUser("");
      setUserRole("");
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

  // Silent logout function (without API call)
  const handleSilentLogout = () => {
    // Clear all user-related storage
    const keysToRemove = [
      'email',
      'name',
      'password',
      'sellerData',
      'token',
      'type',
      'userEmail',
      'userName',
      'userType',
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    sessionStorage.removeItem('sessionToken');

    setUser("");
    setUserRole("");
    setIsAuthenticated(false);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Only call logout API if token exists
      if (token) {
        await axios.post(`${BASEURL}/api/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Logout successful!');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 401 || error.response?.status === 404) {
        toast.info('Session already expired');
      } else {
        toast.error('An error occurred during logout.');
      }
    } finally {
      // Always perform silent logout to clear storage
      handleSilentLogout();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?term=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(locationFilter)}`);
    setSearchOpen(false);
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
            {/* <button className="p-2 rounded-full hover:bg-gray-100/50">
              <FiSearch className="w-5 h-5 text-[#043E52]" />
            </button> */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-[#009688]/10 group"
              onClick={() => setSearchOpen(true)}
            >
              <FiSearch className="w-5 h-5 text-[#2C3E50] group-hover:text-[#E4BA29]" />
            </motion.button>

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

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" // Darker overlay, subtle blur
          >
            <Dialog
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              className="relative z-50 font-sans" // Apply font-sans to the Dialog
            >
              <motion.div
                initial={{ y: -80, opacity: 0 }} // Start higher for a more pronounced drop-in
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: -80 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }} // Spring transition for smoother feel
                className="
          fixed inset-0
          flex
          items-start
          justify-center
          pt-20 md:pt-32 // Increased top padding for better vertical alignment
          px-4
        "
              >
                <Dialog.Panel className="
            bg-white
            rounded-xl // More rounded corners
            shadow-2xl // Stronger shadow
            p-6 sm:p-8 // Increased padding for better internal spacing
            w-full
            max-w-xl md:max-w-2xl // Slightly wider max-width on larger screens
            border border-gray-100 // Subtle border for definition
          ">
                  <form onSubmit={handleSearchSubmit} className="space-y-6"> {/* Increased space-y */}
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title className="text-2xl font-bold text-[#043E52]"> {/* Larger title, darker primary color */}
                        Search Products
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-700 transition-colors duration-200" // Larger padding, better hover, consistent text color
                        aria-label="Close search dialog"
                      >
                        <FiX className="w-7 h-7" /> {/* Slightly larger icon */}
                      </button>
                    </div>

                    <div className="space-y-4"> {/* Space between input and select elements */}
                      <input
                        type="text"
                        placeholder="Search by product name..."
                        className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016A6D] focus:border-transparent text-gray-800 text-base" // Refined border, focus ring, text size
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive grid for selects */}
                        <select
                          className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016A6D] focus:border-transparent text-gray-700 text-base appearance-none bg-white pr-8" // Standardized styling, custom appearance for arrow
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%234B5563' aria-hidden='true'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                        >
                          <option value="">All Categories</option>
                          <option value="Mobile Phones">Mobile Phones</option>
                          <option value="Laptops">Laptops</option> {/* Corrected value */}
                          <option value="Camera Equipment">Camera Equipment</option> {/* Corrected value */}
                          <option value="Tablets">Tablets</option> {/* Corrected value */}
                          <option value="Home Appliances">Home Appliances</option> {/* Corrected value */}
                        </select>

                        <select
                          className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016A6D] focus:border-transparent text-gray-700 text-base appearance-none bg-white pr-8" // Standardized styling, custom appearance for arrow
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%234B5563' aria-hidden='true'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                        >
                          <option value="">All Locations</option>
                          {pakistaniCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3.5 rounded-lg font-semibold text-lg hover:from-[#E16A3D] hover:to-[#FFAA5D] transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] focus:ring-opacity-75" // Our gradient button style
                        whileHover={{ scale: 1.02 }} // Subtle hover scale
                        whileTap={{ scale: 0.98 }} // Subtle tap scale
                      >
                        Search
                      </motion.button>
                    </div>
                  </form>
                </Dialog.Panel>
              </motion.div>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>


    </nav>
  );
};

export default Navbar;