// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllUsers, setSelectedUser } from '../features/Dashboard_Slices';
// import { FiUser, FiMail, FiShield, FiEye, FiSlash, FiUnlock } from 'react-icons/fi';

// const Admin_Dashboard_Users = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user_Data, loading, error } = useSelector((state) => state.dashboard);
//   const [blockStatus, setBlockStatus] = useState({});
//   const [isUpdating, setIsUpdating] = useState({}); // Track updating state per user

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   useEffect(() => {
//     if (user_Data?.length > 0) {
//       const statusMap = {};
//       user_Data.forEach(user => {
//         statusMap[user._id] = user.status || 'active'; // Default to 'active' if status is undefined
//       });
//       setBlockStatus(statusMap);
//     }
//   }, [user_Data]);

//   const handleViewUser = (user) => {
//     dispatch(setSelectedUser(user));
//     navigate("/User-Control");
//   };

//   const handleToggleBlock = async (userId) => {
//     // Optimistic UI update
//     const newStatus = blockStatus[userId] === 'active' ? 'blocked' : 'active';
//     setBlockStatus(prev => ({
//       ...prev,
//       [userId]: newStatus
//     }));
//     setIsUpdating(prev => ({ ...prev, [userId]: true }));

//     try {
//       const response = await fetch(`http://localhost:5000/api/user/updateUserStatus/${userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
//         },
//         body: JSON.stringify({ status: newStatus })
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         // Revert if API call fails
//         setBlockStatus(prev => ({
//           ...prev,
//           [userId]: prev[userId] === 'active' ? 'blocked' : 'active'
//         }));
//         alert(result.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       // Revert on error
//       setBlockStatus(prev => ({
//         ...prev,
//         [userId]: prev[userId] === 'active' ? 'blocked' : 'active'
//       }));
//       alert('An error occurred while updating user status.');
//     } finally {
//       setIsUpdating(prev => ({ ...prev, [userId]: false }));
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
//       </div>

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {user_Data?.map((user) => (
//               <tr key={user._id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                       {user.name?.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {user.email}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     user.type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
//                   }`}>
//                     {user.type}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     blockStatus[user._id] === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                   }`}>
//                     {blockStatus[user._id] === 'blocked' ? 'Blocked' : 'Active'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap space-x-2">
//                   <button
//                     onClick={() => handleViewUser(user)}
//                     className="px-3 py-1 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
//                     disabled={isUpdating[user._id]}
//                   >
//                     <FiEye className="inline mr-1" /> View
//                   </button>
//                   <button
//                     onClick={() => handleToggleBlock(user._id)}
//                     className={`px-3 py-1 rounded-md ${
//                       blockStatus[user._id] === 'active'
//                         ? 'border border-red-500 text-red-600 hover:bg-red-50'
//                         : 'border border-green-500 text-green-600 hover:bg-green-50'
//                     }`}
//                     disabled={isUpdating[user._id]}
//                   >
//                     {isUpdating[user._id] ? (
//                       'Updating...'
//                     ) : blockStatus[user._id] === 'active' ? (
//                       <><FiSlash className="inline mr-1" /> Block</>
//                     ) : (
//                       <><FiUnlock className="inline mr-1" /> Unblock</>
//                     )}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Admin_Dashboard_Users;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, setSelectedUser } from '../features/Dashboard_Slices';
import { FiUser, FiMail, FiShield, FiEye, FiSlash, FiUnlock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Admin_Dashboard_Users = () => {
  // ... existing imports and logic remains the same ...

    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user_Data, loading, error } = useSelector((state) => state.dashboard);
  const [blockStatus, setBlockStatus] = useState({});
  const [isUpdating, setIsUpdating] = useState({}); // Track updating state per user

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user_Data?.length > 0) {
      const statusMap = {};
      user_Data.forEach(user => {
        statusMap[user._id] = user.status || 'active'; // Default to 'active' if status is undefined
      });
      setBlockStatus(statusMap);
    }
  }, [user_Data]);

  const handleViewUser = (user) => {
    dispatch(setSelectedUser(user));
    navigate("/User-Control");
  };

  const handleToggleBlock = async (userId) => {
    // Optimistic UI update
    const newStatus = blockStatus[userId] === 'active' ? 'blocked' : 'active';
    setBlockStatus(prev => ({
      ...prev,
      [userId]: newStatus
    }));
    setIsUpdating(prev => ({ ...prev, [userId]: true }));

    try {
      const response = await fetch(`http://localhost:5000/api/user/updateUserStatus/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (!response.ok) {
        // Revert if API call fails
        setBlockStatus(prev => ({
          ...prev,
          [userId]: prev[userId] === 'active' ? 'blocked' : 'active'
        }));
        alert(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      // Revert on error
      setBlockStatus(prev => ({
        ...prev,
        [userId]: prev[userId] === 'active' ? 'blocked' : 'active'
      }));
      alert('An error occurred while updating user status.');
    } finally {
      setIsUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-4 border-[#016A6D] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="max-w-md mx-auto mt-8 p-4 bg-[#E16A3D]/10 text-[#E16A3D] rounded-lg border border-[#E16A3D]/20"
      >
        ⚠️ Error: {error}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#E16A3D] w-2 h-8 rounded-full" />
            <h1 className="text-3xl font-bold text-[#043E52]">User Management</h1>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-[#016A6D]/20"
        >
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#043E52]/5 to-[#016A6D]/5">
              <tr>
                <th className="px-6 py-4 text-left text-[#043E52] font-semibold">User</th>
                <th className="px-6 py-4 text-left text-[#043E52] font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-[#043E52] font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-[#043E52] font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-[#043E52] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#016A6D]/10">
              {user_Data?.map((user) => (
                <motion.tr
                  key={user._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="hover:bg-[#e6f2f5]/20"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#FFAA5D]/10 rounded-full">
                        <FiUser className="text-[#E16A3D] w-5 h-5" />
                      </div>
                      <span className="text-[#043E52] font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#016A6D]">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-[#043E52]/50" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.type === 'admin' 
                        ? 'bg-[#016A6D] text-white' 
                        : 'bg-[#FFAA5D]/20 text-[#E16A3D]'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      blockStatus[user._id] === 'blocked'
                        ? 'bg-[#E16A3D]/20 text-[#E16A3D]'
                        : 'bg-[#016A6D]/20 text-[#016A6D]'
                    }`}>
                      {blockStatus[user._id]}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewUser(user)}
                      className="px-4 py-2 bg-[#016A6D]/10 text-[#016A6D] rounded-lg flex items-center gap-2 hover:bg-[#016A6D]/20"
                    >
                      <FiEye /> View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleBlock(user._id)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        blockStatus[user._id] === 'active'
                          ? 'bg-[#E16A3D]/10 text-[#E16A3D] hover:bg-[#E16A3D]/20'
                          : 'bg-[#016A6D]/10 text-[#016A6D] hover:bg-[#016A6D]/20'
                      }`}
                    >
                      {isUpdating[user._id] ? (
                        <div className="h-4 w-4 border-2 border-current rounded-full animate-spin" />
                      ) : blockStatus[user._id] === 'active' ? (
                        <><FiSlash /> Block</>
                      ) : (
                        <><FiUnlock /> Unblock</>
                      )}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Admin_Dashboard_Users;