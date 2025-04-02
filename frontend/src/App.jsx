// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from "react";
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Footer from './components/Footer';
// import AllProducts from './pages/AllProducts';
// import Signup from './pages/SignUp';
// import Signin from './pages/SignIn';
// import FavouriteBids from './pages/FavouriteBids';
// import ProductPage from './pages/ProductPage';
// import OtpVerification from "./pages/OtpVerification";
// import Dashboard from "./pages/Dashboard";
// import SellerDashboard from "./pages/SellerDashboard";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in (token exists in localStorage)
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Show a loading indicator while checking authentication
//   }

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/allproducts" element={<AllProducts />} />
//             <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
//             <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
//             <Route path="/favouritebids" element={<FavouriteBids />} />
//             <Route path="/product" element={<ProductPage />} />
//             <Route path="/otp-verification" element={<OtpVerification />} />
//             <Route path="/seller-dashboard" element={isAuthenticated ? <SellerDashboard /> : <Navigate to="/signin" />} />
//             <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
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
    
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/allproducts" element={<AllProducts />} />
              <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/favouritebids" element={<FavouriteBids />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/otp-verification" element={<OtpVerification />} />
              <Route path="/seller-dashboard" element={isAuthenticated ? <SellerDashboard /> : <Navigate to="/signin" />} />
              <Route path="/buyer-dashboard" element={isAuthenticated ? <BuyerDashboard /> : <Navigate to="/signin" />} />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    
  );
}

export default App;