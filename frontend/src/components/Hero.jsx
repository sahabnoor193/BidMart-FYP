import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const categories = ['phones', 'laptops', 'cameras'];

  const slides = [
    {
      category: 'phones',
      title: 'Next-Gen Smartphones',
      text: 'Experience cutting-edge mobile technology',
      cta: 'Shop Latest Phones',
      image: 'https://images.unsplash.com/photo-1605170439002-90845e8c0137'
    },
    {
      category: 'laptops',
      title: 'Premium Computing',
      text: 'Powerful laptops for work and play',
      cta: 'Explore Laptops',
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6'
    },
    {
      category: 'cameras',
      title: 'Capture Perfection',
      text: 'Professional photography gear',
      cta: 'Discover Cameras',
      image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/products" : "/signup");
  };

  return (
    <section className="relative bg-gradient-to-br from-[#043E52] to-[#016A6D] h-screen max-h-[800px] overflow-hidden">
      {/* Animated Circuit Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-12 bg-[#FFAA5D]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              rotate: Math.random() * 360
            }}
            animate={{
              opacity: [0, 0.4, 0],
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity
            }}
          />
        ))}
      </div>

      {/* Product Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center"
          >
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                {slides[activeSlide].title}
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-[#B2DFDB] mb-10 max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {slides[activeSlide].text}
              </motion.p>

              <motion.button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] hover:brightness-110 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto lg:mx-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {slides[activeSlide].cta} <FiArrowRight />
              </motion.button>
            </div>

            {/* Product Image */}
            <motion.div 
              className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <img
                src={slides[activeSlide].image}
                alt={slides[activeSlide].category}
                className="w-full h-full object-contain object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#043E52]/40 to-transparent" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeSlide === index 
                ? 'bg-[#FFAA5D] scale-125' 
                : 'bg-[#016A6D]/30 hover:bg-[#016A6D]/50'
            }`}
            aria-label={`View ${categories[index]}`}
          />
        ))}
      </div>

      {/* Trending Products Badge */}
      <motion.div 
        className="absolute top-6 right-6 bg-[#E16A3D] text-white px-4 py-2 rounded-full shadow-lg flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse" />
        <span className="font-bold">Trending Now:</span>
        <span className="ml-2">{slides[activeSlide].category}</span>
      </motion.div>
    </section>
  );
};

export default Hero;