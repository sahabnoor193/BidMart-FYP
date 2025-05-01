import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import AllProducts from './pages/AllProducts';
import Signup from './pages/SignUp';
import Signin from './pages/SignIn';
import FavouriteBids from './pages/FavouriteBids';
import ProductPage from './pages/ProductPage';
import OtpVerification from "./pages/OtpVerification";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import SellerProducts from "./pages/SellerProducts";
import EditProduct from "./pages/EditProduct";
import ContactForm from "./pages/ContactForm";
import FeedbackForm from "./pages/FeedbackForm";
import AboutUs from "./pages/AboutUs";
import FAQPage from "./pages/FAQPage";
import  socket  from './socket';
import GlobalAlertListener from './components/AlertListener';
import DashboardProduct from './pages/DashboardProduct';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsAuthenticated(true);
          // Store user type if needed
          localStorage.setItem('userType', decoded.type);
        } catch (error) {
          console.error('Token invalid:', error);
          clearAuth();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []); // ✅ Keep empty dependency array for initial check

  const clearAuth = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <main className="flex-grow mt-16"> {/* Add margin-top to main content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allproducts" element={<AllProducts />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/favouritebids" element={<FavouriteBids />} />
            {/* <Route path="/product" element={<ProductPage />} /> */}
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/seller-dashboard" element={isAuthenticated ? <SellerDashboard /> : <Navigate to="/signin" />} />
            <Route path="/buyer-dashboard" element={isAuthenticated ? <BuyerDashboard /> : <Navigate to="/signin" />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
            <Route path='/add-product' element={<AddProduct/>} />
            <Route path="/dashboard/products" element={<SellerProducts />} />
            <Route path="/dashboard/products/:id" element={<DashboardProduct />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/dashboard/products/edit/:productId" element={<EditProduct />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </main>
        <Footer />
        <GlobalAlertListener/>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;