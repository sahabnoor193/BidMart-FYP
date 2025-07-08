// import React from 'react';

// const BidProfile = ({ profile = {
//   name: '',
//   years: '',
//   time: '',
//   bids: ''
// }}) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           <tr className="text-left">
//             <th className="p-2 text-gray-700">Profile</th>
//             <th className="p-2 text-gray-700">Years</th>
//             <th className="p-2 text-gray-700">Time</th>
//             <th className="p-2 text-gray-700">Bids</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr className="bg-white hover:bg-gray-50 transition-colors">
//             <td className="p-2 border-t">{profile.name}</td>
//             <td className="p-2 border-t">{profile.years}</td>
//             <td className="p-2 border-t">{profile.time}</td>
//             <td className="p-2 border-t">{profile.bids}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BidProfile;
import React from 'react';
import { motion } from 'framer-motion'; // Importing motion for potential future animations if desired, but not strictly needed for this iteration.

const BidProfile = ({ profile = {
  name: 'N/A', // Default values for better display
  years: 'N/A',
  time: 'N/A',
  bids: 'N/A'
} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 font-sans"
    >
      <h2 className="text-xl font-bold text-[#043E52] mb-4">Seller Profile Overview</h2>

      {/* Using a grid layout instead of a table for better styling and responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col p-2 bg-gray-50 rounded">
          <span className="text-gray-500 font-medium">Seller Name:</span>
          <span className="text-gray-800 font-semibold">{profile.name}</span>
        </div>
        <div className="flex flex-col p-2 bg-gray-50 rounded">
          <span className="text-gray-500 font-medium">Years in Business:</span>
          <span className="text-gray-800 font-semibold">{profile.years}</span>
        </div>
        <div className="flex flex-col p-2 bg-gray-50 rounded">
          <span className="text-gray-500 font-medium">Account Registered:</span>
          <span className="text-gray-800 font-semibold">{profile.time}</span>
        </div>
        <div className="flex flex-col p-2 bg-gray-50 rounded">
          <span className="text-gray-500 font-medium">Total Bids Received:</span>
          <span className="text-gray-800 font-semibold">{profile.bids}</span>
        </div>
      </div>

      {/* Optional: Add a description field if your profile data includes it */}
      {/* If your backend data for profile includes a 'description' field, you can uncomment this */}
      {/* {profile.description && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-2">About the Seller:</h3>
          <p className="text-gray-600 leading-relaxed text-sm">{profile.description}</p>
        </div>
      )} */}
    </motion.div>
  );
};

export default BidProfile;
