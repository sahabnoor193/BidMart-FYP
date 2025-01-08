import ProductCard from './ProductCard';

const LatestBids = () => {
  const products = [
    {
      id: 1,
      name: 'RGB Gaming Keyboard',
      price: 20,
      image: '/keyboard.jpg',
    },
    {
      id: 2,
      name: 'Gaming Monitor',
      price: 20,
      image: '/monitor.jpg',
    },
    {
      id: 3,
      name: 'Gaming Controller',
      price: 20,
      image: '/controller.jpg',
    },
    {
      id: 4,
      name: 'RGB Cooler',
      price: 20,
      image: '/cooler.jpg',
    },
  ];

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black mb-1">
            Empowering Real-Time Connections
          </h1>
          <p className="text-sm text-gray-600">
            Seamless Buying, Bidding, and Support with BidMart
          </p>
        </div>

        {/* Latest Bids Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-black flex items-center">
            <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
            Latest Bids
          </h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              &lt;
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded shadow-lg">
            View All Products
          </button>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="flex justify-center mt-8">
        <hr
          className="border-black w-11/12 border-2"
          style={{ margin: '0 auto' }}
        />
      </div>
    </section>
  );
};

export default LatestBids;
