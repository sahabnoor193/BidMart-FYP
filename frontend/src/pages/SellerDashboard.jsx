import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// Import the icons you need
import { FaList, FaHistory, FaStar, FaExchangeAlt, FaTimes, FaPlus, FaEdit, FaTrash, FaSave, FaHeart } from 'react-icons/fa';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState('seller'); // Add state for tracking user type
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [sellerData, setSellerData] = useState({
    activeBids: 0,
    endedBids: 0,
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
    city: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

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
    console.log('[Auth Check] Checking authentication status');
    if (!token) {
      console.warn('[Auth Redirect] No token found, redirecting to login');
      navigate('/login');
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
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/signin', { replace: true });
  };

  const handleSwitchUserType = async () => {
    console.log('[Switch Account] Initiating account switch');
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
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

      // Replace the entire user object in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));

        window.location.href = `/${response.data.userType}-dashboard`;
      } else {
        console.log('[Switch Account] No existing account found, prompting for new account creation');
        const createNewAccount = window.confirm(`No ${newType} account found. Do you want to create a new ${newType} account?`);
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
      console.error('[Switch Error] Account switch failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Account switch failed');
    }
  };

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

  const getAlertIcon = (action) => {
    switch (action) {
      case 'added':
        return <FaPlus className="text-green-500" />;
      case 'edited':
        return <FaEdit className="text-blue-500" />;
      case 'deleted':
        return <FaTrash className="text-red-500" />;
      case 'draft':
        return <FaSave className="text-yellow-500" />;
      case 'favorited':
        return <FaHeart className="text-pink-500" />;
      case 'ended':
        return <FaExchangeAlt className="text-orange-500" />;
      default:
        return <FaStar className="text-gray-500" />;
    }
  };

  const getAlertMessage = (action, productName) => {
    switch (action) {
      case 'added':
        return `New product "${productName}" has been added`;
      case 'edited':
        return `Product "${productName}" has been edited`;
      case 'deleted':
        return `Product "${productName}" has been deleted`;
      case 'draft':
        return `Product "${productName}" has been saved as draft`;
      case 'favorited':
        return `Product "${productName}" has been added to favorites`;
      case 'ended':
        return `Your product "${productName}" has ended`;
      case 'new-bid':
        return  `A new bid has been placed on your product "${productName}"`;
      default:
        return '';
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
    return (
      <div className="rounded-lg p-6 shadow-md bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="mr-3">
                <FaList className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Active bids</h3>
                <p className="text-2xl font-bold">{sellerData.activeBids}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="mr-3">
                <FaHistory className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Ended bids</h3>
                <p className="text-2xl font-bold">{sellerData.endedBids}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="mr-3">
                <FaStar className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Favourites</h3>
                <p className="text-2xl font-bold">{sellerData.favourites}</p>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Bid History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left border">Items</th>
                <th className="py-2 px-4 text-left border">Bid Start</th>
                <th className="py-2 px-4 text-left border">Bid End</th>
                <th className="py-2 px-4 text-left border">Time</th>
                <th className="py-2 px-4 text-left border">Sell</th>
              </tr>
            </thead>
            <tbody>
              {sellerData.bidHistory && sellerData.bidHistory.length > 0 ? (
                sellerData.bidHistory.map((bid, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 border">{bid.item}</td>
                    <td className="py-2 px-4 border">${bid.startPrice}</td>
                    <td className="py-2 px-4 border">${bid.currentPrice}</td>
                    <td className="py-2 px-4 border">{new Date(bid.bidTime).toLocaleString()}</td>
                    <td className="py-2 px-4 border">{bid.sold ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500 border">
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
            {/* Email Field - Read Only */}
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
            {/* Address Field */}
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

          {/* Add Phone and City Fields */}
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
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Alerts</h2>
          {unreadAlerts > 0 && (
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              {unreadAlerts} unread
            </span>
          )}
        </div>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <FaStar className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500">No alerts yet</p>
          </div>
        ) : (
        <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  !alert.read ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      !alert.read ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {getAlertIcon(alert.action)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {getAlertMessage(alert.action, alert.productName)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.read && (
                      <button
                        onClick={() => handleMarkAlertAsRead(alert._id)}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveAlert(alert._id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
      </div>
    );
  };

  // Replace the existing useEffect for fetching conversations with:
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
        
        if (!user || !user.id) {
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
  }, [activeTab]); // Add activeTab to dependency array
  
  const renderChatsContent = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User from localStorage:', JSON.parse(localStorage.getItem('user')));

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
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
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
          {conversations.map(conversation => (
            <div
              key={conversation._id}
              onClick={() => {
                setSelectedConversation(conversation._id);
                fetchMessages(conversation._id);
              }}
              className={`p-3 cursor-pointer rounded-lg mb-2 ${
                selectedConversation === conversation._id 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">
                {conversation.participants
                  .filter(p => p._id !== user._id)
                  .map(p => p.name)
                  .join(', ')}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {conversation.lastMessage}
              </div>
            </div>
          ))}
        </div>
  
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="flex-1 overflow-y-auto mb-4">
                {messages.map(message => (
                  <div
                    key={message._id}
                    className={`mb-4 ${message.senderId === user._id ? 'text-right' : 'text-left'}`}
                  >
                    <div className={`inline-block p-2 rounded-lg ${
                      message.senderId === user._id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200'
                    }`}>
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 p-5 bg-gray-100">
        <div className="bg-gray-200 p-5 rounded-lg">
          <ul className="space-y-2">
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "dashboard" ? "bg-white" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "profile" ? "bg-white" : ""}`} onClick={() => setActiveTab("profile")}>Manage My Account</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "alerts" ? "bg-white" : ""}`} onClick={() => setActiveTab("alerts")}>My Alerts</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "chats" ? "bg-white" : ""}`} onClick={() => setActiveTab("chats")}>My Chats</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "logout" ? "bg-white" : ""}`} onClick={handleLogout}>LogOut</li>
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button 
            className="bg-red-600 text-white p-2 rounded cursor-pointer"
            // onClick={() => setActiveTab("addProduct")}
            onClick={() => navigate('/add-product')}
          >
            Add product
          </button>
          <button 
            className="bg-red-600 text-white p-2 rounded cursor-pointer"
            onClick={() => navigate('/dashboard/products')}
          >
            Show Products
          </button>
        </div>
        
        {/* Add the new Switch Role button */}
        <div className="mt-4">
          <button 
            className="bg-blue-600 text-white p-2 rounded cursor-pointer w-full flex items-center justify-center"
            onClick={handleSwitchUserType}
          >
            <FaExchangeAlt className="mr-2" />
            Switch to {userType === 'seller' ? 'Buyer' : 'Seller'} Role
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-5">
        <div className="mb-6">
          <div className="text-red-600 font-bold text-lg">
            Home / DashBoard
          </div>
        </div>
        {activeTab === "dashboard" && renderDashboardContent()}
        {activeTab === "profile" && renderAccountContent()}
        {activeTab === "alerts" && renderAlertsContent()}
        {activeTab === "chats" && renderChatsContent()}
      </div>
    </div>
  );
};

export default SellerDashboard;