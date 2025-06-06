// // ContactForm.jsx
// import React, { useState } from 'react';
// import { Link } from "react-router-dom";
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ContactForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/contact', formData);
//       // Show success toast
//       toast.success('Message sent successfully! We will get back to you soon.', {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       // Reset form
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         message: ''
//       });
//     } catch (err) {
//       console.error(err);
//       // Show error toast
//       toast.error('Failed to send message. Please try again later.', {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 max-w-6xl mx-auto">
//       {/* Breadcrumb Section */}
//       <div className="flex flex-col md:flex-row items-center justify-between mb-6">
//         <div className="flex items-center mb-4 md:mb-0">
//           <div className="bg-red-600 w-3 h-6 mr-2"></div>
//           <nav className="text-sm md:text-base">
//             <ol className="flex items-center space-x-2">
//               <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
//               <li>/</li>
//               <li><a href="/dashboard" className="hover:text-red-600 transition-colors">Dashboard</a></li>
//               <li>/</li>
//               <li className="font-medium text-gray-700">Contact</li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-6">
//         <div className="space-y-6">
//           <div className="flex items-start space-x-4">
//             <div className="bg-red-500 text-white rounded-full p-3">
//               <i className="fas fa-phone"></i>
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg">Call To Us</h3>
//               <p>We are available 24/7, 7 days a week.</p>
//               <p className="text-sm text-gray-600">Phone: +8801611112222</p>
//             </div>
//           </div>
//           <hr />
//           <div className="flex items-start space-x-4">
//             <div className="bg-red-500 text-white rounded-full p-3">
//               <i className="fas fa-envelope"></i>
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg">Write To Us</h3>
//               <p>Fill out our form and we will contact you within 24 hours.</p>
//               <p className="text-sm text-gray-600">Emails: customer@exclusive.com</p>
//               <p className="text-sm text-gray-600">support@exclusive.com</p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <input 
//               type="text" 
//               name="name" 
//               onChange={handleChange} 
//               value={formData.name} 
//               placeholder="Your Name" 
//               className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
//               required 
//             />
//             <input 
//               type="email" 
//               name="email" 
//               onChange={handleChange} 
//               value={formData.email} 
//               placeholder="Email" 
//               className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
//               required 
//             />
//             <input 
//               type="text" 
//               name="phone" 
//               onChange={handleChange} 
//               value={formData.phone} 
//               placeholder="Phone Number" 
//               className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
//               required 
//             />
//           </div>
//           <textarea 
//             name="message" 
//             onChange={handleChange} 
//             value={formData.message} 
//             placeholder="Your Message" 
//             rows="6" 
//             className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
//             required
//           ></textarea>
//           <button 
//             type="submit" 
//             className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors duration-300"
//           >
//             Send Message
//           </button>
//         </form>
//       </div>
//       <div className="mt-6 text-center">
//         <Link to="/feedback" className="inline-block bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
//           💬 Want to leave feedback? Click here!
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ContactForm;
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMessageSquare, FiUser, FiSend } from 'react-icons/fi';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.', {
        position: "top-center",
        theme: "colored",
        style: { backgroundColor: '#016A6D', color: 'white' }
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again later.', {
        position: "top-center",
        theme: "colored",
        style: { backgroundColor: '#E16A3D', color: 'white' }
      });
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Decorative Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Breadcrumb */}
<motion.div variants={itemVariants} className="mb-8">
  <div className="flex items-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
    />
    <nav className="text-sm md:text-base text-[#043E52]/80">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="hover:text-[#FFAA5D] transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li className="mx-1">/</li>
        <li>
          <Link
            to="/dashboard"
            className="hover:text-[#FFAA5D] transition-colors duration-200"
          >
            Dashboard
          </Link>
        </li>
        <li className="mx-1">/</li>
        <li className="font-medium text-[#043E52]">Contact</li>
      </ol>
    </nav>
  </div>
</motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid lg:grid-cols-2 gap-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#016A6D]/20"
        >
          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FFAA5D] text-white rounded-lg">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#043E52] mb-2">Call To Us</h3>
                  <p className="text-[#043E52]/90">24/7 support team available</p>
                  <p className="text-[#016A6D] font-medium mt-2">+8801611112222</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#016A6D] text-white rounded-lg">
                  <FiMail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#043E52] mb-2">Write To Us</h3>
                  <p className="text-[#043E52]/90">Typically replies within 24 hours</p>
                  <p className="text-[#016A6D] font-medium mt-2">support@bidmart.com</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2">
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
                  <input
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2">
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-4 text-[#043E52]/50" />
                  <textarea
                    name="message"
                    onChange={handleChange}
                    value={formData.message}
                    placeholder="Your Message"
                    rows="5"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D]"
                    required
                  ></textarea>
                </div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiSend className="w-5 h-5" />
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Feedback CTA */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <Link 
            to="/feedback" 
            className="inline-flex items-center gap-2 text-[#016A6D] hover:text-[#E16A3D] transition-colors group"
          >
            <span className="border-b border-transparent group-hover:border-[#E16A3D]">
              💬 Have suggestions? We'd love your feedback!
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactForm;