import ProductCard from './ProductCard';

const LatestBids = () => {
  const products = [
    {
      id: 1,
      name: 'RGB Gaming Keyboard',
      price: 299,
      image: '/keyboard.jpg',
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      price: 49,
      image: '/mouse.jpg',
    },
    {
      id: 3,
      name: 'Gaming Chair',
      price: 199,
      image: '/chair.jpg',
    },
    {
      id: 4,
      name: 'HD Webcam',
      price: 99,
      image: '/webcam.jpg',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Latest Bids</h2>
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
      </div>
    </section>
  );
};

export default LatestBids;
