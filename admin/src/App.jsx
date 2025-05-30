import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SideBar from './components/Admin_SideBar';
import Admin_Dashboard_Users from './pages/Admin_Dashboard_Users';
import Admin_Dashboard_Content from './pages/Admin-Dashboard-content';
import Product_Detail from './pages/Product_Detail';
import UserControl from './pages/UserControl';
import Products from './pages/Products';
import Testimonials from './pages/Testimonials';
import Testimonial_Details from './pages/Testimonial_Details';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './Components/PrivateRoute';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';

function AppWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('token');
      if (token) {
        try {
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Invalid token:', error);
          clearAuth();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Checking auth...</div>;

  return (
    <>
      {!isLoginPage && isAuthenticated && <Navbar />}
      <div className={!isLoginPage && isAuthenticated ? 'flex' : ''}>
        {!isLoginPage && isAuthenticated && <SideBar />}
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/" />} />
          <Route path="/" element={<Navigate to="/Dashboard" replace />} />
          <Route path="/Dashboard" element={<PrivateRoute isAuthenticated={isAuthenticated}><Admin_Dashboard_Content /></PrivateRoute>} />
          <Route path="/Users" element={<PrivateRoute isAuthenticated={isAuthenticated}><Admin_Dashboard_Users /></PrivateRoute>} />
          <Route path="/Product_Detail" element={<PrivateRoute isAuthenticated={isAuthenticated}><Product_Detail /></PrivateRoute>} />
          <Route path="/User-Control" element={<PrivateRoute isAuthenticated={isAuthenticated}><UserControl /></PrivateRoute>} />
          <Route path="/Products" element={<PrivateRoute isAuthenticated={isAuthenticated}><Products /></PrivateRoute>} />
          <Route path="/Testimonials" element={<PrivateRoute isAuthenticated={isAuthenticated}><Testimonials /></PrivateRoute>} />
          <Route path="/Testimonial_Details" element={<PrivateRoute isAuthenticated={isAuthenticated}><Testimonial_Details /></PrivateRoute>} />
          <Route path='/payments' element={<PrivateRoute isAuthenticated={isAuthenticated}><Payments/></PrivateRoute>} />
          <Route path='/paymentsDetails' element={<PrivateRoute isAuthenticated={isAuthenticated}><PaymentDetails/></PrivateRoute>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
