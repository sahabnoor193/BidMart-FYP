// src/components/Hero.jsx
import heroimage from "../assets/HeroSection.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/allproducts");
    } else {
      navigate("/signup");
    }
  };

  return (
    <section
      className="bg-black bg-cover bg-center "
      style={{
        backgroundImage:  `url(${heroimage})`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Discover the Best Deals on BidMart
        </h1>
        <p className="text-lg text-white mb-8">
          Explore a variety of products and place your bids with ease. Start
          buying and selling with confidence today!
        </p>
        <button 
          onClick={handleGetStarted}
          className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-opacity-90"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;

  
