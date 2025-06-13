import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { FaList, FaCheckCircle, FaStar, FaExchangeAlt, FaTimes, FaBell, FaHandshake, FaMoneyCheckAlt, FaTimesCircle, FaHeart } from 'react-icons/fa';
import { FiUser, FiMail, FiMapPin, FiPhone, FiLock, FiMessageSquare, FiHome, FiBell, FiLogOut, FiArrowRight } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const BuyerDashboard = ({setIsAuthenticated}) => {
  const BASEURL = "http://localhost:5000";
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType] = useState('buyer');
  const location = useLocation();
  const [buyerData, setBuyerData] = useState({
    requestedBids: 0,
    acceptedBids: 0,
    rejectedBids: 0,
    totalBids: 0,
    bidHistory: []
  });
  const [requestedBids, setRequestedBids] = useState(0);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    country: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [alerts, setAlerts] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

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

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        `${BASEURL}/api/auth/logout`, // Use template literal for URL
        {}, // empty body (if your API doesn't expect any data)
        {
          headers: { Authorization: `Bearer ${token}` } // Use template literal for header
        }
      );
  
      if (response.status === 200) {
        toast.success('Logout successful!');
  
        // List of keys to remove
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
         setIsAuthenticated(false); 
        // Optionally redirect to login page
        // window.location.href = '/login';
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
          city: profile.city || '',
          country: profile.country || ''
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
        localStorage.setItem("userName", response.data.user.name);
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

            // Store the necessary data in localStorage before navigation
            localStorage.setItem("email", profile.email);
            localStorage.setItem("name", profile.name);
            localStorage.setItem("type", newType);
            localStorage.setItem("password", 'defaultPassword123');

            // Navigate to OTP verification without calling handleLogout
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
        city: userProfile.city,
        country: userProfile.country
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

  const handleMarkAlertAsRead = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/alerts/${alertId}/read`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, read: true } : alert
      ));
      setUnreadAlerts(prev => prev - 1);
    } catch (error) {
      console.error('Error marking alert as read:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const renderDashboardContent = () => {
 return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gradient Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Dashboard Content */}
        <div className="rounded-lg p-6 shadow-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Stats Cards */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-4 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-3 bg-[#FFAA5D] text-white rounded-lg mr-4">
                  <FaList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#043E52]">Requested Bids</h3>
                  <p className="text-2xl font-bold text-[#016A6D]">{requestedBids}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-4 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-3 bg-[#016A6D] text-white rounded-lg mr-4">
                  <FaCheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#043E52]">Accepted Bids</h3>
                  <p className="text-2xl font-bold text-[#016A6D]">{buyerData.acceptedBids}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-4 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-3 bg-[#E16A3D] text-white rounded-lg mr-4">
                  <FaStar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#043E52]">Favourites</h3>
                  <p className="text-2xl font-bold text-[#016A6D]">{buyerData.favourites}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bid History Table */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#043E52] border-b border-[#016A6D]/20 pb-2">
              Bid History
            </h2>
            
            <div className="overflow-x-auto rounded-lg border border-[#016A6D]/20">
              <table className="w-full">
                <thead className="bg-[#043E52]/5">
                  <tr>
                    <th className="py-3 px-4 text-left text-[#043E52] font-semibold">Item</th>
                    <th className="py-3 px-4 text-left text-[#043E52] font-semibold">Bid Amount</th>
                    <th className="py-3 px-4 text-left text-[#043E52] font-semibold">Payment Date</th>
                    <th className="py-3 px-4 text-left text-[#043E52] font-semibold">Seller Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerData.bidHistory?.length > 0 ? (
                    buyerData.bidHistory.map((bid, index) => (
                      <tr key={index} className="border-t border-[#016A6D]/10 hover:bg-[#043E52]/5">
                        <td className="py-3 px-4 text-[#043E52]">{bid.itemName}</td>
                        <td className="py-3 px-4 text-[#016A6D] font-medium">PKR {bid.bidAmount}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-1 rounded-lg bg-[#FFAA5D]/10 text-[#E16A3D]">
                            {bid.paymentDate ? 
                              new Date(bid.paymentDate).toLocaleDateString() : 
                              'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#016A6D]/10 rounded-full flex items-center justify-center">
                              <FiUser className="text-[#016A6D]" />
                            </div>
                            <div>
                              <p className="font-medium text-[#043E52]">{bid.sellerName}</p>
                              <p className="text-sm text-[#043E52]/80">{bid.sellerEmail}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-[#043E52]/50">
                        No bid history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

 const renderAccountContent = () => {
    return (
      <div className="rounded-xl p-8 shadow-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20">
        {/* Profile Section */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-[#043E52] border-b border-[#016A6D]/20 pb-3">
              Edit Profile
            </h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="relative group">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    id="firstName"
                    value={userProfile.firstName}
                    onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                    placeholder="First Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="relative group">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    id="lastName"
                    value={userProfile.lastName}
                    onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>

                {/* Email */}
                <div className="relative group md:col-span-2">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
                  <input
                    type="email"
                    id="email"
                    value={userProfile.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 bg-[#016A6D]/5 cursor-not-allowed"
                  />
                </div>

                {/* Address */}
                <div className="relative group md:col-span-2">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    id="address"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                    placeholder="Address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>

                {/* Phone */}
                <div className="relative group">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="tel"
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>

                {/* City */}
                <div className="relative group">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    id="city"
                    value={userProfile.city}
                    onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                    placeholder="City"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>

                {/* Country */}
                <div className="relative group">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    id="country"
                    value={userProfile.country}
                    onChange={(e) => setUserProfile({ ...userProfile, country: e.target.value })}
                    placeholder="Country"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 text-[#016A6D] hover:text-[#FFAA5D] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Password Section */}
          <motion.div variants={itemVariants} className="pt-8 border-t border-[#016A6D]/20">
            <h2 className="text-2xl font-bold text-[#043E52] mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-4">
                {/* Current Password */}
                <div className="relative group">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Current Password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  />
                </div>

                {/* New Password */}
                <div className="relative group">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="New Password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="relative group">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                    placeholder="Confirm New Password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 text-[#016A6D] hover:text-[#FFAA5D] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Change Password
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
};

 const getAlertIcon = (action) => {
  switch (action) {
    case 'bid_placed':
      return <FaHandshake className="text-[#016A6D]" />;
    case 'bid_accepted':
      return <FaCheckCircle className="text-[#016A6D]" />;
    case 'bid_rejected':
      return <FaTimesCircle className="text-[#E16A3D]" />;
    case 'bid_won':
      return <FaMoneyCheckAlt className="text-[#016A6D]" />;
    case 'bid_lost':
      return <FaTimes className="text-[#E16A3D]" />;
    case 'favorited':
      return <FaHeart className="text-[#E16A3D]" />;
    case 'payment_success':
      return <FaMoneyCheckAlt className="text-[#016A6D]" />;
    case 'payment_failed':
      return <FaTimesCircle className="text-[#E16A3D]" />;
    case 'auction_ended':
      return <FaExchangeAlt className="text-[#043E52]" />;
    case 'new_message':
      return <FaBell className="text-[#FFAA5D]" />;
    default:
      return <FaStar className="text-[#043E52]/80" />;
  }
};

const getAlertMessage = (action, productName) => {
  switch (action) {
    case 'bid_placed':
      return `Your bid for "${productName}" has been placed successfully`;
    case 'bid_accepted':
      return `Your bid for "${productName}" has been accepted!`;
    case 'bid_rejected':
      return `Your bid for "${productName}" was not accepted`;
    case 'bid_won':
      return `Congratulations! You won the auction for "${productName}"!`;
    case 'bid_lost':
      return `The auction for "${productName}" has ended - you were outbid`;
    case 'favorited':
      return `"${productName}" has been added to your favorites`;
    case 'payment_success':
      return `Payment successful for "${productName}"!`;
    case 'payment_failed':
      return `Payment failed for "${productName}" - please try again`;
    case 'auction_ended':
      return `The auction for "${productName}" has ended`;
    case 'new_message':
      return `New message received about "${productName}"`;
    default:
      return 'New activity on your account';
  }
};

const renderAlertsContent = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="rounded-xl shadow-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#043E52] flex items-center gap-2">
          <FaBell className="text-[#FFAA5D]" />
          Activity Alerts
        </h2>
        {unreadAlerts > 0 && (
          <span className="bg-[#E16A3D] text-white text-sm px-3 py-1 rounded-full">
            {unreadAlerts} new
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="text-center py-12"
        >
          <FaBell className="text-[#043E52]/30 text-4xl mx-auto mb-4" />
          <p className="text-[#043E52]/60">No recent activity</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <motion.div
              key={alert._id}
              variants={itemVariants}
              className={`p-4 rounded-xl border ${
                !alert.read 
                  ? 'bg-[#FFAA5D]/10 border-[#FFAA5D]/30' 
                  : 'bg-[#016A6D]/5 border-[#016A6D]/20'
              } transition-all duration-200 group`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {getAlertIcon(alert.action)}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-[#043E52]">
                    {getAlertMessage(alert.action, alert.productName)}
                  </p>
                  <p className="text-sm text-[#043E52]/60 mt-1">
                    {new Date(alert.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!alert.read && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkAlertAsRead(alert._id)}
                      className="text-sm text-[#016A6D] hover:text-[#FFAA5D] transition-colors"
                    >
                      Mark read
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="text-[#043E52]/30 hover:text-[#E16A3D] transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
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

        // Add these CSS styles to your global stylesheet or component
    
 return (
    <div className="rounded-xl shadow-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 h-[600px] flex gap-6 p-6">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-[#016A6D]/20 pr-4 overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
          <FiMessageSquare className="text-[#FFAA5D]" />
          Conversations
        </h2>
        
        {conversations.map((conversation) => {
          const seller = conversation.participants.find(
            (participant) => participant._id !== user._id
          );

          return (
            <motion.div
              key={conversation._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 cursor-pointer rounded-xl mb-3 transition-all ${
                selectedConversation === conversation._id
                  ? 'bg-[#016A6D]/10 border-2 border-[#016A6D]/20'
                  : 'hover:bg-[#043E52]/5 border border-transparent'
              }`}
              onClick={() => setSelectedConversation(conversation._id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#016A6D]/10 rounded-full flex items-center justify-center">
                  <FiUser className="text-[#016A6D]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#043E52]">
                    {seller?.name || 'Unknown Seller'}
                  </h3>
                  <p className="text-sm text-[#043E52]/60 truncate">
                    {conversation.lastMessage || 'Start a conversation'}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto mb-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.senderId === user._id
                        ? 'bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] text-white'
                        : 'bg-[#016A6D]/10 text-[#043E52]'
                    }`}
                  >
                    <p className="mb-1">{message.text}</p>
                    <p className={`text-xs ${
                      message.senderId === user._id 
                        ? 'text-white/70' 
                        : 'text-[#043E52]/60'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-auto">
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Send
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#043E52]/60">
            <FiMessageSquare className="text-4xl mb-4" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 p-6 bg-white/90 backdrop-blur-lg border-r border-[#016A6D]/20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <div className="rounded-xl bg-[#016A6D]/5 p-4 border border-[#016A6D]/20">
            <ul className="space-y-2">
              {[
                { tab: "dashboard", label: "Dashboard", icon: <FiHome /> },
                { tab: "profile", label: "Manage Account", icon: <FiUser /> },
                { tab: "alerts", label: "My Alerts", icon: <FiBell /> },
                { tab: "chats", label: "My Chats", icon: <FiMessageSquare /> },
                { tab: "logout", label: "Logout", icon: <FiLogOut /> }
              ].map((item) => (
                <motion.li
                  key={item.tab}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 cursor-pointer rounded-xl flex items-center gap-3 transition-all ${
                    activeTab === item.tab 
                      ? 'bg-gradient-to-r from-[#FFAA5D]/10 to-[#E16A3D]/10 text-[#043E52] border border-[#016A6D]/20'
                      : 'hover:bg-[#016A6D]/5'
                  }`}
                  onClick={item.tab === "logout" ? logout : () => setActiveTab(item.tab)}
                >
                  <span className="text-[#FFAA5D]">{item.icon}</span>
                  {item.label}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 mt-4">
            <Link 
              to="/buyer/bids"
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#043E52] to-[#016A6D] text-white rounded-xl hover:shadow-lg transition-all"
            >
              <FaHandshake />
              See Bids
            </Link>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#016A6D] to-[#FFAA5D] text-white rounded-xl hover:shadow-lg transition-all"
              onClick={handleSwitchUserType}
            >
              <FaExchangeAlt />
              Switch to {userType === 'buyer' ? 'Seller' : 'Buyer'}
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <nav className="flex items-center text-[#043E52]/80 space-x-2">
            <motion.div
              className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
            />
            <button 
              onClick={() => navigate('/Home')} 
              className="hover:text-[#FFAA5D] transition-colors"
            >
              Home
            </button>
            <FiArrowRight className="text-[#FFAA5D]" />
            <span className="font-medium text-[#043E52]">Dashboard</span>
          </nav>
        </motion.div>

        {activeTab === "chats" && renderChatsContent()}
        {activeTab === "dashboard" && renderDashboardContent()}
        {activeTab === "profile" && renderAccountContent()}
        {activeTab === "alerts" && renderAlertsContent()}
      </div>
    </div>
  );
};

BuyerDashboard.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired
};

export default BuyerDashboard;