import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMessageSquare, FiUser, FiSend, FiArrowRight } from 'react-icons/fi'; // Import FiArrowRight

const ContactForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

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
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-serif py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Preserved animated top border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Breadcrumb - UPDATED */}
        <motion.div variants={itemVariants} className="mb-8">
          <nav className="flex items-center text-[#043E52]/80 space-x-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-[#E16A3D] w-2 h-4 mr-2 rounded-full"
            />
            <button
              onClick={() => navigate('/Home')}
              className="hover:text-[#FFAA5D] transition-colors"
            >
              Home
            </button>
            <FiArrowRight className="text-[#FFAA5D]" />
            <span className="font-medium text-[#043E52]">Dashboard</span>
          </nav>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid lg:grid-cols-2 gap-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#016A6D]/10 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFAA5D]/10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#016A6D]/10 rounded-full" />

          {/* Contact Info */}
          <div className="space-y-8 z-10">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl border border-[#016A6D]/10"
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
              className="p-6 bg-gradient-to-br from-[#043E52]/5 to-white rounded-xl border border-[#016A6D]/10"
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
            className="space-y-6 z-10"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2">
                <div className="relative group">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <input
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone}
                    placeholder="Phone Number"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2">
                <div className="relative group">
                  <FiMessageSquare className="absolute left-4 top-4 text-[#043E52]/50 group-focus-within:text-[#FFAA5D]" />
                  <textarea
                    name="message"
                    onChange={handleChange}
                    value={formData.message}
                    placeholder="Your Message"
                    rows="5"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                  ></textarea>
                </div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] text-white py-3.5 rounded-xl font-medium hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="flex items-center justify-center gap-2 tracking-wide">
                <FiSend className="w-5 h-5" />
                Send Message
              </span>
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