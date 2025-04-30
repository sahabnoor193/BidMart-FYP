// import { useState, useEffect, useRef } from 'react';

// const Testimonials = () => {
//   const [currentIndex, setCurrentIndex] = useState(3); // Start at the first real testimonial
//   const timeoutRef = useRef(null);

//   const testimonials = [
//     {
//       name: 'Name1',
//       profilePic: '/path-to-image1.jpg',
//       rating: 4.5,
//       paragraph: 'A paragraph of text with an unassigned link',
//       secondRow: 'A row of text with a web link',
//       icon: '🔴',
//       additionalText: 'inline with text',
//     },
//     {
//       name: 'Name2',
//       profilePic: '/path-to-image2.jpg',
//       rating: 5,
//       paragraph: 'A paragraph of text with an unassigned link',
//       secondRow: 'A second row of text with a web link',
//       icon: '🔴',
//       additionalText: 'inline with text',
//     },
//     {
//       name: 'Name3',
//       profilePic: '/path-to-image3.jpg',
//       rating: 4,
//       paragraph: 'A paragraph of text with an unassigned link',
//       secondRow: 'A second row of text with a web link',
//       icon: '🔴',
//       additionalText: 'inline with text',
//     },
//     {
//       name: 'Name 4',
//       profilePic: '/path-to-image4.jpg',
//       rating: 4.5,
//       paragraph: 'A paragraph of text with an unassigned link',
//       secondRow: 'A second row of text with a web link',
//       icon: '🔴',
//       additionalText: 'inline with text',
//     },
//     {
//       name: 'Name 5',
//       profilePic: '/path-to-image5.jpg',
//       rating: 5,
//       paragraph: 'A paragraph of text with an unassigned link',
//       secondRow: 'A second row of text with a web link',
//       icon: '🔴',
//       additionalText: 'inline with text',
//     },
//   ];

//   // Extend the testimonials array for looping
//   const extendedTestimonials = [
//     ...testimonials.slice(-3),
//     ...testimonials,
//     ...testimonials.slice(0, 3),
//   ];

//   const resetTimeout = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//   };

//   useEffect(() => {
//     resetTimeout();
//     timeoutRef.current = setTimeout(() => {
//       setCurrentIndex((prevIndex) => prevIndex + 1);
//     }, 3000);

//     return () => {
//       resetTimeout();
//     };
//   }, [currentIndex]);

//   // Handle seamless loop
//   useEffect(() => {
//     if (currentIndex === 0) {
//       setTimeout(() => {
//         setCurrentIndex(testimonials.length);
//       }, 500); // Smoothly jump to the end
//     } else if (currentIndex === extendedTestimonials.length - 1) {
//       setTimeout(() => {
//         setCurrentIndex(testimonials.length - 1);
//       }, 500); // Smoothly jump to the beginning
//     }
//   }, [currentIndex, testimonials.length, extendedTestimonials.length]);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => prevIndex + 1);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => prevIndex - 1);
//   };

//   const StarRating = ({ rating }) => {
//     return (
//       <div className="flex items-center gap-1 mb-2">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <svg
//             key={star}
//             className={`w-4 h-4 ${
//               star <= rating ? 'text-yellow-400' : 'text-gray-300'
//             }`}
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <section className="pb-12 bg-white overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-2xl font-bold text-black flex items-center mb-6">
//           <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
//           Customer
//         </h2>
//         <h1 className="text-3xl font-bold text-red-500 mb-12">
//           What Our Customer Says
//         </h1>

//         <div className="relative">
//           <div className="overflow-hidden">
//             <div
//               className="flex transition-transform duration-500 ease-in-out"
//               style={{
//                 transform: `translateX(-${currentIndex * (100 / 3)}%)`,
//               }}
//             >
//               {extendedTestimonials.map((testimonial, index) => (
//                 <div
//                   key={index}
//                   className="w-full min-w-[100%] px-3 sm:min-w-[50%] lg:min-w-[33.333%]"
//                 >
//                   <div className="relative p-6 pt-12 mt-8 border rounded-lg bg-white">
//                     <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16">
//                       <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden">
//                         <img
//                           src={testimonial.profilePic}
//                           alt={`${testimonial.name}'s profile`}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.src =
//                               'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23D1D5DB"/></svg>';
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <div className="mt-4">
//                       <h4 className="text-lg font-medium text-center mb-2">
//                         {testimonial.name}
//                       </h4>
//                       <div className="flex justify-center">
//                         <StarRating rating={testimonial.rating} />
//                       </div>
//                       <p className="text-red-500">
//                         <span className="text-black">{testimonial.paragraph}</span>{' '}
//                         <a href="#" className="text-blue-500 underline">
//                           unassigned link
//                         </a>
//                       </p>
//                       <p className="text-red-500">
//                         <span className="text-black">{testimonial.secondRow}</span>{' '}
//                         <a href="#" className="text-blue-500 underline">
//                           web link
//                         </a>
//                       </p>
//                       <p className="text-red-500">
//                         <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-1"></span>
//                         {testimonial.additionalText}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-center mt-6 gap-4">
//             <button
//               className="p-2 border rounded-full hover:bg-gray-100"
//               onClick={prevSlide}
//               aria-label="Previous slide"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <button
//               className="p-2 border rounded-full hover:bg-gray-100"
//               onClick={nextSlide}
//               aria-label="Next slide"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @media (max-width: 640px) {
//           .min-w-[100%] {
//             min-width: 100%;
//           }
//         }
//         @media (min-width: 641px) and (max-width: 1024px) {
//           .min-w-[50%] {
//             min-width: 50%;
//           }
//         }
//         @media (min-width: 1025px) {
//           .min-w-[33.333%] {
//             min-width: 33.333%;
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Testimonials;
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Testimonials() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedback/approved");
        setFeedback(response.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load testimonials");
        toast.error("Failed to load testimonials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!feedback || feedback.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
        <div className="text-center text-gray-500">No testimonials available yet.</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {feedback.map((fb, index) => (
          <div key={index} className="bg-white shadow rounded p-4">
            <p className="text-yellow-500">{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</p>
            <p className="italic">&ldquo;{fb.comment}&rdquo;</p>
            <p className="mt-2 font-semibold">– {fb.name || "Anonymous"} ({fb.role})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
