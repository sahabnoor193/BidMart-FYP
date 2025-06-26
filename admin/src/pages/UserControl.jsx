// // import { useState, useEffect } from 'react';
// // import {
// //   FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiEdit2,
// //   FiSlash, FiUnlock, FiSettings, FiTrash2
// // } from 'react-icons/fi';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchAllUsers } from '../features/Dashboard_Slices';

// // const UserControl = () => {
// //   const dispatch = useDispatch();
// //   const allUsers = useSelector((state) => state.dashboard.user_Data); // ✅ Corrected
// //   const user_Email = useSelector((state) => state.dashboard.user_Email);

// //   const [isBlocked, setIsBlocked] = useState(false);
// //   const [showBlockModal, setShowBlockModal] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [userData, setUserData] = useState(null);

// //   useEffect(() => {
// //     dispatch(fetchAllUsers());
// //   }, [dispatch]);

// //   useEffect(() => {
// //     const matchedUser = allUsers?.find((user) => user.email === user_Email);
// //     if (matchedUser) {
// //       setUserData({ ...matchedUser });
// //       setIsBlocked(matchedUser.status === 'blocked'); // Set block state based on user status
// //     }
// //   }, [allUsers, user_Email]);


// //   const updateUserStatus = async (newStatus) => {
// //     if (!userData?._id) return; 
// //     console.log("Sending status:", newStatus); 

// //     try {
// //       const response = await fetch(`http://localhost:5000/api/user/updateUserStatus/${userData._id}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ status: newStatus }),
// //       });

// //       const result = await response.json();

// //       if (response.ok) {
// //         setIsBlocked(newStatus === 'blocked');
// //         setUserData(result.user); // update local state
// //         alert(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
// //       } else {
// //         alert(result.message || 'Failed to update status');
// //       }
// //     } catch (error) {
// //       console.error('Error updating user status:', error);
// //       alert('An error occurred while updating user status.');
// //     }
// //   };

// //   const handleBlockUser = () => {dle
// //     updateUserStatus('blocked');
// //     setShowBlockModal(false);
// //   };

// //   const handleUnblockUser = () => {
// //     updateUserStatus('active');
// //   };

// //   const handleDeleteUser = async () => {
// //     if (!userData?._id) return;

// //     try {
// //       const response = await fetch(`http://localhost:5000/api/use/deleteUser/${userData._id}`, {
// //         method: 'DELETE',
// //       });

// //       const result = await response.json();

