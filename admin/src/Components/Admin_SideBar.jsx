// import React, { useState, useEffect } from 'react';
// import { FiMenu, FiX } from 'react-icons/fi';
// // import logo from '../assets/logo.png';
// import { useDispatch , useSelector } from 'react-redux';
// import { setActive } from '../features/Dashboard_Slices';
// import { useNavigate } from 'react-router-dom';




// const SideBar = () => {
//   // const [active, setActive] = useState('Dashboard');
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);

//   const  active  = useSelector( (state)=>state.dashboard.active)
//   const dispatch = useDispatch()

//   const navigate = useNavigate()

//   const menuItems = [
//     'Dashboard', 
//     'Users',
//     'Products',  
//     "Testimonials",
//     "Payments"
//   ];

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setIsMobile(true);
//         setIsOpen(false);
//       } else {
//         setIsMobile(false);
//         setIsOpen(true);
//       }
//     };

//     handleResize(); // Set initial state
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleMenuItemClick = (item) => {
//     // setActive(item);
//     dispatch(setActive(item))
//     navigate(`/${item}`)

//     if (isMobile) setIsOpen(false); // Close sidebar after selection on mobile
//   };
//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className='relative flex md:w-1/4 pt-[64px]'>
//       {/* Mobile Hamburger Button */}
//       {isMobile && (
//         <button 
//           onClick={toggleSidebar}
//           className="fixed top-3 left-3 z-50 p-2 rounded-md bg-white shadow-md text-gray-600"
//         >
//           {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//         </button>
//       )}

//       {/* Sidebar */}
//       <div 
//         className={`hidden sm:block
//           bg-white shadow-md py-6 h-screen  transition-all duration-300 z-40
//           ${isOpen ? 'w-full  ps-5 ' : 'block w-0 overflow-hidden'}
//           ${isMobile ? 'top-0 left-0' : ''}
//         `}
//       >
//         {/*<div className="flex items-center mb-8">
//           {/* <img src={logo} alt='logo' className='h-8 w-8 object-contain'/> */}
//           {/*<h1 className="md:text-2xl sm:text-sm font-bold text-red-500 ml-2">BidMart</h1>
//         </div>*/}
        
//         <h1 className="text-xl font-bold mb-4 ps-2">Menu</h1>
//         <ul className="space-y-2">
//           {menuItems.map((item, idx) => (
//             <li
//               key={idx}
//               onClick={() => handleMenuItemClick(item)}
//               className={`
//                 py-2 ps-2 rounded-md cursor-pointer transition-colors duration-200
//                 ${active === item || active === `/${item}`  ?  "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-200"}
//                 ${!isOpen ? 'opacity-0' : 'opacity-100'}
//               `}
//             >
//               {item}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div 
//         className={`sm:hidden
//           bg-white shadow-md py-6 h-screen  transition-all duration-300 z-40
//           ${isOpen ? 'w-full  ps-5 fixed' : 'block w-0 overflow-hidden'}
//           ${isMobile ? 'top-0 left-0' : ''}
//         `}
//       >
//         <div className="flex items-center mb-8">
//           {/* <img src={logo} alt='logo' className='h-8 w-8 object-contain'/> */}
//           <h1 className="md:text-2xl sm:text-sm font-bold text-red-500 ml-2">BidMart</h1>
//         </div>
        
//         <h1 className="text-xl font-bold mb-4 ps-2">Menu</h1>
//         <ul className="space-y-2">
//           {menuItems.map((item, idx) => (
//             <li
//               key={idx}
//               onClick={() => handleMenuItemClick(item)}
//               className={`
//                 py-2 ps-2 rounded-md cursor-pointer transition-colors duration-200
//                 ${active === item ? "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-200"}
//                 ${!isOpen ? 'opacity-0' : 'opacity-100'}
//               `}
//             >
//               {item}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Overlay for mobile when sidebar is open */}
//       {isMobile && isOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default SideBar;


import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHome, FiUsers, FiPackage, FiMessageSquare, FiCreditCard } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setActive } from '../features/Dashboard_Slices';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SideBar = () => {
  const active = useSelector((state) => state.dashboard.active);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome /> },
    { name: 'Users', icon: <FiUsers /> },
    { name: 'Products', icon: <FiPackage /> },
    { name: 'Testimonials', icon: <FiMessageSquare /> },
    { name: 'Payments', icon: <FiCreditCard /> }
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

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuItemClick = (item) => {
    dispatch(setActive(item));
    navigate(`/${item.toLowerCase()}`);
    if (isMobile) setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarVariants = {
    open: { width: '280px', opacity: 1 },
    closed: { width: '0px', opacity: 0 }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <div className="relative">
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#016A6D] text-white shadow-lg"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </motion.button>
      )}

      {/* Sidebar */}
      <motion.div
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed md:relative h-screen bg-gradient-to-b from-[#e6f2f5] to-white shadow-xl z-40 overflow-hidden ${
          isMobile ? 'top-0 left-0' : ''
        }`}
      >
        <div className="p-6">
          {/* Logo/Branding */}
          <div className="flex items-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] flex items-center justify-center text-white font-bold"
            >
              BM
            </motion.div>
            <motion.h1 
              className="text-xl font-bold text-[#043E52] ml-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              BidMart
            </motion.h1>
          </div>

          {/* Menu Title */}
          <motion.h2 
            className="text-lg font-semibold text-[#043E52]/80 mb-6 pl-2"
            variants={itemVariants}
          >
            Navigation
          </motion.h2>

          {/* Menu Items */}
          <ul className="space-y-3">
            {menuItems.map((item, idx) => (
              <motion.li
                key={idx}
                variants={itemVariants}
                onClick={() => handleMenuItemClick(item.name)}
                className={`
                  flex items-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-300
                  ${active === item.name ? 
                    "bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white shadow-md" : 
                    "text-[#043E52] hover:bg-[#016A6D]/10 hover:text-[#016A6D]"
                  }
                `}
                whileHover={{ scale: 1.02 }}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Decorative Border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SideBar;