import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
// import logo from '../assets/logo.png';
import { useDispatch , useSelector } from 'react-redux';
import { setActive } from '../features/Dashboard_Slices';
import { useNavigate } from 'react-router-dom';




const SideBar = () => {
  // const [active, setActive] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const  active  = useSelector( (state)=>state.dashboard.active)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const menuItems = [
    'Dashboard', 
    'Users',
    'Products',  
    "Testimonials"
    
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuItemClick = (item) => {
    // setActive(item);
    dispatch(setActive(item))
    navigate(`/${item}`)

    if (isMobile) setIsOpen(false); // Close sidebar after selection on mobile
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative flex md:w-1/4 pt-[64px]'>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 rounded-md bg-white shadow-md text-gray-600"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`hidden sm:block
          bg-white shadow-md py-6 h-screen  transition-all duration-300 z-40
          ${isOpen ? 'w-full  ps-5 ' : 'block w-0 overflow-hidden'}
          ${isMobile ? 'top-0 left-0' : ''}
        `}
      >
        {/*<div className="flex items-center mb-8">
          {/* <img src={logo} alt='logo' className='h-8 w-8 object-contain'/> */}
          {/*<h1 className="md:text-2xl sm:text-sm font-bold text-red-500 ml-2">BidMart</h1>
        </div>*/}
        
        <h1 className="text-xl font-bold mb-4 ps-2">Menu</h1>
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleMenuItemClick(item)}
              className={`
                py-2 ps-2 rounded-md cursor-pointer transition-colors duration-200
                ${active === item || active === `/${item}`  ?  "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-200"}
                ${!isOpen ? 'opacity-0' : 'opacity-100'}
              `}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div 
        className={`sm:hidden
          bg-white shadow-md py-6 h-screen  transition-all duration-300 z-40
          ${isOpen ? 'w-full  ps-5 fixed' : 'block w-0 overflow-hidden'}
          ${isMobile ? 'top-0 left-0' : ''}
        `}
      >
        <div className="flex items-center mb-8">
          {/* <img src={logo} alt='logo' className='h-8 w-8 object-contain'/> */}
          <h1 className="md:text-2xl sm:text-sm font-bold text-red-500 ml-2">BidMart</h1>
        </div>
        
        <h1 className="text-xl font-bold mb-4 ps-2">Menu</h1>
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleMenuItemClick(item)}
              className={`
                py-2 ps-2 rounded-md cursor-pointer transition-colors duration-200
                ${active === item ? "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-200"}
                ${!isOpen ? 'opacity-0' : 'opacity-100'}
              `}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SideBar;