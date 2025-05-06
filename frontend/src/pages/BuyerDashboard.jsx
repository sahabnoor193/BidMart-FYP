// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaList, FaCheckCircle, FaStar, FaExchangeAlt } from 'react-icons/fa';
// import { jwtDecode } from 'jwt-decode';
// const BuyerDashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [userType, setUserType] = useState('buyer');
//   const [buyerData, setBuyerData] = useState({
//     requestedBids: 0,
//     acceptedBids: 0,
//     favourites: 0,
//     bidHistory: []
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   const [userProfile, setUserProfile] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     address: '',
//     phone: '',
//     city: ''
//   });
  
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmNewPassword: ''
//   });
  
//   const navigate = useNavigate();

//   const handleLogout = useCallback(() => {
//     console.log('[Logout] Clearing local storage and redirecting');
//     localStorage.removeItem('token');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userName');
//     navigate('/signin');
//   }, [navigate]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     console.log('[Auth Check] Checking authentication status');
//     if (!token) {
//       console.warn('[Auth Redirect] No token found, redirecting to login');
//       navigate('/login');
//       return;
//     }
//         // Check token expiration client-side
//         try {
//           const decoded = jwtDecode(token);
//           const currentTime = Date.now() / 1000;
//           if (decoded.exp < currentTime) {
//             console.warn('[Auth Check] Token expired');
//             handleLogout();
//             return;
//           }
//         } catch (error) {
//           console.error('[Auth Check] Invalid token:', error);
//           handleLogout();
//           return;
//         }

//     const fetchUserData = async () => {
//       console.log('[API Call] Starting data fetching process');
//       try {
//         console.log('[Dashboard Data] Fetching buyer dashboard data from /api/buyer/dashboard');
//         const dashboardResponse = await axios.get("http://localhost:5000/api/buyer/dashboard", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('Buyer dashboard data fetched:', dashboardResponse.data);
//         setBuyerData(dashboardResponse.data);

//         console.log('[Profile Data] Fetching user profile from /api/user/profile');
//         const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('User profile data fetched:', profileResponse.data);
        
//         const profile = profileResponse.data;
//         setUserProfile({
//           firstName: profile.name?.split(' ')[0] || '',
//           lastName: profile.name?.split(' ')[1] || '',
//           email: profile.email || '',
//           address: profile.address || '',
//           phone: profile.phone || '',
//           city: profile.city || ''
//         });

//         console.log('[User Profile] Updated local state with profile data');
//         setLoading(false);
//       } catch (err) {
//         console.error('[Fetch Error] Error fetching data:', err.response?.data || err.message);
//         setError('Failed to load data. Please try again later.');
//         // Add this check for 401 status
//         if (err.response && err.response.status === 401) {
//           localStorage.removeItem('token');
//           handleLogout(); // Trigger logout on token issues
//         }
//       }
//     };
    
//     fetchUserData();
//   }, [navigate, handleLogout]);

//   const handleSwitchUserType = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const userEmail = localStorage.getItem('userEmail');
//       const currentType = localStorage.getItem('userType');
//       const newType = currentType === 'buyer' ? 'seller' : 'buyer';
  
