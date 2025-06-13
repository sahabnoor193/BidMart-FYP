// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion'; // Import motion for content animation

// // const TabPanel = ({ tabs = [] }) => { // Default to empty array for robustness
// //   const [activeTab, setActiveTab] = useState('');

// //   // Set initial active tab or first tab if default is not provided
// //   useEffect(() => {
// //     if (tabs.length > 0 && !activeTab) {
// //       setActiveTab(tabs[0].id);
// //     }
// //   }, [tabs, activeTab]);

// //   const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

// //   return (
// //     <div className="mt-12 font-sans"> {/* Increased top margin, applied font-sans */}
// //       <div className="flex flex-wrap gap-1 border-b border-gray-200"> {/* Tighter gap, lighter border */}
// //         {tabs.map((tab) => (
// //           <motion.button
// //             key={tab.id}
// //             onClick={() => setActiveTab(tab.id)}
// //             className={`
// //               px-6 py-3 text-base font-semibold transition-all duration-300 ease-in-out whitespace-nowrap
// //               rounded-t-lg
// //               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E16A3D]
// //               ${activeTab === tab.id
// //                 ? 'border-b-4 border-[#016A6D] text-[#016A6D] bg-white shadow-sm' // Primary accent for active tab, subtle shadow
// //                 : 'text-gray-700 hover:text-[#E16A3D] hover:bg-gray-50 border-b-4 border-transparent' // Secondary accent on hover
// //               }
// //             `}
// //             role="tab"
// //             aria-selected={activeTab === tab.id}
// //             aria-controls={`panel-${tab.id}`}
// //             whileTap={{ scale: 0.98 }}
// //           >
// //             {tab.label}
// //           </motion.button>
// //         ))}
// //       </div>
// //       <div className="pt-6 pb-2"> {/* Added vertical padding */}
// //         <AnimatePresence mode="wait">
// //           {activeTabContent && (
// //             <motion.div
// //               key={activeTab} // Key changes to re-trigger animation
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -10 }}
// //               transition={{ duration: 0.3 }}
// //               className="bg-white p-6 rounded-lg shadow-md border border-gray-100" // More prominent panel styling
// //               role="tabpanel"
// //               id={`panel-${activeTab}`}
// //             >
// //               {activeTabContent}
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TabPanel;
// import React, { useState } from 'react';

// const TabPanel = ({ tabs = [
//   {
//     id: 'tab1',
//     label: 'Tab 1',
//     content: <div>Content 1</div>
//   }
// ]}) => {
//   const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

//   return (
//     <div className="mt-8">
//       <div className="flex flex-wrap gap-2 border-b overflow-x-auto">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-4 py-2 font-medium transition-colors duration-200 whitespace-nowrap hover:text-red-600 focus:outline-none focus:text-red-600 ${
//               activeTab === tab.id
//                 ? 'border-b-2 border-red-600 text-red-600'
//                 : 'text-gray-600 hover:text-red-500'
//             }`}
//             role="tab"
//             aria-selected={activeTab === tab.id}
//             aria-controls={`panel-${tab.id}`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>
//       {tabs.map((tab) => (
//         <div
//           key={tab.id}
//           role="tabpanel"
//           id={`panel-${tab.id}`}
//           className={`p-4 bg-gray-50 rounded-lg mt-4 transition-opacity duration-200 ${
//             activeTab === tab.id ? 'block' : 'hidden'
//           }`}
//         >
//           {tab.content}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TabPanel;
import React, { useState } from 'react';

const TabPanel = ({ 
  tabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content 1</div>
    }
  ],
  activeTabStyle = '',
  inactiveTabStyle = '',
  contentStyle = ''
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-1 border-b border-[#016A6D]/20 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap 
              ${activeTab === tab.id 
                ? `border-b-2 border-[#016A6D] text-[#043E52] ${activeTabStyle}`
                : `text-[#016A6D] hover:text-[#E16A3D] ${inactiveTabStyle}`
              }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          className={`p-6 bg-white rounded-b-xl border border-t-0 border-[#016A6D]/20 shadow-sm 
            transition-opacity duration-200 ${contentStyle} ${
            activeTab === tab.id ? 'block' : 'hidden'
          }`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default TabPanel;