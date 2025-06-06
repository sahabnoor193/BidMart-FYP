import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedback/approved");
        setFeedback(response.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    if (feedback.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % feedback.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [feedback]);

  if (loading) {
    return (
      <section className="py-20 bg-[#e6f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#016A6D]"
            ></motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-[#e6f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#E16A3D]">{error}</div>
        </div>
      </section>
    );
  }

  if (!feedback || feedback.length === 0) {
    return (
      <section className="py-20 bg-[#e6f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#043E52]/80">No testimonials available yet.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#e6f2f5] relative overflow-hidden">
      {/* Blurred decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
        className="absolute -left-32 -top-32 w-64 h-64 rounded-full bg-[#016A6D] blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -right-32 -bottom-32 w-64 h-64 rounded-full bg-[#E16A3D] blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-[#016A6D] uppercase tracking-wider mb-2"
          >
            Testimonials
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-[#043E52] mb-4"
          >
            Voices of <span className="text-[#FFAA5D]">Satisfaction</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-[#043E52]/80 max-w-2xl mx-auto"
          >
            Discover why our clients trust our auction platform
          </motion.p>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex justify-center"
          >
            <div className="w-24 h-1 bg-[#FFAA5D] rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#016A6D]/10 backdrop-blur-sm"
            >
              <div className="flex text-[#FFAA5D] mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: i < feedback[activeIndex].rating ? 1.2 : 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-6 h-6 ${i < feedback[activeIndex].rating ? "text-[#FFAA5D]" : "text-[#043E52]/20"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[#043E52]/90 italic mb-6 text-lg"
              >
                &ldquo;{feedback[activeIndex].comment}&rdquo;
              </motion.p>
              <div className="flex items-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-[#016A6D]/10 text-[#016A6D] rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl"
                >
                  {feedback[activeIndex].name.charAt(0).toUpperCase()}
                </motion.div>
                <div className="ml-4">
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="font-semibold text-[#043E52]"
                  >
                    {feedback[activeIndex].name || "Anonymous"}
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-sm text-[#043E52]/80"
                  >
                    {feedback[activeIndex].role}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 space-x-2">
            {feedback.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${activeIndex === index ? 'bg-[#FFAA5D] w-6' : 'bg-[#043E52]/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {feedback.map((fb, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0, rotateY: 90 }}
              whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#016A6D]/10 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FFAA5D]"></div>
              
              <div className="flex text-[#FFAA5D] mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    className={`w-6 h-6 ${i < fb.rating ? "text-[#FFAA5D]" : "text-[#043E52]/20"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#043E52]/90 italic mb-6 text-lg"
              >
                &ldquo;{fb.comment}&rdquo;
              </motion.p>
              <div className="flex items-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#016A6D]/10 text-[#016A6D] rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl"
                >
                  {fb.name.charAt(0).toUpperCase()}
                </motion.div>
                <div className="ml-4">
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-semibold text-[#043E52]"
                  >
                    {fb.name || "Anonymous"}
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-[#043E52]/80"
                  >
                    {fb.role}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}