//       // Check if opposite account exists
//       const response = await axios.put(
//         "http://localhost:5000/api/user/switch-account",
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       if (response.data.exists) {
//         // Switch to existing account
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('userType', response.data.userType);
//         window.location.href = `/${response.data.userType}-dashboard`;
//       } else {
//         // Ask user if they want to create a new account
//         const createNewAccount = window.confirm(`No ${newType} account found. Do you want to create a new ${newType} account?`);
//         if (createNewAccount) {
//           // Fetch current user profile
//           const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
//             headers: { Authorization: `Bearer ${token}` }
//           });
  
//           const profile = profileResponse.data;
  
//           // Create new account with opposite type
//           const registrationResponse = await axios.post("http://localhost:5000/api/user/switch-register", {
//             name: profile.name,
//             email: profile.email,
//             password: 'defaultPassword123', // You might want to handle password securely
//             type: newType
//           });
  
//           if (registrationResponse.data.message) {
//             alert('Account created successfully. Please check your email for verification.');
  
//             // Store account information in local storage
//             localStorage.setItem('email', profile.email);
//             localStorage.setItem('name', profile.name);
//             localStorage.setItem('password', 'defaultPassword123');
//             localStorage.setItem('type', newType);
  
//             // Log out the current user
//             localStorage.removeItem('token');
//             localStorage.removeItem('userEmail');
//             localStorage.removeItem('userType');
//             localStorage.removeItem('userName');
  
//             // Redirect to verification page with isSwitchVerification flag
//             navigate('/otp-verification', { state: { isSwitchVerification: true } });
//           } else {
//             alert('Failed to create account. Please try again.');
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Switch error:', err);
//       alert(err.response?.data?.message || 'Account switch failed');
//     }
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     console.log('[Profile Update] Initiating profile update');
//     try {
//       const token = localStorage.getItem('token');
//       const profileData = {
//         name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
//         address: userProfile.address,
//         phone: userProfile.phone,
//         city: userProfile.city
//       };
//       console.log('[Profile Update] Sending data:', profileData);
//       await axios.put("http://localhost:5000/api/user/profile", profileData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       alert('Profile updated successfully');
//     } catch (err) {
//       console.error('[Profile Error] Update failed:', err.response?.data || err.message);
//       alert('Failed to update profile. Please try again.');
//       if (err.response && err.response.status === 401) {
//         handleLogout(); // Trigger logout on token issues
//       }
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     console.log('[Password Change] Initiating password change');

//     if (passwordData.newPassword !== passwordData.confirmNewPassword) {
//       console.warn('[Password Mismatch] New passwords do not match');
//       alert('New password and confirm new password do not match');
//       return;
//     }
//     if (passwordData.newPassword === passwordData.currentPassword) {
//       alert('New password should not match the current password');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       const passwordDataToSend = {
//         oldPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword
//       };
//       console.log('[Password Change] Sending password change request');
      
//       console.log('Changing password with data:', passwordDataToSend);
//       const response = await axios.put("http://localhost:5000/api/user/password", passwordDataToSend, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.data.error) {
//         console.warn('[Password Error]', response.data.error);
//         alert(response.data.error);
//       } else {
//         console.log('[Password Change] Successfully updated password');
//         alert('Password updated successfully');
//         setPasswordData({
//           currentPassword: '',
//           newPassword: '',
//           confirmNewPassword: ''
//         });
//       }
//     } catch (err) {
//       console.error('[Password Error] Change failed:', err.response?.data || err.message);
//       console.error('Error changing password:', err);
//       alert('Failed to change password. Please try again.');
//       if (err.response && err.response.status === 401) {
//         handleLogout(); // Trigger logout on token issues
//       }
//     }
//   };

//   const renderDashboardContent = () => {
//     return (
//       <div className="rounded-lg p-6 shadow-md bg-white">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-gray-200 p-4 rounded-lg">
//             <div className="flex items-center">
//               <FaList className="text-gray-600 mr-3" size={20} />
//               <div>
//                 <h3 className="font-semibold">Requested Bids</h3>
//                 <p className="text-2xl font-bold">{buyerData.requestedBids}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gray-200 p-4 rounded-lg">
//             <div className="flex items-center">
//               <FaCheckCircle className="text-gray-600 mr-3" size={20} />
//               <div>
//                 <h3 className="font-semibold">Accepted Bids</h3>
//                 <p className="text-2xl font-bold">{buyerData.acceptedBids}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gray-200 p-4 rounded-lg">
//             <div className="flex items-center">
//               <FaStar className="text-gray-600 mr-3" size={20} />
//               <div>
//                 <h3 className="font-semibold">Favourites</h3>
//                 <p className="text-2xl font-bold">{buyerData.favourites}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <h2 className="text-xl font-bold mb-4">Bid History</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border">
//             <thead>
//               <tr className="border-b">
//                 <th className="py-2 px-4 text-left border">Item</th>
//                 <th className="py-2 px-4 text-left border">Bid Amount</th>
//                 <th className="py-2 px-4 text-left border">Payment Date</th>
//                 <th className="py-2 px-4 text-left border">Seller Profile</th>
//               </tr>
//             </thead>
//             <tbody>
//               {buyerData.bidHistory?.length > 0 ? (
//                 buyerData.bidHistory.map((bid, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="py-2 px-4 border">{bid.itemName}</td>
//                     <td className="py-2 px-4 border">${bid.bidAmount}</td>
//                     <td className="py-2 px-4 border">
//                       {bid.paymentDate ? 
//                         new Date(bid.paymentDate).toLocaleDateString() : 
//                         'Pending'}
//                     </td>
//                     <td className="py-2 px-4 border">
//                       <div>
//                         <p className="font-medium">{bid.sellerName}</p>
//                         <p className="text-sm text-gray-500">{bid.sellerEmail}</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="py-4 text-center text-gray-500 border">
//                     No bid history available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const renderAccountContent = () => {
//     return (
//       <div className="rounded-lg p-6 shadow-md bg-white">
//         <h2 className="text-xl font-bold mb-6">Edit Your Profile</h2>
//         <form onSubmit={handleProfileUpdate} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">First Name</label>
//               <input
//                 type="text"
//                 id="firstName"
//                 value={userProfile.firstName}
//                 onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
//                 className="w-full border border-gray-300 rounded p-2"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">Last Name</label>
//               <input
//                 type="text"
//                 id="lastName"
//                 value={userProfile.lastName}
//                 onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
//                 className="w-full border border-gray-300 rounded p-2"
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={userProfile.email}
//                 readOnly
//                 className="w-full border border-gray-300 rounded p-2 bg-gray-100"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="address" className="block text-gray-700 font-medium mb-1">Address</label>
//               <input
//                 type="text"
//                 id="address"
//                 value={userProfile.address}
//                 onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
//                 className="w-full border border-gray-300 rounded p-2"
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Phone</label>
//               <input
//                 type="number"
//                 id="phone"
//                 value={userProfile.phone}
//                 onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
//                 className="w-full border border-gray-300 rounded p-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="city" className="block text-gray-700 font-medium mb-1">City</label>
//               <input
//                 type="text"
//                 id="city"
//                 value={userProfile.city}
//                 onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
//                 className="w-full border border-gray-300 rounded p-2"
//               />
//             </div>
//           </div>
//           <div className="flex justify-end space-x-2">
//             <button type="button" className="px-4 py-2 rounded">Cancel</button>
//             <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Save Changes</button>
//           </div>
//         </form>

//         <h2 className="text-xl font-bold mb-6 mt-8">Change Password</h2>
//         <form onSubmit={handleChangePassword} className="space-y-4">
//           <div>
//             <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-1">Current Password</label>
//             <input
//               type="password"
//               id="currentPassword"
//               value={passwordData.currentPassword}
//               onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//               className="w-full border border-gray-300 rounded p-2"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">New Password</label>
//             <input
//               type="password"
//               id="newPassword"
//               value={passwordData.newPassword}
//               onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//               className="w-full border border-gray-300 rounded p-2"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="confirmNewPassword" className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
//             <input
//               type="password"
//               id="confirmNewPassword"
//               value={passwordData.confirmNewPassword}
//               onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
//               className="w-full border border-gray-300 rounded p-2"
//               required
//             />
//           </div>
//           <div className="flex justify-end space-x-2">
//             <button type="button" className="px-4 py-2 rounded">Cancel</button>
//             <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Change Password</button>
//           </div>
//         </form>
//       </div>
//     );
//   };

//   const renderAlertsContent = () => {
//     return (
//       <div className="rounded-lg p-6 shadow-md bg-white">
//         <div className="space-y-4">
//           {Array(6).fill(0).map((_, index) => (
//             <div key={index} className="border-b pb-4">
//               <div className="flex items-start">
//                 <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
//                 <div className="flex-1">
//                   <div className="flex justify-between">
//                     <p className="font-medium">
//                       {index % 2 === 0 ? 'Bid Accepted' : 'Bid Rejected'}
//                     </p>
//                     <span className="text-sm text-gray-500">12:34 PM</span>
//                   </div>
//                   <p className="text-gray-600">Context of the notification.</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 ">
//       <div className="w-full md:w-1/4 p-5 bg-gray-100">
//         <div className="bg-gray-200 p-5 rounded-lg">
//           <ul className="space-y-2">
//             <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "dashboard" ? "bg-white" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
//             <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "profile" ? "bg-white" : ""}`} onClick={() => setActiveTab("profile")}>Manage My Account</li>
//             <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "alerts" ? "bg-white" : ""}`} onClick={() => setActiveTab("alerts")}>My Alerts</li>
//             <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "logout" ? "bg-white" : ""}`} onClick={handleLogout}>LogOut</li>
//           </ul>
//         </div>
        
//         <div className="mt-4">
//           <button 
//             className="bg-blue-600 text-white p-2 rounded cursor-pointer w-full flex items-center justify-center"
//             onClick={handleSwitchUserType}
//           >
//             <FaExchangeAlt className="mr-2" />
//             Switch to {userType === 'buyer' ? 'Seller' : 'Buyer'} Role
//           </button>
//         </div>
//       </div>
      
//       <div className="flex-1 p-5">
//         <div className="mb-6">
//           <div className="text-red-600 font-bold text-lg">
//             Home / DashBoard
//           </div>
//         </div>
        
//         {activeTab === "dashboard" && renderDashboardContent()}
//         {activeTab === "profile" && renderAccountContent()}
//         {activeTab === "alerts" && renderAlertsContent()}
//       </div>
//     </div>
//   );
// };

// export default BuyerDashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { FaList, FaCheckCircle, FaStar, FaExchangeAlt, FaTimes, FaBell } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';


const BuyerDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState('buyer');
  const location = useLocation();
  const [buyerData, setBuyerData] = useState({
    requestedBids: 0,
    acceptedBids: 0,
    favourites: 0,
    bidHistory: []
  });
  const [requestedBids, setRequestedBids] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    city: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [alerts, setAlerts] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    console.log('[Logout] Clearing local storage and redirecting');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/signin');
  }, [navigate]);

  useEffect(() => {
    // Check if navigation state contains activeTab and conversationId
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);

      if (location.state.activeTab === 'chats' && location.state.conversationId) {
        setSelectedConversation(location.state.conversationId);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('[Auth Check] Checking authentication status');
    if (!token) {
      console.warn('[Auth Redirect] No token found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn('[Auth Check] Token expired');
        handleLogout();
        return;
      }
    } catch (error) {
      console.error('[Auth Check] Invalid token:', error);
      handleLogout();
      return;
    }

    const fetchUserData = async () => {
      console.log('[API Call] Starting data fetching process');
      try {
        const dashboardResponse = await axios.get("http://localhost:5000/api/buyer/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBuyerData(dashboardResponse.data);

        const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('User profile data fetched:', profileResponse.data);
        
        
        const profile = profileResponse.data;
        setUserProfile({
          firstName: profile.name?.split(' ')[0] || '',
          lastName: profile.name?.split(' ')[1] || '',
          email: profile.email || '',
          address: profile.address || '',
          phone: profile.phone || '',
          city: profile.city || ''
        });

        
        console.log('Profile data:', profile);
        console.log('User stored in localStorage:', JSON.parse(localStorage.getItem('user')));

        setLoading(false);
      } catch (err) {
        console.error('[Fetch Error] Error fetching data:', err.response?.data || err.message);
        setError('Failed to load data. Please try again later.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          handleLogout();
        }
      }
    };
    
    fetchUserData();
  }, [navigate, handleLogout]);
 
  useEffect(()=>{
    // http://localhost:5000/api/bids/user/680fab6148438e23d844fbd2
  },[])
  
  useEffect(() => {
    const id = localStorage.getItem('id');
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/alerts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Alerts response:', response);
        const buyerAlerts = response.data.filter(alert => alert.userType === 'buyer');
        setAlerts(buyerAlerts);
        setUnreadAlerts(buyerAlerts.filter(alert => !alert.read).length);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        console.error('Alert fetch error details:', error.response);
      }
    };
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/bids/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Alerts response:', response);
        // const buyerAlerts = response.data.filter(alert => alert.userType === 'buyer');
        // setAlerts(buyerAlerts);
        // setUnreadAlerts(buyerAlerts.filter(alert => !alert.read).length);
        // setBuyerData((prevData) => ({
        //   ...prevData,
        //   requestedBids: response.data.length
        // }))
        setRequestedBids(response.data.length);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        console.error('Alert fetch error details:', error.response);
      }
    };
    if(id){
      fetchBids()
    }
    fetchAlerts();
  }, []);

  const handleSwitchUserType = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentType = localStorage.getItem('userType');
      const newType = currentType === 'buyer' ? 'seller' : 'buyer';

      console.log('[Switch Account] Checking if opposite account exists');
      const response = await axios.put(
        "http://localhost:5000/api/user/switch-account",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.exists) {
        console.log('[Switch Account] Switching to existing account');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem("userName", response.data.user.name); // Add this line
        // Replace the entire user object in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User data after switch:', response.data.user);

        window.location.href = `/${response.data.userType}-dashboard`;
      } else {
        console.log('[Switch Account] No existing account found, prompting for new account creation');
        const createNewAccount = window.confirm(`No ${newType} account found. Create new ${newType} account?`);
        if (createNewAccount) {
          console.log('[Switch Account] Creating new account');
          const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });

          const profile = profileResponse.data;
          const registrationResponse = await axios.post("http://localhost:5000/api/user/switch-register", {
            name: profile.name,
            email: profile.email,
            password: 'defaultPassword123',
            type: newType
          });

          if (registrationResponse.data.message) {
            console.log('[Switch Account] New account created successfully');
            alert('Account created successfully. Please check your email for verification.');
  
            handleLogout();
  
            navigate('/otp-verification', { state: { isSwitchVerification: true } });
          } else {
            console.error('[Switch Account] Failed to create new account');
            alert('Failed to create account. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Switch error:', err);
      alert(err.response?.data?.message || 'Account switch failed');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const profileData = {
        name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        address: userProfile.address,
        phone: userProfile.phone,
        city: userProfile.city
      };
      await axios.put("http://localhost:5000/api/user/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error('[Profile Error] Update failed:', err.response?.data || err.message);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert('New password and confirm new password do not match');
      return;
    }
    if (passwordData.newPassword === passwordData.currentPassword) {
      alert('New password should not match the current password');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put("http://localhost:5000/api/user/password", {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    } catch (err) {
      console.error('[Password Error] Change failed:', err.response?.data || err.message);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(alerts.filter(alert => alert._id !== alertId));
      setUnreadAlerts(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const renderDashboardContent = () => {
    return (
      <div className="rounded-lg p-6 shadow-md bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <FaList className="text-gray-600 mr-3" size={20} />
              <div>
                <h3 className="font-semibold">Requested Bids</h3>
                <p className="text-2xl font-bold">{requestedBids}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <FaCheckCircle className="text-gray-600 mr-3" size={20} />
              <div>
                <h3 className="font-semibold">Accepted Bids</h3>
                <p className="text-2xl font-bold">{buyerData.acceptedBids}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <FaStar className="text-gray-600 mr-3" size={20} />
              <div>
                <h3 className="font-semibold">Favourites</h3>
                <p className="text-2xl font-bold">{buyerData.favourites}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Bid History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left border">Item</th>
                <th className="py-2 px-4 text-left border">Bid Amount</th>
                <th className="py-2 px-4 text-left border">Payment Date</th>
                <th className="py-2 px-4 text-left border">Seller Profile</th>
              </tr>
            </thead>
            <tbody>
              {buyerData.bidHistory?.length > 0 ? (
                buyerData.bidHistory.map((bid, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 border">{bid.itemName}</td>
                    <td className="py-2 px-4 border">${bid.bidAmount}</td>
                    <td className="py-2 px-4 border">
                      {bid.paymentDate ? 
                        new Date(bid.paymentDate).toLocaleDateString() : 
                        'Pending'}
                    </td>
                    <td className="py-2 px-4 border">
                      <div>
                        <p className="font-medium">{bid.sellerName}</p>
                        <p className="text-sm text-gray-500">{bid.sellerEmail}</p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500 border">
                    No bid history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAccountContent = () => {
    return (
      <div className="rounded-lg p-6 shadow-md bg-white">
        <h2 className="text-xl font-bold mb-6">Edit Your Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                value={userProfile.firstName}
                onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={userProfile.lastName}
                onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={userProfile.email}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-1">Address</label>
              <input
                type="text"
                id="address"
                value={userProfile.address}
                onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                type="number"
                id="phone"
                value={userProfile.phone}
                onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-gray-700 font-medium mb-1">City</label>
              <input
                type="text"
                id="city"
                value={userProfile.city}
                onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Save Changes</button>
          </div>
        </form>

        <h2 className="text-xl font-bold mb-6 mt-8">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-1">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Change Password</button>
          </div>
        </form>
      </div>
    );
  };

  const renderAlertsContent = () => {
    const getAlertMessage = (alert) => {
      switch(alert.action) {
        case 'favorited-product':
          return `You favorited "${alert.productName}"`;
        case 'bid-placed':
          return `Bid placed on "${alert.productName}"`;
        case 'bid-accepted':
          return `Your bid for "${alert.productName}" was accepted!`;
        case 'bid-rejected':
          return `Your bid for "${alert.productName}" was rejected`;
        default:
          return alert.action.replace('-', ' ');
      }
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Alerts</h2>
          {unreadAlerts > 0 && (
            <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
              {unreadAlerts} unread
            </span>
          )}
        </div>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <FaBell className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500">No alerts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="p-4 rounded-lg border border-blue-100 bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">
                      {getAlertMessage(alert)}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object here
        console.log('User stored in localStorage:', JSON.parse(localStorage.getItem('user')));
        
        if (!user || !user.id) {
          console.error('User not found in localStorage');
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/conversations/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    if (activeTab === 'chats') {
      fetchConversations();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/messages/${selectedConversation}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

    // Add this new render function
    const 
    renderChatsContent = () => {
      const user = JSON.parse(localStorage.getItem('user'));

      const fetchMessages = async (conversationId) => {
        if (!conversationId) return;
  
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:5000/api/messages/${conversationId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
    
      const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
    
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            'http://localhost:5000/api/messages',
            {
              conversationId: selectedConversation,
              senderId: user._id,
              text: newMessage,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

              // Optimistically update the conversations state
          setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
          conversation._id === selectedConversation
          ? { ...conversation, lastMessage: newMessage }
          : conversation
      )
    );
    
          setNewMessage('');
          fetchMessages(selectedConversation);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };
    
      return (
        <div className="rounded-lg p-6 shadow-md bg-white h-[600px] flex gap-4">
          {/* Conversations List */}
          <div className="w-1/3 border-r pr-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Conversations</h2>
            {conversations.map((conversation) => {
              // Get the seller's name by filtering out the logged-in buyer
              const seller = conversation.participants.find(
                (participant) => participant._id !== user._id
              );
    
              return (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation._id)}
                  className={`p-3 cursor-pointer rounded-lg mb-2 ${
                    selectedConversation === conversation._id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{seller?.name || 'Unknown Seller'}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage || 'No messages yet'}
                  </div>
                </div>
              );
            })}
          </div>
    
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex-1 overflow-y-auto mb-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mb-4 ${
                        message.senderId === user._id ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          message.senderId === user._id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                        }`}
                      >
                        {message.text}
                        <div className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="mt-auto">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 border rounded-lg p-2"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-gray-500 flex-1 flex items-center justify-center">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      );
    };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 ">
      <div className="w-full md:w-1/4 p-5 bg-gray-100">  
        <div className="bg-gray-200 p-5 rounded-lg">
          {/* <ul className="space-y-2">
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "dashboard" ? "bg-white" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "profile" ? "bg-white" : ""}`} onClick={() => setActiveTab("profile")}>Manage My Account</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "alerts" ? "bg-white" : ""}`} onClick={() => setActiveTab("alerts")}>My Alerts</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "logout" ? "bg-white" : ""}`} onClick={handleLogout}>LogOut</li>
          </ul> */}
        <ul className="space-y-2">
          <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "dashboard" ? "bg-white" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
          <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "profile" ? "bg-white" : ""}`} onClick={() => setActiveTab("profile")}>Manage My Account</li>
          <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "alerts" ? "bg-white" : ""}`} onClick={() => setActiveTab("alerts")}>My Alerts</li>
          <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "chats" ? "bg-white" : ""}`} onClick={() => setActiveTab("chats")}>My Chats</li>
          <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "logout" ? "bg-white" : ""}`} onClick={handleLogout}>LogOut</li>
        </ul>
        </div>
        
        <div className="mt-4">
          <Link to={"/buyer/bids"} className='mb-3 p-2 rounded cursor-pointer w-full flex items-center justify-center bg-red-600 text-white'>All Bids</Link>
          <button 
            className="bg-blue-600 text-white p-2 rounded cursor-pointer w-full flex items-center justify-center"
            onClick={handleSwitchUserType}
          >
            <FaExchangeAlt className="mr-2" />
            Switch to {userType === 'buyer' ? 'Seller' : 'Buyer'} Role
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-5">
        <div className="mb-6">
          <div className="text-red-600 font-bold text-lg">
            Home / DashBoard
          </div>
        </div>
        {activeTab === "chats" && renderChatsContent()}
        {activeTab === "dashboard" && renderDashboardContent()}
        {activeTab === "profile" && renderAccountContent()}
        {activeTab === "alerts" && renderAlertsContent()}

      </div>
    </div>
  );
};

export default BuyerDashboard;