import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// Import the icons you need
import { FaStar, FaExchangeAlt, FaTimes, FaPlus, FaEdit, FaTrash, FaSave, FaHeart, FaBell, FaHandshake, FaMoneyCheckAlt, FaStripe, FaTimesCircle } from 'react-icons/fa';
import StripeOnboardingButton from '../components/StripeOnboardingButton';
import { motion } from 'framer-motion';
import { FiBox, FiClock, FiStar, FiEye, FiMapPin, FiUser, FiMail, FiPhone, FiLock, FiMessageSquare, FiHome, FiBell, FiLogOut, FiPlus, FiList, FiArrowRight, FiX } from 'react-icons/fi';

const SellerDashboard = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState('seller'); // Add state for tracking user type
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const BASEURL = import.meta.env.VITE_API_URL;
  const [userHaveStripeAccount, setUserHaveStripeAccount] = useState(true);
  const [sellerData, setSellerData] = useState({
    activeBids: 0,
    endedBids: 0,
    stripeLoginLink: null,
    favourites: 0,
    bidHistory: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // const logout = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const sessionToken = sessionStorage.getItem("sessionToken");

  //     const response = await axios.post(
  //       `${BASEURL}/api/auth/logout`,
  //       {}, // empty body (if your API doesn't expect any data)
  //       {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success('Logout successful!');

  //       // List of keys to remove
  //       const keysToRemove = [
  //         'email',
  //         'name',
  //         'password',
  //         'sellerData',
  //         'token',
  //         'type',
  //         'userEmail',
  //         'userName',
  //         'userType',
  //         'country',
  //         'city'
  //       ];

  //       keysToRemove.forEach((key) => {
  //         localStorage.removeItem(key);
  //       });
  //       setIsAuthenticated(false);
  //       // Optionally redirect to login page
  //       // window.location.href = '/login';
  //     } else {
  //       toast.error('Logout failed. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //     toast.error('An error occurred during logout.');
  //   }
  // };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const sessionToken = sessionStorage.getItem("sessionToken"); // NEW: Get session token

      // Only call logout API if tokens are valid and matching
      if (token && token === sessionToken) {
        const response = await axios.post(
          `${BASEURL}/api/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          toast.success('Logout successful!');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
    } finally {
      // Always clear storage
      const keysToRemove = [
        'email', 'name', 'password', 'sellerData', 'token', 'type',
        'userEmail', 'userName', 'userType', 'country', 'city'
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // NEW: Clear session token
      sessionStorage.removeItem('sessionToken');

      setIsAuthenticated(false);
    }
  };

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeBids: 0,
    totalFavorites: 0,
    totalSales: 0
  });

  const [alerts, setAlerts] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('sessionToken'); // Get session token
    console.log('[Auth Check] Checking authentication status');


    // if (!token) {
    //   console.warn('[Auth Redirect] No token found, redirecting to login');
    //   navigate('/login');
    //   return;
    // }
    // // Get stored user type if available
    // const storedUserType = localStorage.getItem('userType');
    // if (storedUserType) {
    //   setUserType(storedUserType);
    // }

    if (!token || !sessionToken || token !== sessionToken) {
      console.warn('[Auth Redirect] Invalid session, redirecting to login');
      handleLogout();
      return;
    }

    // Get stored user type if available
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }

    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User stored in localStorage:', user);

    const fetchUserData = async () => {
      console.log('[API Call] Starting data fetching process');
      try {
        console.log('[Dashboard Data] Fetching seller dashboard data from /api/seller/dashboard');
        const dashboardResponse = await axios.get("http://localhost:5000/api/seller/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Seller dashboard data fetched:', dashboardResponse.data);
        setSellerData(dashboardResponse.data);

        console.log('[Profile Data] Fetching user profile from /api/user/profile');
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

        console.log('[User Profile] Updated local state with profile data');

        const sessionToken = sessionStorage.getItem('sessionToken');
        if (!sessionToken) {
          sessionStorage.setItem('sessionToken', token);
        }

        setLoading(false);
      } catch (err) {
        console.error('[Fetch Error] Error fetching data:', err.response?.data || err.message);
        setError('Failed to load data. Please try again later.');
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          handleLogout(); // Trigger logout on token issues
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [dashboardResponse, alertsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/seller/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get('http://localhost:5000/api/alerts', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        setSellerData(dashboardResponse.data);
        setAlerts(alertsResponse.data);
        setUnreadAlerts(alertsResponse.data.filter(alert => !alert.read).length);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/seller/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Listen for storage events to update when data changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sellerData') {
        setSellerData(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    console.log('[Logout] Clearing local storage and redirecting');

    sessionStorage.removeItem('sessionToken');

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/signin', { replace: true });
  };

  // const handleSwitchUserType = async () => {
  //   console.log('[Switch Account] Initiating account switch');
  //   try {
  //     const token = localStorage.getItem('token');
  //     const userEmail = localStorage.getItem('userEmail');
  //     const currentType = localStorage.getItem('userType');
  //     const newType = currentType === 'buyer' ? 'seller' : 'buyer';

  //     console.log('[Switch Account] Checking if opposite account exists');
  //     const response = await axios.put(
  //       "http://localhost:5000/api/user/switch-account",
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.data.exists) {
  //       console.log('[Switch Account] Switching to existing account');
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('userType', response.data.userType);
  //       localStorage.setItem("userName", response.data.user.name);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));

  //       window.location.href = `/${response.data.userType}-dashboard`;
  //     } else {
  //       console.log('[Switch Account] No existing account found, prompting for new account creation');
  //       const createNewAccount = window.confirm(`No ${newType} account found. Do you want to create a new ${newType} account?`);
  //       if (createNewAccount) {
  //         console.log('[Switch Account] Creating new account');
  //         const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });

  //         const profile = profileResponse.data;

  //         const registrationResponse = await axios.post("http://localhost:5000/api/user/switch-register", {
  //           name: profile.name,
  //           email: profile.email,
  //           password: 'defaultPassword123',
  //           type: newType
  //         });

  //         if (registrationResponse.data.message) {
  //           console.log('[Switch Account] New account created successfully');
  //           alert('Account created successfully. Please check your email for verification.');

  //           // Store the necessary data in localStorage before navigation
  //           localStorage.setItem("email", profile.email);
  //           localStorage.setItem("name", profile.name);
  //           localStorage.setItem("type", newType);
  //           localStorage.setItem("password", 'defaultPassword123');

  //           // Navigate to OTP verification without calling handleLogout
  //           navigate('/otp-verification', { state: { isSwitchVerification: true } });
  //         } else {
  //           console.error('[Switch Account] Failed to create new account');
  //           alert('Failed to create account. Please try again.');
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error('[Switch Error] Account switch failed:', err.response?.data || err.message);
  //     alert(err.response?.data?.message || 'Account switch failed');
  //   }
  // };

  const handleSwitchUserType = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentType = localStorage.getItem('userType');
      const newType = currentType === 'buyer' ? 'seller' : 'buyer';

      const response = await axios.put(
        "http://localhost:5000/api/user/switch-account",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.exists) {
        // Set tokens in both storage types
        localStorage.setItem('token', response.data.token);
        sessionStorage.setItem('sessionToken', response.data.token); // NEW

        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        window.location.href = `/${response.data.userType}-dashboard`;
      } else {
        const createNewAccount = window.confirm(`No ${newType} account found. Create new ${newType} account?`);
        if (createNewAccount) {
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
            alert('Account created successfully. Please check your email for verification.');
            // navigate('/otp-verification', { state: { isSwitchVerification: true } }); // send data with this

            //Sania
            navigate('/otp-verification', {
              state: {
                isSwitchVerification: true,
                email: profile.email,
                name: profile.name,
                password: 'defaultPassword123',
                type: newType,
              }
            });
          }
        }
      }
    } catch (err) {
      console.error('Switch error:', err);
      alert(err.response?.data?.message || 'Account switch failed');
    }
  };

  const handleAddAccount = async () => {
    try {
      const userId = localStorage.getItem('id');
      const response = await axios.post("http://localhost:5000/api/stripe/checkStripeAccount", {
        userId: userId
      })
      console.log(response.data);
      if (response.data.stripeAccountId === null) {
        setUserHaveStripeAccount(false);
      } else {
        navigate('/add-product')
      }

      // navigate('/add-product')
    } catch (error) {
      console.log(error, "error");

    }
  }
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    console.log('[Profile Update] Initiating profile update');
    try {
      const token = localStorage.getItem('token');
      const profileData = {
        name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        address: userProfile.address,
        phone: userProfile.phone,
        city: userProfile.city
      };
      console.log('[Profile Update] Sending data:', profileData);
      await axios.put("http://localhost:5000/api/user/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[Profile Update] Profile updated successfully');
      alert('Profile updated successfully');
    } catch (err) {
      console.error('[Profile Error] Update failed:', err.response?.data || err.message);
      alert('Failed to update profile. Please try again.');
      if (err.response && err.response.status === 401) {
        handleLogout(); // Trigger logout on token issues
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log('[Password Change] Initiating password change');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      console.warn('[Password Mismatch] New passwords do not match');
      alert('New password and confirm new password do not match');
      return;
    }
    if (passwordData.newPassword === passwordData.currentPassword) {
      console.warn('[Password Mismatch] New password matches current password');
      alert('New password should not match the current password');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const passwordDataToSend = {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };
      console.log('[Password Change] Sending password change request');

      const response = await axios.put("http://localhost:5000/api/user/password", passwordDataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.error) {
        console.warn('[Password Error]', response.data.error);
        alert(response.data.error);
      } else {
        console.log('[Password Change] Successfully updated password');
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
      if (err.response && err.response.status === 401) {
        handleLogout(); // Trigger logout on token issues
      }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRemoveAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/alerts/${alertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setAlerts(alerts.filter(alert => alert._id !== alertId));
      setUnreadAlerts(prev => prev - 1);
    } catch (error) {
      console.error('Error removing alert:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const renderDashboardContent = () => {
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
      <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="rounded-lg p-6 shadow-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-4 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl shadow-sm"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-[#FFAA5D] text-white rounded-lg mr-4">
                    <FiBox className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#043E52]">Active Bids</h3>
                    <p className="text-2xl font-bold text-[#016A6D]">{sellerData.activeBids}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-4 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl shadow-sm"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-[#016A6D] text-white rounded-lg mr-4">
                    <FiClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#043E52]">Ended Bids</h3>
                    <p className="text-2xl font-bold text-[#016A6D]">{sellerData.endedBids}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-4 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl shadow-sm"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-[#E16A3D] text-white rounded-lg mr-4">
                    <FiStar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#043E52]">Favorites</h3>
                    <p className="text-2xl font-bold text-[#016A6D]">{sellerData.favourites}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-[#043E52] border-b border-[#016A6D]/20 pb-2 mb-6">
                Bid History
              </h2>

              <div className="overflow-x-auto rounded-lg border border-[#016A6D]/20">
                <table className="w-full">
                  <thead className="bg-[#043E52]/5">
                    <tr>
                      {['Items', 'Bid Start', 'Bid End', 'Date', 'Status', 'Action'].map((header, index) => (
                        <th
                          key={index}
                          className="py-3 px-4 text-left text-[#043E52] font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#016A6D]/20">
                    {sellerData.bidHistory?.length > 0 ? (
                      sellerData.bidHistory.map((bid, index) => (
                        <motion.tr
                          key={index}
                          variants={itemVariants}
                          className="hover:bg-[#016A6D]/5 transition-colors"
                        >
                          <td className="py-3 px-4 text-[#016A6D] font-medium">
                            <Link
                              to={`/dashboard/products/${bid.productId}`}
                              className="hover:text-[#FFAA5D] transition-colors"
                            >
                              {bid.item}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-[#016A6D] font-medium">
                            <div className="flex items-center gap-2">
                              PKR {bid.startPrice}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {bid.soldPrice ? (
                              <div className="flex items-center gap-2 text-[#016A6D] font-medium">
                                PKR {bid.soldPrice}
                              </div>
                            ) : (
                              <span className="inline-block px-2 py-1 rounded-lg bg-[#FFAA5D]/10 text-[#E16A3D]">Active</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[#043E52]/80">
                            {new Date(bid.bidTime).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-lg ${bid.sold
                              ? 'bg-[#016A6D]/10 text-[#016A6D]'
                              : 'bg-[#FFAA5D]/10 text-[#E16A3D]'
                              }`}>
                              {bid.sold ? 'Sold' : 'Active'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              to={`/dashboard/products/${bid.productId}`}
                              className="flex items-center gap-2 text-[#016A6D] hover:text-[#FFAA5D] transition-colors"
                            >
                              <FiEye className="w-5 h-5" />
                              View
                            </Link>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr variants={itemVariants}>
                        <td colSpan="6" className="py-6 text-center text-[#043E52]/50 border">
                          No bid history available
                        </td>
                      </motion.tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderAccountContent = () => {
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
        {/* Profile Section */}
        <motion.div variants={itemVariants} className="space-y-8">
          <h2 className="text-2xl font-bold text-[#043E52] border-b border-[#016A6D]/20 pb-3">
            Edit Profile
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="relative group">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                <input
                  type="text"
                  id="country"
                  value={userProfile.country}
                  onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                  placeholder="Country"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                />
              </div>
            </div>

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
      </motion.div>
    );
  };

  const getAlertIcon = (action) => {
    switch (action) {
      case 'added':
        return <FaPlus className="text-[#016A6D]" />;
      case 'edited':
        return <FaEdit className="text-[#043E52]" />;
      case 'deleted':
        return <FaTrash className="text-[#E16A3D]" />;
      case 'draft':
        return <FaSave className="text-[#FFAA5D]" />;
      case 'favorited':
        return <FaHeart className="text-[#E16A3D]" />;
      case 'ended':
        return <FaExchangeAlt className="text-[#043E52]" />;
      case 'product_sold':
        return <FaMoneyCheckAlt className="text-[#016A6D]" />;
      case 'bid-rejected':
        return <FaTimesCircle className="text-[#E16A3D]" />;
      case 'new-bid':
        return <FaHandshake className="text-[#016A6D]" />;
      default:
        return <FaStar className="text-[#043E52]/80" />;
    }
  };

  const getAlertMessage = (action, productName) => {
    switch (action) {
      case 'added':
        return `New product "${productName}" has been added`;
      case 'edited':
        return `Product "${productName}" has been updated`;
      case 'deleted':
        return `Product "${productName}" has been removed`;
      case 'draft':
        return `Draft saved for "${productName}"`;
      case 'product_sold':
        return `Payment received for "${productName}"!`;
      case 'favorited':
        return `"${productName}" added to favorites`;
      case 'ended':
        return `Auction ended for "${productName}"`;
      case 'bid-rejected':
        return `Payment declined for "${productName}"`;
      case 'new-bid':
        return `New bid received for "${productName}"`;
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
                className={`p-4 rounded-xl border ${!alert.read
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
                      onClick={() => handleRemoveAlert(alert._id)}
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
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user?._id) {
          console.error('User not found in local storage');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/conversations/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    if (activeTab === 'chats') {
      fetchConversations();
    }
  }, [activeTab]);

  const renderChatsContent = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    const fetchMessages = async (conversationId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/messages/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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
        await axios.post('http://localhost:5000/api/messages', {
          conversationId: selectedConversation,
          senderId: user._id,
          text: newMessage
        }, { headers: { Authorization: `Bearer ${token}` } });

        setNewMessage('');
        fetchMessages(selectedConversation);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="rounded-xl shadow-xl bg-white/90 backdrop-blur-lg border border-[#016A6D]/20 h-[600px] flex gap-6 p-6"
      >
        {/* Conversations List */}
        <div className="w-1/3 border-r border-[#016A6D]/20 pr-4 overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#043E52] mb-6 flex items-center gap-2">
            <FiMessageSquare className="text-[#FFAA5D]" />
            Conversations
          </h2>
          {conversations.map(conversation => (
            <motion.div
              key={conversation._id}
              variants={itemVariants}
              className={`p-4 cursor-pointer rounded-xl mb-3 transition-all ${selectedConversation === conversation._id
                ? 'bg-[#016A6D]/10 border-2 border-[#016A6D]/20'
                : 'hover:bg-[#043E52]/5 border border-transparent'
                }`}
              onClick={() => {
                setSelectedConversation(conversation._id);
                fetchMessages(conversation._id);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#016A6D]/10 rounded-full flex items-center justify-center">
                  <FiUser className="text-[#016A6D]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#043E52]">
                    {conversation.participants
                      .filter(p => p._id !== user._id)
                      .map(p => p.name)
                      .join(', ')}
                  </h3>
                  <p className="text-sm text-[#043E52]/60 truncate">
                    {conversation.lastMessage || 'Start a conversation'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <motion.div
                className="flex-1 overflow-y-auto mb-6 space-y-4"
                variants={containerVariants}
              >
                {messages.map(message => (
                  <motion.div
                    key={message._id}
                    variants={itemVariants}
                    className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${message.senderId === user._id
                        ? 'bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] text-white'
                        : 'bg-[#016A6D]/10 text-[#043E52]'
                        }`}
                    >
                      <p className="mb-1">{message.text}</p>
                      <p className={`text-xs ${message.senderId === user._id
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
              </motion.div>

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
      </motion.div>
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
                sellerData?.stripeLoginLink && {
                  tab: "stripe",
                  label: "Stripe Dashboard",
                  icon: <FaStripe className="text-[#635bff]" />
                },
                { tab: "logout", label: "Logout", icon: <FiLogOut /> }
              ].filter(Boolean).map((item) => (
                <motion.li
                  key={item.tab}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 cursor-pointer rounded-xl flex items-center gap-3 transition-all ${activeTab === item.tab
                    ? 'bg-gradient-to-r from-[#FFAA5D]/10 to-[#E16A3D]/10 text-[#043E52] border border-[#016A6D]/20'
                    : 'hover:bg-[#016A6D]/5'
                    }`}
                  onClick={item.tab === "logout" ? logout : item.tab === "stripe" ? null : () => setActiveTab(item.tab)}
                >
                  <span className="text-[#FFAA5D]">{item.icon}</span>
                  {item.tab === "stripe" ? (
                    <a href={sellerData.stripeLoginLink} target="_blank" rel="noopener noreferrer" className="w-full">
                      {item.label}
                    </a>
                  ) : (
                    item.label
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white rounded-xl hover:shadow-lg transition-all"
              onClick={handleAddAccount}
            >
              <FiPlus />
              Add Product
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#016A6D] to-[#043E52] text-white rounded-xl hover:shadow-lg transition-all"
              onClick={() => navigate('/dashboard/products')}
            >
              <FiList />
              Show Products
            </motion.button>

            <Link
              to="/seller/bids"
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
              Switch to {userType === 'seller' ? 'Buyer' : 'Seller'}
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

        {activeTab === "dashboard" && renderDashboardContent()}
        {activeTab === "profile" && renderAccountContent()}
        {activeTab === "alerts" && renderAlertsContent()}
        {activeTab === "chats" && renderChatsContent()}

        {!userHaveStripeAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <div className="bg-white/90 rounded-2xl shadow-xl max-w-lg p-8 border border-[#016A6D]/20 relative">
              <button
                className="absolute top-4 right-4 text-[#043E52]/50 hover:text-[#E16A3D] transition-colors"
                onClick={() => setUserHaveStripeAccount(true)}
              >
                <FiX className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold text-[#043E52] mb-6">Connect with Stripe</h2>
              <div className="flex items-center justify-center">
                <StripeOnboardingButton className="bg-[#635bff] hover:bg-[#7a73ff] text-white px-6 py-3 rounded-xl transition-colors" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default SellerDashboard;