// //       if (response.ok) {
// //         alert('User deleted successfully');
// //         // Optional: Redirect or refresh user list
// //       } else {
// //         alert(result.message || 'Failed to delete user');
// //       }
// //     } catch (error) {
// //       console.error('Error deleting user:', error);
// //       alert('An error occurred while deleting the user.');
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setUserData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleEditToggle = () => {
// //     // Add save logic here if needed
// //     setIsEditing((prev) => !prev);
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return '';
// //     const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
// //     return new Date(dateString).toLocaleDateString(undefined, options);
// //   };

// //   const getInitials = (email) => {
// //     if (!email) return "U";
// //     const [namePart] = email.split("@");
// //     return namePart.split(".").map((s) => s[0]?.toUpperCase()).join("") || namePart[0]?.toUpperCase();
// //   };

// //   if (!userData) {
// //     return <div className="pt-[100px] text-center text-gray-600">Loading user data...</div>;
// //   }

// //   return (
// //     <div className="min-h-screen bg-white w-full py-8 px-4 sm:px-6 lg:px-8 pt-[70px]">
// //       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
// //         <div className="bg-red-500 p-6 relative">
// //           <div className="absolute -bottom-12 left-6">
// //             <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-red-500 text-3xl font-bold shadow-lg">
// //               {getInitials(user_Email)}
// //             </div>
// //           </div>
// //           <div className="flex justify-between items-start pb-6">
// //             <h1 className="text-xl font-bold text-white text-center">User Details</h1>
// //             <span className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${isBlocked ? 'bg-white text-red-500' : 'bg-white text-green-600'}`}>
// //               {isBlocked ? 'BLOCKED' : 'ACTIVE'}
// //             </span>
// //           </div>
// //         </div>

// //         <div className="pt-16 px-6 pb-6">
// //           <div className="flex justify-between items-start mb-8">
// //             <div>
// //               {isEditing ? (
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={userData.name}
// //                   onChange={handleInputChange}
// //                   className="text-2xl font-bold bg-gray-50 text-gray-800 border-b-2 border-red-500 focus:outline-none px-2 py-1"
// //                 />
// //               ) : (
// //                 <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
// //               )}
// //               <div className="flex items-center mt-2">
// //                 <FiUser className="text-red-500 mr-2" size={14} />
// //                 {isEditing ? (
// //                   <input
// //                     type="text"
// //                     name="role"
// //                     value={userData.role}
// //                     onChange={handleInputChange}
// //                     className="text-gray-600 bg-gray-50 border-b-2 border-red-500 focus:outline-none px-2 py-1"
// //                   />
// //                 ) : (
// //                   <span className="text-gray-600">{userData.role}</span>
// //                 )}
// //               </div>
// //             </div>

// //             <div className="flex gap-3">
// //               <button onClick={handleEditToggle} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
// //                 <FiEdit2 size={16} />
// //                 {isEditing ? 'Save' : 'Edit'}
// //               </button>
// //               <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
// //                 <FiSettings size={16} />
// //                 Settings
// //               </button>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
// //             <InfoField icon={<FiMail className="text-red-500 mr-3" size={18} />} label="Email" value={userData.email} name="email" isEditing={isEditing} handleChange={handleInputChange} />
// //             <InfoField icon={<FiPhone className="text-red-500 mr-3" size={18} />} label="Phone" value={userData.phone || ''} name="phone" isEditing={isEditing} handleChange={handleInputChange} />
// //             <StaticField icon={<FiCalendar className="text-red-500 mr-3" size={18} />} label="Joined" value={formatDate(userData.createdAt)} />
// //             <StaticField icon={<FiMapPin className="text-red-500 mr-3" size={18} />} label="Location" value={userData.location || 'Not specified'} />
// //           </div>

// //           <div className="bg-gray-50 p-5 rounded-lg mb-8 border-l-4 border-red-500">
// //             <div className="flex items-center mb-3">
// //               <FiMapPin className="text-red-500 mr-3" size={18} />
// //               <span className="text-gray-500 font-medium">Full Address</span>
// //             </div>
// //             {isEditing ? (
// //               <textarea
// //                 name="address"
// //                 value={userData.address || ''}
// //                 onChange={handleInputChange}
// //                 className="w-full bg-white text-gray-800 p-3 rounded border border-gray-300 h-24 focus:outline-none focus:ring-1 focus:ring-red-500"
// //               />
// //             ) : (
// //               <p className="text-gray-800">{userData.address || 'Not provided'}</p>
// //             )}
// //           </div>

// //           <div className="flex flex-col sm:flex-row gap-4">
// //             <button
// //               onClick={() => (isBlocked ? handleUnblockUser() : setShowBlockModal(true))}
// //               className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
// //                 isBlocked ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
// //               }`}
// //             >
// //               {isBlocked ? (
// //                 <>
// //                   <FiUnlock size={18} />
// //                   Unblock User
// //                 </>
// //               ) : (
// //                 <>
// //                   <FiSlash size={18} />
// //                   Block User
// //                 </>
// //               )}
// //             </button>
// //             <button className="flex-1 flex items-center justify-center cursor-pointer gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
// //               <FiTrash2 size={18} onClick={handleDeleteUser} />
// //               Delete Account
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {showBlockModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-xl p-6 max-w-md w-full border border-gray-200 shadow-xl">
// //             <div className="text-center mb-4">
// //               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
// //                 <FiSlash className="h-8 w-8 text-red-500" />
// //               </div>
// //               <h3 className="text-xl font-bold text-gray-800">Confirm User Block</h3>
// //               <p className="text-gray-600 mt-2">Are you sure you want to block this user?</p>
// //             </div>
// //             <div className="flex justify-center gap-4">
// //               <button onClick={handleBlockUser} className="bg-red-500 text-white py-2 px-6 rounded-lg">Yes, Block</button>
// //               <button onClick={() => setShowBlockModal(false)} className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg">Cancel</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // Utility component for info fields
// // const InfoField = ({ icon, label, value, name, isEditing, handleChange }) => (
// //   <div className="flex items-center">
// //     {icon}
// //     {isEditing ? (
// //       <input
// //         type="text"
// //         name={name}
// //         value={value}
// //         onChange={handleChange}
// //         className="text-gray-600 border-b-2 border-red-500 focus:outline-none px-2 py-1"
// //       />
// //     ) : (
// //       <div className="flex flex-col">
// //         <p className="text-gray-600">{label}</p>
// //         <span className="text-gray-800">{value || 'Not provided'}</span>
// //       </div>
// //     )}
// //   </div>
// // );

// // // Utility component for static fields (non-editable)
// // const StaticField = ({ icon, label, value }) => (
// //   <div className="flex items-center">
// //     {icon}
// //     <div className="flex flex-col">
// //       <p className="text-gray-600">{label}</p>
// //       <span className="text-gray-800">{value}</span>
// //     </div>
// //   </div>
// // );

// // export default UserControl;



// import React, { useState, useEffect } from 'react';
// import { 
//   FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiEdit2,
//   FiSlash, FiUnlock, FiSettings, FiTrash2 
// } from 'react-icons/fi';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion } from 'framer-motion';
// import { fetchAllUsers } from '../features/Dashboard_Slices';

// const UserControl = () => {
//   const dispatch = useDispatch();
//   const allUsers = useSelector((state) => state.dashboard.user_Data);
//   const user_Email = useSelector((state) => state.dashboard.user_Email);

//   const [isBlocked, setIsBlocked] = useState(false);
//   const [showBlockModal, setShowBlockModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState(null);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.2, when: "beforeChildren" }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   useEffect(() => {
//     const matchedUser = allUsers?.find((user) => user.email === user_Email);
//     if (matchedUser) {
//       setUserData({ ...matchedUser });
//       setIsBlocked(matchedUser.status === 'blocked');
//     }
//   }, [allUsers, user_Email]);

//   const updateUserStatus = async (newStatus) => {
//     if (!userData?._id) return; 

//     try {
//       const response = await fetch(`http://localhost:5000/api/user/updateUserStatus/${userData._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setIsBlocked(newStatus === 'blocked');
//         setUserData(result.user);
//         alert(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
//       } else {
//         alert(result.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       alert('An error occurred while updating user status.');
//     }
//   };

//   const handleBlockUser = () => {
//     updateUserStatus('blocked');
//     setShowBlockModal(false);
//   };

//   const handleUnblockUser = () => {
//     updateUserStatus('active');
//   };

//   const handleDeleteUser = async () => {
//     if (!userData?._id) return;

//     try {
//       const response = await fetch(`https://bidmart-backend.onrender.com/api/user/deleteUser/${userData._id}`, {
//         method: 'DELETE',
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert('User deleted successfully');
//       } else {
//         alert(result.message || 'Failed to delete user');
//       }
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       alert('An error occurred while deleting the user.');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditToggle = () => {
//     setIsEditing((prev) => !prev);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const getInitials = (email) => {
//     if (!email) return "U";
//     const [namePart] = email.split("@");
//     return namePart.split(".").map((s) => s[0]?.toUpperCase()).join("") || namePart[0]?.toUpperCase();
//   };

//   if (!userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-16 flex items-center justify-center">
//         <div className="text-center text-[#043E52]">
//           Loading user data...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-16 w-full"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Decorative top border */}
//         <motion.div 
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.8 }}
//           className="w-full h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-16"
//         />

//         <motion.div 
//           variants={itemVariants}
//           className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#016A6D]/20"
//         >
//           {/* Header with gradient background */}
//           <div className="bg-gradient-to-r from-[#E16A3D] to-[#FFAA5D] p-6 relative">
//             <div className="absolute -bottom-12 left-6">
//               <motion.div 
//                 whileHover={{ scale: 1.05 }}
//                 className="h-24 w-24 rounded-full border-4 border-white bg-white flex items-center justify-center text-[#016A6D] text-3xl font-bold shadow-lg"
//               >
//                 {getInitials(user_Email)}
//               </motion.div>
//             </div>
//             <div className="flex justify-between items-start pb-6">
//               <h1 className="text-2xl font-bold text-white">User Details</h1>
//               <motion.span 
//                 whileHover={{ scale: 1.05 }}
//                 className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${isBlocked ? 'bg-white text-red-600' : 'bg-white text-green-600'}`}
//               >
//                 {isBlocked ? 'BLOCKED' : 'ACTIVE'}
//               </motion.span>
//             </div>
//           </div>

//           <div className="pt-16 px-6 pb-8">
//             <div className="flex flex-col md:flex-row justify-between items-start mb-8">
//               <div>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="name"
//                     value={userData.name}
//                     onChange={handleInputChange}
//                     className="text-2xl font-bold bg-gray-50 text-[#043E52] border-b-2 border-[#FFAA5D] focus:outline-none px-2 py-1"
//                   />
//                 ) : (
//                   <h2 className="text-2xl font-bold text-[#043E52]">{userData.name}</h2>
//                 )}
//                 <div className="flex items-center mt-2">
//                   <FiUser className="text-[#E16A3D] mr-2" size={14} />
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="role"
//                       value={userData.role}
//                       onChange={handleInputChange}
//                       className="text-[#016A6D] bg-gray-50 border-b-2 border-[#FFAA5D] focus:outline-none px-2 py-1"
//                     />
//                   ) : (
//                     <span className="text-[#016A6D]">{userData.role}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-4 md:mt-0">
//                 <motion.button 
//                   whileHover={{ scale: 1.05 }}
//                   onClick={handleEditToggle} 
//                   className="flex items-center gap-2 px-4 py-2 bg-[#016A6D]/10 hover:bg-[#016A6D]/20 rounded-lg text-[#016A6D] transition-colors"
//                 >
//                   <FiEdit2 size={16} />
//                   {isEditing ? 'Save' : 'Edit'}
//                 </motion.button>
//                 <motion.button 
//                   whileHover={{ scale: 1.05 }}
//                   className="flex items-center gap-2 px-4 py-2 bg-[#016A6D]/10 hover:bg-[#016A6D]/20 rounded-lg text-[#016A6D] transition-colors"
//                 >
//                   <FiSettings size={16} />
//                   Settings
//                 </motion.button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <InfoField 
//                 icon={<FiMail className="text-[#E16A3D] mr-3" size={18} />} 
//                 label="Email" 
//                 value={userData.email} 
//                 name="email" 
//                 isEditing={isEditing} 
//                 handleChange={handleInputChange} 
//               />
//               <InfoField 
//                 icon={<FiPhone className="text-[#E16A3D] mr-3" size={18} />} 
//                 label="Phone" 
//                 value={userData.phone || ''} 
//                 name="phone" 
//                 isEditing={isEditing} 
//                 handleChange={handleInputChange} 
//               />
//               <StaticField 
//                 icon={<FiCalendar className="text-[#E16A3D] mr-3" size={18} />} 
//                 label="Joined" 
//                 value={formatDate(userData.createdAt)} 
//               />
//               <StaticField 
//                 icon={<FiMapPin className="text-[#E16A3D] mr-3" size={18} />} 
//                 label="Location" 
//                 value={userData.location || 'Not specified'} 
//               />
//             </div>

//             <div className="bg-[#e6f2f5] p-5 rounded-lg mb-8 border-l-4 border-[#016A6D]">
//               <div className="flex items-center mb-3">
//                 <FiMapPin className="text-[#016A6D] mr-3" size={18} />
//                 <span className="text-[#016A6D] font-medium">Full Address</span>
//               </div>
//               {isEditing ? (
//                 <textarea
//                   name="address"
//                   value={userData.address || ''}
//                   onChange={handleInputChange}
//                   className="w-full bg-white text-[#043E52] p-3 rounded border border-[#016A6D]/30 h-24 focus:outline-none focus:ring-1 focus:ring-[#016A6D]"
//                 />
//               ) : (
//                 <p className="text-[#043E52]">{userData.address || 'Not provided'}</p>
//               )}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 onClick={() => (isBlocked ? handleUnblockUser() : setShowBlockModal(true))}
//                 className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
//                   isBlocked 
//                     ? 'bg-gradient-to-r from-green-500 to-[#016A6D] text-white' 
//                     : 'bg-gradient-to-r from-[#E16A3D] to-[#FFAA5D] text-white'
//                 }`}
//               >
//                 {isBlocked ? (
//                   <>
//                     <FiUnlock size={18} />
//                     Unblock User
//                   </>
//                 ) : (
//                   <>
//                     <FiSlash size={18} />
//                     Block User
//                   </>
//                 )}
//               </motion.button>
//               <motion.button 
//                 whileHover={{ scale: 1.05 }}
//                 onClick={handleDeleteUser}
//                 className="flex-1 flex items-center justify-center cursor-pointer gap-3 px-6 py-3 bg-[#016A6D]/10 hover:bg-[#016A6D]/20 text-[#016A6D] rounded-lg font-medium transition-colors"
//               >
//                 <FiTrash2 size={18} />
//                 Delete Account
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {showBlockModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <motion.div 
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#016A6D]/30 shadow-xl"
//           >
//             <div className="text-center mb-4">
//               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
//                 <FiSlash className="h-8 w-8 text-[#E16A3D]" />
//               </div>
//               <h3 className="text-xl font-bold text-[#043E52]">Confirm User Block</h3>
//               <p className="text-[#016A6D] mt-2">Are you sure you want to block this user?</p>
//             </div>
//             <div className="flex justify-center gap-4">
//               <motion.button 
//                 whileHover={{ scale: 1.05 }}
//                 onClick={handleBlockUser} 
//                 className="bg-gradient-to-r from-[#E16A3D] to-[#FFAA5D] text-white py-2 px-6 rounded-lg"
//               >
//                 Yes, Block
//               </motion.button>
//               <motion.button 
//                 whileHover={{ scale: 1.05 }}
//                 onClick={() => setShowBlockModal(false)} 
//                 className="bg-[#016A6D]/10 text-[#016A6D] py-2 px-6 rounded-lg"
//               >
//                 Cancel
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// // Utility component for info fields
// const InfoField = ({ icon, label, value, name, isEditing, handleChange }) => (
//   <div className="flex items-center">
//     {icon}
//     {isEditing ? (
//       <div className="flex flex-col w-full">
//         <p className="text-[#016A6D]">{label}</p>
//         <input
//           type="text"
//           name={name}
//           value={value}
//           onChange={handleChange}
//           className="text-[#043E52] border-b-2 border-[#FFAA5D] focus:outline-none px-2 py-1"
//         />
//       </div>
//     ) : (
//       <div className="flex flex-col">
//         <p className="text-[#016A6D]">{label}</p>
//         <span className="text-[#043E52]">{value || 'Not provided'}</span>
//       </div>
//     )}
//   </div>
// );

// // Utility component for static fields (non-editable)
// const StaticField = ({ icon, label, value }) => (
//   <div className="flex items-center">
//     {icon}
//     <div className="flex flex-col">
//       <p className="text-[#016A6D]">{label}</p>
//       <span className="text-[#043E52]">{value}</span>
//     </div>
//   </div>
// );

// export default UserControl;


import React, { useState, useEffect } from 'react';
import { 
  FiMail, FiPhone, FiMapPin, FiCalendar, FiUser,
  FiSlash, FiUnlock, FiSettings, FiTrash2 
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAllUsers } from '../features/Dashboard_Slices';

const UserControl = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.dashboard.user_Data);
  const user_Email = useSelector((state) => state.dashboard.user_Email);

  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userData, setUserData] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    const matchedUser = allUsers?.find((user) => user.email === user_Email);
    if (matchedUser) {
      setUserData({ ...matchedUser });
      setIsBlocked(matchedUser.status === 'blocked');
    }
  }, [allUsers, user_Email]);

  const updateUserStatus = async (newStatus) => {
    if (!userData?._id) return; 

    try {
      const response = await fetch(`http://localhost:5000/api/user/updateUserStatus/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsBlocked(newStatus === 'blocked');
        setUserData(result.user);
        alert(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
      } else {
        alert(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('An error occurred while updating user status.');
    }
  };

  const handleBlockUser = () => {
    updateUserStatus('blocked');
    setShowBlockModal(false);
  };

  const handleUnblockUser = () => {
    updateUserStatus('active');
  };

  const handleDeleteUser = async () => {
    if (!userData?._id) return;

    try {
      const response = await fetch(`https://bidmart-backend.onrender.com/api/user/deleteUser/${userData._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert('User deleted successfully');
      } else {
        alert(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (email) => {
    if (!email) return "U";
    const [namePart] = email.split("@");
    return namePart.split(".").map((s) => s[0]?.toUpperCase()).join("") || namePart[0]?.toUpperCase();
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-16 flex items-center justify-center">
        <div className="text-center text-[#043E52]">
          Loading user data...
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-16 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative top border */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-16"
        />

        <motion.div 
          variants={itemVariants}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#016A6D]/20"
        >
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-[#E16A3D] to-[#FFAA5D] p-6 relative">
            <div className="absolute -bottom-12 left-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-24 w-24 rounded-full border-4 border-white bg-white flex items-center justify-center text-[#016A6D] text-3xl font-bold shadow-lg"
              >
                {getInitials(user_Email)}
              </motion.div>
            </div>
            <div className="flex justify-between items-start pb-6">
              <h1 className="text-2xl font-bold text-white">User Details</h1>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${isBlocked ? 'bg-white text-red-600' : 'bg-white text-green-600'}`}
              >
                {isBlocked ? 'BLOCKED' : 'ACTIVE'}
              </motion.span>
            </div>
          </div>

          <div className="pt-16 px-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div>
                {/* Always static display for name & role */}
                <h2 className="text-2xl font-bold text-[#043E52]">{userData.name}</h2>
                <div className="flex items-center mt-2">
                  <FiUser className="text-[#E16A3D] mr-2" size={14} />
                  <span className="text-[#016A6D]">{userData.role}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                {/* Removed Edit button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#016A6D]/10 hover:bg-[#016A6D]/20 rounded-lg text-[#016A6D] transition-colors"
                >
                  <FiSettings size={16} />
                  Settings
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Static fields only */}
              <StaticField 
                icon={<FiMail className="text-[#E16A3D] mr-3" size={18} />} 
                label="Email" 
                value={userData.email} 
              />
              <StaticField 
                icon={<FiPhone className="text-[#E16A3D] mr-3" size={18} />} 
                label="Phone" 
                value={userData.phone || 'Not provided'} 
              />
              <StaticField 
                icon={<FiCalendar className="text-[#E16A3D] mr-3" size={18} />} 
                label="Joined" 
                value={formatDate(userData.createdAt)} 
              />
              <StaticField 
                icon={<FiMapPin className="text-[#E16A3D] mr-3" size={18} />} 
                label="Location" 
                value={userData.location || 'Not specified'} 
              />
            </div>

            <div className="bg-[#e6f2f5] p-5 rounded-lg mb-8 border-l-4 border-[#016A6D]">
              <div className="flex items-center mb-3">
                <FiMapPin className="text-[#016A6D] mr-3" size={18} />
                <span className="text-[#016A6D] font-medium">Full Address</span>
              </div>
              <p className="text-[#043E52]">{userData.address || 'Not provided'}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => (isBlocked ? handleUnblockUser() : setShowBlockModal(true))}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  isBlocked 
                    ? 'bg-gradient-to-r from-green-500 to-[#016A6D] text-white' 
                    : 'bg-gradient-to-r from-[#E16A3D] to-[#FFAA5D] text-white'
                }`}
              >
                {isBlocked ? (
                  <>
                    <FiUnlock size={18} />
                    Unblock User
                  </>
                ) : (
                  <>
                    <FiSlash size={18} />
                    Block User
                  </>
                )}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={handleDeleteUser}
                className="flex-1 flex items-center justify-center cursor-pointer gap-3 px-6 py-3 bg-[#016A6D]/10 hover:bg-[#016A6D]/20 text-[#016A6D] rounded-lg font-medium transition-colors"
              >
                <FiTrash2 size={18} />
                Delete Account
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#016A6D]/30 shadow-xl"
          >
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <FiSlash className="h-8 w-8 text-[#E16A3D]" />
              </div>
              <h3 className="text-xl font-bold text-[#043E52]">Confirm User Block</h3>
              <p className="text-[#016A6D] mt-2">Are you sure you want to block this user?</p>
            </div>
            <div className="flex justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={handleBlockUser} 
                className="bg-gradient-to-r from-[#E16A3D] to-[#FFAA5D] text-white py-2 px-6 rounded-lg"
              >
                Yes, Block
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowBlockModal(false)} 
                className="bg-[#016A6D]/10 text-[#016A6D] py-2 px-6 rounded-lg"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// Utility component for static fields (non-editable)
const StaticField = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon}
    <div className="flex flex-col">
      <p className="text-[#016A6D]">{label}</p>
      <span className="text-[#043E52]">{value}</span>
    </div>
  </div>
);

export default UserControl;
