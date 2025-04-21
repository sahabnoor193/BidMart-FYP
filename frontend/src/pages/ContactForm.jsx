// ContactForm.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/contact', formData);
      // Show success toast
      toast.success('Message sent successfully! We will get back to you soon.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      // Show error toast
      toast.error('Failed to send message. Please try again later.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Breadcrumb Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-red-600 w-3 h-6 mr-2"></div>
          <nav className="text-sm md:text-base">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/dashboard" className="hover:text-red-600 transition-colors">Dashboard</a></li>
              <li>/</li>
              <li className="font-medium text-gray-700">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-red-500 text-white rounded-full p-3">
              <i className="fas fa-phone"></i>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Call To Us</h3>
              <p>We are available 24/7, 7 days a week.</p>
              <p className="text-sm text-gray-600">Phone: +8801611112222</p>
            </div>
          </div>
          <hr />
          <div className="flex items-start space-x-4">
            <div className="bg-red-500 text-white rounded-full p-3">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Write To Us</h3>
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <p className="text-sm text-gray-600">Emails: customer@exclusive.com</p>
              <p className="text-sm text-gray-600">support@exclusive.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              name="name" 
              onChange={handleChange} 
              value={formData.name} 
              placeholder="Your Name" 
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              onChange={handleChange} 
              value={formData.email} 
              placeholder="Email" 
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
              required 
            />
            <input 
              type="text" 
              name="phone" 
              onChange={handleChange} 
              value={formData.phone} 
              placeholder="Phone Number" 
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
              required 
            />
          </div>
          <textarea 
            name="message" 
            onChange={handleChange} 
            value={formData.message} 
            placeholder="Your Message" 
            rows="6" 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
            required
          ></textarea>
          <button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
      <div className="mt-6 text-center">
        <Link to="/feedback" className="inline-block bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          💬 Want to leave feedback? Click here!
        </Link>
      </div>
    </div>
  );
};

export default ContactForm;
