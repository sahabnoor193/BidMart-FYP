// src/components/Hero.jsx
const Hero = () => {
    return (
      <div className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
              src="/apple-logo.svg"
              alt="Apple Logo"
              className="h-12 mx-auto mb-6"
            />
            <h2 className="text-2xl mb-4">iPhone 14 Series</h2>
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Bid, Buy, Sell – All in Real Time!
            </h1>
            <button className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition">
              Get Start
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default Hero