// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from "react";
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllProducts from './pages/AllProducts'
import Signup from './pages/SignUp'
import Signin from './pages/SignIn'
import FavouriteBids from './pages/FavouriteBids'
import ProductPage from './pages/ProductPage'
import OtpVerification from "./pages/OtpVerification";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // ✅ Check if user is logged in (token exists in localStorage)
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allproducts" element={<AllProducts/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/favouritebids" element={<FavouriteBids />} />
            <Route path="/product" element={<ProductPage/>} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App