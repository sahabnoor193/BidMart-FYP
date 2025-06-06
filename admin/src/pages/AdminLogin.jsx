// // import { useState } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';

// // export default function AdminLogin() {
// //   const [form, setForm] = useState({ userName: '', password: '' });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };
// //   const navigate = useNavigate();
// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');
// //     setSuccess('');

// //     try {
// //       const res = await axios.post('http://localhost:5000/api/admin/login', form);
// //       setSuccess('Login successful!');
// //       localStorage.setItem('adminToken', res.data.token);
// //       navigate('/Dashboard');
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Login failed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center px-4">
// //       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
// //         <h2 className="text-3xl font-extrabold text-center text-gray-800">Admin Login</h2>
// //         <form onSubmit={handleLogin} className="space-y-5">
// //           <div>
// //             <label htmlFor="userName" className="block text-sm font-medium text-gray-600">
// //               Username
// //             </label>
// //             <input
// //               type="text"
// //               name="userName"
// //               value={form.userName}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
// //               required
// //             />
// //           </div>
// //           <div>
// //             <label htmlFor="password" className="block text-sm font-medium text-gray-600">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               name="password"
// //               value={form.password}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
// //               required
// //             />
// //           </div>
// //           {error && <p className="text-sm text-red-600">{error}</p>}
// //           {success && <p className="text-sm text-green-600">{success}</p>}
// //           <button
// //             type="submit"
// //             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition duration-300"
// //             disabled={loading}
// //           >
// //             {loading ? 'Logging in...' : 'Login'}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FiUser, FiLock } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// export default function AdminLogin() {
//   const [form, setForm] = useState({ userName: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.5 } }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const res = await axios.post('http://localhost:5000/api/admin/login', form);
//       setSuccess('Login successful!');
//       localStorage.setItem('adminToken', res.data.token);
//       navigate('/Dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif flex items-center justify-center px-4"
//     >
//       <div className="max-w-6xl mx-auto w-full">
//         <motion.div
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.8 }}
//           className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8 mx-4"
//         />

//         <motion.div
//           variants={itemVariants}
//           className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-[#016A6D]/20"
//         >
//           <h2 className="text-3xl font-bold text-center text-[#043E52] mb-8">
//             Admin Portal
//           </h2>
          
//           <form onSubmit={handleLogin} className="space-y-6">
//             <motion.div variants={itemVariants}>
//               <div className="relative">
//                 <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                 <input
//                   type="text"
//                   name="userName"
//                   value={form.userName}
//                   onChange={handleChange}
//                   placeholder="Username"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                   required
//                 />
//               </div>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <div className="relative">
//                 <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
//                 <input
//                   type="password"
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Password"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
//                   required
//                 />
//               </div>
//             </motion.div>

//             {error && (
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="p-3 bg-[#E16A3D]/10 text-[#E16A3D] rounded-lg"
//               >
//                 ⚠️ {error}
//               </motion.div>
//             )}

//             {success && (
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="p-3 bg-[#016A6D]/10 text-[#016A6D] rounded-lg"
//               >
//                 ✅ {success}
//               </motion.div>
//             )}

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <div className="h-4 w-4 border-2 border-current rounded-full animate-spin" />
//               ) : (
//                 'Login'
//               )}
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        when: "beforeChildren"
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form);
      setSuccess('Login successful! Redirecting...');
      localStorage.setItem('adminToken', res.data.token);
      setTimeout(() => navigate('/Dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-[#f5f9fa] font-serif flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full mx-4">
        {/* Decorative Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        <motion.div
          variants={itemVariants}
          className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#016A6D]/10 hover:shadow-2xl transition-shadow"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-[#043E52] mb-2">
              Admin Portal
            </h2>
            <p className="text-[#043E52]/80">Secure access to your dashboard</p>
          </motion.div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="userName" className="block text-sm font-medium text-[#043E52]/80 mb-1">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] focus:border-transparent text-[#043E52] placeholder-[#043E52]/40"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-[#043E52]/80 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] focus:border-transparent text-[#043E52] placeholder-[#043E52]/40"
                  required
                />
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-[#E16A3D]/10 text-[#E16A3D] rounded-lg flex items-start gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-[#016A6D]/10 text-[#016A6D] rounded-lg flex items-start gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
              </motion.div>
            )}

            <motion.button
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(225, 106, 61, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] hover:from-[#FFAA5D]/90 hover:to-[#E16A3D]/90 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Continue <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center text-sm text-[#043E52]/70"
        >
          <p>Secure admin portal • v2.4.1</p>
        </motion.div>
      </div>
    </motion.div>
  );
}