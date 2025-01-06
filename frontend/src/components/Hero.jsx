// src/components/Hero.jsx

const Hero = () => {
  return (
    <section
      className="bg-black bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/HeroSection.png')",
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
        <button className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-opacity-90">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;

  