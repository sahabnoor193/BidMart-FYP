import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaList, FaCheckCircle, FaStar, FaExchangeAlt } from 'react-icons/fa';

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState('buyer');
  const [buyerData, setBuyerData] = useState({
    requestedBids: 0,
    acceptedBids: 0,
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

    const fetchUserData = async () => {
      try {
        const dashboardResponse = await axios.get("http://localhost:5000/api/buyer/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBuyerData(dashboardResponse.data);

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
    // const handleSwitchUserType = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const userEmail = localStorage.getItem('userEmail');
    //     const currentType = localStorage.getItem('userType');
    //     const newType = currentType === 'buyer' ? 'seller' : 'buyer';
    
    //     // Check if opposite account exists
    //     const response = await axios.put(
    //       "http://localhost:5000/api/user/switch-account",
    //       {},
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );
    
    //     if (response.data.exists) {
    //       // Switch to existing account
    //       localStorage.setItem('token', response.data.token);
    //       localStorage.setItem('userType', response.data.userType);
    //       window.location.href = `/${response.data.userType}-dashboard`;
    //     } else {
    //       // Ask user if they want to create a new account
    //       const createNewAccount = window.confirm(`No ${newType} account found. Do you want to create a new ${newType} account?`);
    //       if (createNewAccount) {
    //         // Fetch current user profile
    //         const profileResponse = await axios.get("http://localhost:5000/api/user/profile", {
    //           headers: { Authorization: `Bearer ${token}` }
    //         });
    
    //         const profile = profileResponse.data;
    
    //         // Create new account with opposite type
    //         const registrationResponse = await axios.post("http://localhost:5000/api/auth/register", {
    //           name: profile.name,
    //           email: profile.email,
    //           password: 'defaultPassword123', // You might want to handle password securely
    //           type: newType
    //         });
    
    //         if (registrationResponse.data.message) {
    //           alert('Account created successfully. Please check your email for verification.');
    
    //           // Store account information in local storage
    //           localStorage.setItem('email', profile.email);
    //           localStorage.setItem('name', profile.name);
    //           localStorage.setItem('password', 'defaultPassword123');
    //           localStorage.setItem('type', newType);
    
    //           // Log out the current user
    //           localStorage.removeItem('token');
    //           localStorage.removeItem('userEmail');
    //           localStorage.removeItem('userType');
    //           localStorage.removeItem('userName');
    
    //           // Redirect to verification page
    //           navigate('/otp-verification');
    //         } else {
    //           alert('Failed to create account. Please try again.');
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     console.error('Switch error:', err);
    //     alert(err.response?.data?.message || 'Account switch failed');
    //   }
    // };


    const handleSwitchUserType = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
    
        // Check if opposite account exists
        const response = await axios.put(
          "http://localhost:5000/api/user/switch-account",
          {},
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
    
        if (response.data.exists) {
          // Store ALL the data returned from backend
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', response.data.userType);
          
          // Clear any old data that might conflict
          localStorage.removeItem('type'); // Remove old key if exists
          
          // Redirect with page reload to ensure all data refreshes
          window.location.href = `/${response.data.userType}-dashboard`;
          return;
        }
    
        // Handle account creation flow
        const currentType = localStorage.getItem('userType');
        const newType = currentType === 'buyer' ? 'seller' : 'buyer';
        
        const createNewAccount = window.confirm(
          `No ${newType} account found. Do you want to create a new ${newType} account?`
        );
    
        if (createNewAccount) {
          // Get current user profile with proper error handling
          const profileResponse = await axios.get(
            "http://localhost:5000/api/user/profile", 
            { headers: { Authorization: `Bearer ${token}` } }
          );
    
          const { name, email } = profileResponse.data;
    
          // Create new account - consider a separate endpoint for this
          await axios.post("http://localhost:5000/api/auth/register", {
            name,
            email,
            password: 'defaultPassword123', // In production, handle this differently
            type: newType
          });
    
          alert('Account created successfully. Please verify your email.');
          
          // Clear all existing auth data
          localStorage.clear();
          
          // Redirect to login/verification
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Switch error:', err);
        
        // More detailed error message
        const errorMessage = err.response?.data?.message || 
                             err.response?.data?.error ||
                             err.message || 
                             'Account switch failed';
        
        alert(`Error: ${errorMessage}`);
        
        // If token is invalid, force logout
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
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
              <FaList className="text-gray-600 mr-3" size={20} />
              <div>
                <h3 className="font-semibold">Requested Bids</h3>
                <p className="text-2xl font-bold">{buyerData.requestedBids}</p>
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
                        <div className="flex items-center">
                        <img 
                            src={bid.sellerAvatar || '/default-avatar.png'} 
                            alt="Seller" 
                            className="h-8 w-8 rounded-full mr-2"
                        />
                        <div>
                            <p className="font-medium">{bid.sellerName}</p>
                            <p className="text-sm text-gray-500">{bid.sellerEmail}</p>
                        </div>
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
    
  // Modified sidebar (remove product buttons)
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 mt-16">
      <div className="w-full md:w-1/4 p-5 bg-gray-100">
        <div className="bg-gray-200 p-5 rounded-lg">
        <ul className="space-y-2">
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "dashboard" ? "bg-white" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "profile" ? "bg-white" : ""}`} onClick={() => setActiveTab("profile")}>Manage My Account</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "alerts" ? "bg-white" : ""}`} onClick={() => setActiveTab("alerts")}>My Alerts</li>
            <li className={`p-2 cursor-pointer rounded-lg ${activeTab === "logout" ? "bg-white" : ""}`} onClick={handleLogout}>LogOut</li>
          </ul>
        </div>
        
        {/* Role switch button */}
        <div className="mt-4">
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
        
        {activeTab === "dashboard" && renderDashboardContent()}
        {activeTab === "profile" && renderAccountContent()}
        {activeTab === "alerts" && renderAlertsContent()}
      </div>
    </div>
  );
};

export default BuyerDashboard;