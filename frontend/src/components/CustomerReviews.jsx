const Testimonials = () => {
  const testimonials = [
    {
      name: 'Jane Doe',
      feedback:
        'BidMart has revolutionized how I shop online. The bidding feature is exciting and user-friendly!',
      image: '/user1.jpg',
    },
    {
      name: 'John Smith',
      feedback:
        'The best platform for finding unique items at great prices. Highly recommended!',
      image: '/user2.jpg',
    },
    {
      name: 'Alice Johnson',
      feedback:
        'Excellent customer service and an intuitive interface. BidMart is my go-to shopping site.',
      image: '/user3.jpg',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Testimonials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-800 text-center">
                {testimonial.name}
              </h3>
              <p className="text-gray-600 mt-2 text-center">
                "{testimonial.feedback}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
