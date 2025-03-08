import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import the icons you need
import { FaList, FaHistory, FaStar, FaExchangeAlt } from 'react-icons/fa';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState('seller'); // Add state for tracking user type
  
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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get stored user type if available
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }

    const fetchUserData = async () => {
      try {
        // Fetch dashboard data
        const dashboardResponse = await axios.get("http://localhost:5000/api/seller/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSellerData(dashboardResponse.data);
  
        // Fetch user profile separately
        const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const profile = profileResponse.data;
        setUserProfile({
          firstName: profile.name?.split(' ')[0] || '',
          lastName: profile.name?.split(' ')[1] || '',
          email: profile.email || '',
          address: profile.address || '',
          phone: profile.phone || '',
          city: profile.city || ''
        });
  
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Add handler for switching user type
  const handleSwitchUserType = async () => {
    const newUserType = userType === 'seller' ? 'buyer' : 'seller';
    try {
      const token = localStorage.getItem('token');
      await axios.put("http://localhost:5000/api/user/switch-role", 
        { newRole: newUserType },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setUserType(newUserType);
      localStorage.setItem('userType', newUserType);
      
      // Redirect to appropriate dashboard
      if (newUserType === 'buyer') {
        navigate('/buyer-dashboard');
      } else {
        // Refresh the current page to show seller dashboard
        window.location.reload();
      }
    } catch (err) {
      console.error('Error switching user type:', err);
      alert('Failed to switch user type. Please try again.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const profileData = {
        name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        // Remove email from payload
        address: userProfile.address,
        phone: userProfile.phone,
        city: userProfile.city
      };
      
      await axios.put("http://localhost:5000/api/user/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
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
      const passwordDataToSend = {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };
      
      const response = await axios.put("http://localhost:5000/api/user/password", passwordDataToSend, {
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
      console.error('Error changing password:', err);
      alert('Failed to change password. Please try again.');
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
      <div className="rounded-lg p-6 shadow-md bg-white">
        <div className="space-y-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {index % 2 === 0 ? 'Bid Accepted' : 'Bid Rejected'}
                    </p>
                    <span className="text-sm text-gray-500">12:34 PM</span>
                  </div>
                  <p className="text-gray-600">Context of the notification.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 mt-16">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 p-5 bg-gray-100">
        <div className="bg-gray-200 p-5 rounded-lg">
          <ul className="space-y-2">
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "dashboard" ? "bg-white" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "profile" ? "bg-white" : ""}`} onClick={() => setActiveTab("profile")}>Manage My Account</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "alerts" ? "bg-white" : ""}`} onClick={() => setActiveTab("alerts")}>My Alerts</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "logout" ? "bg-white" : ""}`} onClick={handleLogout}>LogOut</li>
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button 
            className="bg-red-600 text-white p-2 rounded cursor-pointer"
            onClick={() => setActiveTab("addProduct")}
          >
            Add product
          </button>
          <button 
            className="bg-red-600 text-white p-2 rounded cursor-pointer"
            onClick={() => setActiveTab("showProducts")}
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
      </div>
    </div>
  );
};

export default SellerDashboard;