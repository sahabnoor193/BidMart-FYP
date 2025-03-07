// // import { useSearchParams, useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";

// // const SelectAccount = () => {
// //   const [searchParams] = useSearchParams();
// //   const [formData, setFormData] = useState({ name: "", email: "" });
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetch("http://localhost:5000/api/auth/session-data", { credentials: "include" })
// //       .then(res => res.json())
// //       .then(data => {
// //         if (data.email) {
// //           setFormData({ name: data.name, email: data.email });
// //         } else {
// //           // Fallback to query parameters
// //           setFormData({
// //             name: searchParams.get("name") || "",
// //             email: searchParams.get("email") || ""
// //           });
// //         }
// //       });
// //   }, [searchParams]);

// //   const handleAccountType = async (type) => {
// //     try {
// //       const response = await fetch("http://localhost:5000/api/auth/register-google", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ ...formData, type }),
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         localStorage.setItem("token", data.token);
// //         navigate("/dashboard");
// //       } else {
// //         alert(data.message || "Signup failed");
// //       }
// //     } catch (error) {
// //       console.error("Error:", error);
// //       alert("An error occurred");
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center h-screen">
// //       <h2 className="text-2xl font-bold mb-4">Sign up as a</h2>
// //       <button onClick={() => handleAccountType("buyer")} className="bg-blue-500 text-white px-6 py-3 rounded mb-2">Buyer</button>
// //       <button onClick={() => handleAccountType("seller")} className="bg-green-500 text-white px-6 py-3 rounded">Seller</button>
// //     </div>
// //   );
// // };

// // export default SelectAccount;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaList, FaBookmark, FaHistory } from 'react-icons/fa';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sellerData, setSellerData] = useState({
    activeBids: 0,
    endedBids: 0,
    favourites: 0,
    bidHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Get user profile data
        const profileResponse = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profileData = await profileResponse.json();
        setUserProfile(profileData);

        // Get dashboard data
        const dashboardResponse = await fetch("http://localhost:5000/api/seller/dashboard", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardData = await dashboardResponse.json();
        setSellerData(dashboardData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching seller data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    
    // Call logout API
    fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    }).catch(err => console.error("Logout error:", err));
    
    navigate('/login');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userProfile)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const renderDashboardContent = () => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
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
          
          <div className="bg-gray-100 p-4 rounded-lg">
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
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="mr-3">
                <FaBookmark className="text-gray-600" size={20} />
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Items</th>
                <th className="py-2 px-4 text-left">Bid Start</th>
                <th className="py-2 px-4 text-left">Bid End</th>
                <th className="py-2 px-4 text-left">Time</th>
                <th className="py-2 px-4 text-left">Sell</th>
              </tr>
            </thead>
            <tbody>
              {sellerData.bidHistory && sellerData.bidHistory.length > 0 ? (
                sellerData.bidHistory.map((bid, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{bid.item}</td>
                    <td className="py-2 px-4">${bid.startPrice}</td>
                    <td className="py-2 px-4">${bid.currentPrice}</td>
                    <td className="py-2 px-4">{new Date(bid.bidTime).toLocaleString()}</td>
                    <td className="py-2 px-4">{bid.sold ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
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
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">Edit Your Profile</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleProfileUpdate}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={userProfile.name || ''}
              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={userProfile.phone || ''}
              onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={userProfile.email || ''}
              onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
              disabled
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={userProfile.city || ''}
              onChange={(e) => setUserProfile({...userProfile, city: e.target.value})}
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={userProfile.address || ''}
              onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
            />
          </div>
          
          <div className="col-span-2">
            <h3 className="font-medium mb-2">Password Changes</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          
          <div className="col-span-2 flex justify-end space-x-3 mt-4">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderAlertsContent = () => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">My Alerts</h2>
        <div className="space-y-4">
          {sellerData.notifications && sellerData.notifications.length > 0 ? (
            sellerData.notifications.map((notification, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {notification.type === 'accept' ? 'Bid Accepted' : 'Bid Rejected'}
                      </p>
                      <span className="text-sm text-gray-500">
                        {new Date(notification.time).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            Array(6).fill(0).map((_, index) => (
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
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="text-red-500 font-bold">
              <span className="mr-2">Home</span> / <span className="ml-2">DashBoard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-200 rounded-lg p-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 ${
                  activeTab === 'dashboard' ? 'bg-white font-bold' : 'hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 ${
                  activeTab === 'account' ? 'bg-white font-bold' : 'hover:bg-gray-100'
                }`}
              >
                Manage My Account
              </button>
              
              <button
                onClick={() => setActiveTab('alerts')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 ${
                  activeTab === 'alerts' ? 'bg-white font-bold' : 'hover:bg-gray-100'
                }`}
              >
                My Alerts
              </button>
              
              <button
                onClick={handleLogout}
                className={`w-full text-left py-3 px-4 rounded-lg ${
                  activeTab === 'logout' ? 'bg-white font-bold' : 'hover:bg-gray-100'
                }`}
              >
                LogOut
              </button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button 
                onClick={() => navigate('/add-product')}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
              >
                <FaPlus className="mr-2" size={14} /> Add product
              </button>
              <button 
                onClick={() => navigate('/products')}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
              >
                <FaList className="mr-2" size={14} /> Show Products
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="bg-white rounded-lg p-6 shadow-md flex justify-center items-center h-64">
                <p>Loading dashboard data...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboardContent()}
                {activeTab === 'account' && renderAccountContent()}
                {activeTab === 'alerts' && renderAlertsContent()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;