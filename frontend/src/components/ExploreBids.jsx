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
    <section className="pb-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Latest Bids Section */}
        <h2 className="text-2xl font-bold text-black flex items-center mb-4">
            <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
            Explore Bids
        </h2>
        <h1 className="text-3xl font-bold text-red-500 mb-6">
          Browse All The Bids
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded shadow-lg">
            View All Bids
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
