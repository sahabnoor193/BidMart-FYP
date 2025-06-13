import React from 'react';
import { FaStore, FaShoppingCart, FaUsers, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import teamImage from '../assets/WhatsApp Image 2025-05-14 at 1.00.13 AM.jpeg';

const teamMembers = [
  { name: 'Sahab Noor', role: 'MERN Developer & Designer' },
  { name: 'Sania Aimen', role: 'MERN Developer' },
];

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative top border */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-16"
        />

        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            variants={itemVariants}
            className="space-y-6 relative z-10"
          >
            <h2 className="text-4xl font-bold text-[#043E52]">
              Our <span className="text-[#FFAA5D]">Journey</span>
            </h2>
            <p className="text-lg text-[#043E52]/90 leading-relaxed">
              BidMart emerged from a vision to revolutionize online marketplaces into vibrant, 
              interactive communities. By blending real-time bidding with seamless product management 
              and live support, we've crafted a platform that empowers both buyers and sellers.
              <br /><br />
              Built on the robust MERN stack, BidMart delivers a fast, secure, and engaging experience 
              where every bid brings you closer to your next great opportunity.
            </p>
          </motion.div>
          
          {/* <motion.div 
            variants={itemVariants}
            className="relative group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D] opacity-20 rounded-xl transform -rotate-2" />
            <img
              src="/your-image-path.jpg"
              alt="Team"
              className="relative z-10 rounded-xl w-full shadow-lg transform rotate-1 hover:rotate-0 transition-all duration-300 border-4 border-[#016A6D]/20"
            />
          </motion.div> */}

          <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="order-1 md:order-2 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px]"> {/* Added fixed height */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#009688]/20 to-[#E4BA29]/20"></div>
            <img
              src={teamImage}
              alt="Team working"
              className="w-full h-full object-cover" /* Changed to h-full */
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg hidden md:block border border-[#E4BA29]/20"
          >
            <div className="text-[#E4BA29] text-2xl mb-2">"</div>
            <p className="text-[#2C3E50] font-medium">We believe in creating value through technology</p>
          </motion.div>
        </motion.div>
        </section>

        {/* Stats */}
        <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center mb-20">
          {[
            { icon: <FaStore />, value: '0k', label: 'Active Sellers' },
            { icon: <FaShoppingCart />, value: '0k', label: 'Monthly Sales' },
            { icon: <FaUsers />, value: '0k', label: 'Active Customers' },
            { icon: <FaChartLine />, value: '0k', label: 'Annual Revenue' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] hover:text-white cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="mx-auto text-3xl mb-2 text-[#043E52] group-hover:text-white">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="mt-1 text-sm group-hover:text-white/90">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* Team */}
        <section className="text-center mb-16">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-[#043E52] mb-12"
          >
            Our <span className="text-[#FFAA5D]">Team</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FFAA5D] to-[#E16A3D]" />
                <div className="w-full h-40 bg-[#016A6D]/10 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl text-[#043E52] font-bold">
                    {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1].charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#043E52]">{member.name}</h3>
                <p className="text-sm text-[#016A6D]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AboutUs;