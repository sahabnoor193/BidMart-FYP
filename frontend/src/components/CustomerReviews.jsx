// src/components/Testimonials.jsx
const Testimonials = () => {
    const testimonials = [
      {
        id: 1,
        name: "John Doe",
        content: "Great platform for buying and selling electronics!"
      },
      // Add more testimonials...
    ]
  
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">What Our Customer Says</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                <h3 className="font-medium mb-2">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default Testimonials