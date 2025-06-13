// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const CancelPage = () => {
//   const navigate = useNavigate();

//   // Uncomment this block to enable redirection after 5 seconds
//   useEffect(() => {
//     const redirectTimer = setTimeout(() => {
//       navigate('/');
//     }, 5000);
//     return () => clearTimeout(redirectTimer);
//   }, [navigate]);

//   return (
//     <div className="w-full h-screen flex flex-col items-center justify-center text-red-600 text-center px-4">
//       {/* Cross Icon */}
//       <div className="inline-block w-14 h-14 border-[3px] border-red-600 rounded-full relative mb-4">
//         <div className="absolute w-[70%] h-[3px] bg-red-600 top-1/2 left-1/2 rotate-45 -translate-x-1/2 -translate-y-1/2" />
//         <div className="absolute w-[70%] h-[3px] bg-red-600 top-1/2 left-1/2 -rotate-45 -translate-x-1/2 -translate-y-1/2" />
//       </div>

//       <h1 className="text-2xl font-bold">Payment Unsuccessful!</h1>
//       <div className="text-4xl mt-2">☹️</div>
//     </div>
//   );
// };

// export default CancelPage;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home } from 'lucide-react'; // Using Lucide icons for a modern look

const CancelPage = () => {
  const navigate = useNavigate();

  // Redirect after 5 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#fef2f2] via-[#ffebeb] to-[#fffafa] flex flex-col items-center justify-center text-center p-4 font-sans"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-lg w-full"
      >
        {/* Animated Cross Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 text-red-500" // Tailwind color for red
        >
          <XCircle size={80} strokeWidth={1.5} /> {/* Larger Lucide X icon */}
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold mb-3 text-red-700" // Darker red for emphasis
        >
          Payment Failed!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed"
        >
          Unfortunately, your payment could not be processed. Please try again.
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-sm md:text-base text-gray-500 mb-6"
        >
          You will be redirected to the homepage in 5 seconds.
        </motion.p>

        {/* Home Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Go to Homepage
            <Home size={20} className="ml-2" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CancelPage;