import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BuyerBids = () => {
     const [buyerData, setBuyerData] = useState({
        requestedBids: 0,
        acceptedBids: 0,
        favourites: 0,
        bidHistory: []
      });
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    console.log('[Logout] Clearing local storage and redirecting');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/signin');
  }, [navigate]);
  const updateBidStatus = async (bidId) => {
    const loadingToast = toast.loading("Updating bid status...");
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.update(loadingToast, {
          render: "No auth token found.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
  
      const { data } = await axios.put(
        `http://localhost:5000/api/bids/${bidId}/status`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.update(loadingToast, {
        render: "Bid status updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
  
      return data;
  
    } catch (error) {
      console.error('Error Updating Bid:', error);
  
      toast.update(loadingToast, {
        render: "Failed to update bid status.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
  
      return null;
    }
  };
  
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
            
            

            console.log('Profile data:', profile);
            console.log('User stored in localStorage:', JSON.parse(localStorage.getItem('user')));
    
            setLoading(false);
          } catch (err) {
            console.error('[Fetch Error] Error fetching data:', err.response?.data || err.message);
            setError('Failed to load data. Please try again later.');
            if (err.response?.status === 401) {
              localStorage.removeItem('token');
            //   handleLogout();
            }
          }
        };
        
        fetchUserData();
      }, []);
    return (
        <div className="container mx-auto px-4 py-8">
                    <h2 className="text-xl font-bold mb-4">Bid History</h2>
        <div className="overflow-x-auto w-full ">
          <table className="w-full  border-collapse border">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left border">Item</th>
                <th className="py-2 px-4 text-left border">Bid Amount</th>
                <th className="py-2 px-4 text-left border">Payment Date</th>
                <th className="py-2 px-4 text-left border">Seller Profile</th>
                <th className="py-2 px-4 text-left border">Bid Status</th>
                <th className="py-2 px-4 text-left border">Actions</th>
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
                    <td className="p-2">{bid.bidStatus}</td>
                    <td>
                    
                       {bid.bidStatus === 'payment pending' ? (
                           <div className="p-3 flex gap-2 items-center">
                            <a href={bid.checkoutUrl} className="bg-green-600 p-3 text-white rounded">Pay</a>
                            <button className="bg-red-600 p-3 text-white rounded" onClick={() => updateBidStatus(bid.bidId)}>Reject Bid</button>
                           </div>
                       ):<p className="text-sm text-gray-500">No Action</p>} 
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
    )
}
export default BuyerBids