import React from 'react';
import { Mail, Phone, User } from 'lucide-react'; // Icons for contact info
import { motion } from 'framer-motion';

const ContactInfo = ({ contact = {} }) => { // Default to empty object for robustness
  const contactItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-4 font-sans" // Applied font-sans
    >
      <h2 className="text-xl font-bold text-[#043E52] mb-4">Contact Information</h2>

      <dl className="space-y-3"> {/* Using definition list for semantic structure */}
        <motion.div variants={contactItemVariants} className="flex items-center">
          <dt className="w-24 text-gray-600 flex items-center gap-2 text-sm font-medium">
            <User size={16} className="text-[#E16A3D]" /> Name:
          </dt>
          <dd className="text-gray-800 font-semibold text-base">{contact.name || 'N/A'}</dd>
        </motion.div>
        <motion.div variants={contactItemVariants} className="flex items-center">
          <dt className="w-24 text-gray-600 flex items-center gap-2 text-sm font-medium">
            <Mail size={16} className="text-[#E16A3D]" /> Email:
          </dt>
          <dd className="text-gray-800 font-semibold text-base">
            {contact.email ? <a href={`mailto:${contact.email}`} className="text-[#016A6D] hover:underline">{contact.email}</a> : 'N/A'}
          </dd>
        </motion.div>
        <motion.div variants={contactItemVariants} className="flex items-center">
          <dt className="w-24 text-gray-600 flex items-center gap-2 text-sm font-medium">
            <Phone size={16} className="text-[#E16A3D]" /> Phone:
          </dt>
          <dd className="text-gray-800 font-semibold text-base">
            {contact.phone ? <a href={`tel:${contact.phone}`} className="text-[#016A6D] hover:underline">{contact.phone}</a> : 'N/A'}
          </dd>
        </motion.div>
      </dl>
    </motion.div>
  );
};

export default ContactInfo;