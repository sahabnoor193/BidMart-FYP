// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllProducts from './pages/AllProducts'
import Signup from './pages/SignUp'
import SignIn from './pages/SignIn'
import FavouriteBids from './pages/FavouriteBids'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allproducts" element={<AllProducts/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/favouritebids" element={<FavouriteBids />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App