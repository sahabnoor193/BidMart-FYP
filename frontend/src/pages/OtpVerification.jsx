import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiKey, FiClock, FiArrowRight } from "react-icons/fi";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes countdown (300 seconds)
  const navigate = useNavigate();
  const location = useLocation();
  const isSwitchVerification = location.state?.isSwitchVerification || false;

  // ✅ Countdown Timer Effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [timer]);

  // // ✅ Function to Format Time (MM:SS)
  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  // };

  // ✅ Function to Verify OTP
  const [name, setName] = useState(localStorage.getItem("name") || ""); // Retrieve name from localStorage
  const [type, setType] = useState(localStorage.getItem("type") || "buyer"); // Retrieve type from localStorage
  const [password, setPassword] = useState(localStorage.getItem("password") || ""); // Retrieve password from localStorage
  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResendMessage("");
  
    console.log("🔹 Sending verification request with: ", { email, otp, name, password, type }); // ✅ Debugging log
  
    try {
      const endpoint = isSwitchVerification ? "user/switch-verify-otp" : "auth/verify-otp"; // Updated endpoint
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, name, password, type }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        console.error("Error response:", errorText);
        throw new Error("Failed to verify OTP. Please check the backend endpoint.");
      }
  
      const data = await response.json();
      console.log("🔹 Response from backend: ", data); // ✅ Log backend response
  
      setLoading(false);
  
      if (response.ok) {
        alert(data.message);
        if (isSwitchVerification) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userType", data.type);
          navigate(`/${data.type}-dashboard`); // ✅ Redirect to the appropriate dashboard
        } else {
          navigate("/signin"); // ✅ Redirect to Sign-in Page
        }
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error verifying OTP:", err);
      setError("An error occurred while verifying OTP.");
      setLoading(false);
    }
  };  
  
  // ✅ Function to Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setResendMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/user/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setResendMessage("A new OTP has been sent to your email.");
        setTimer(300); // ✅ Reset timer to 5 minutes
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while resending OTP.");
      setLoading(false);
    }
  };

   const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120 }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-serif flex items-center justify-center p-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        {/* Updated Gradient Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

      <motion.div 
        variants={itemVariants}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#016A6D]/10 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFAA5D]/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#016A6D]/10 rounded-full" />

        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.h2 
            whileHover={{ scale: 1.02 }}
            className="text-4xl font-bold text-[#043E52] mb-2 flex items-center justify-center gap-3"
          >
            <FiKey className="text-[#FFAA5D] p-2 bg-[#016A6D]/10 rounded-full" />
            Verify OTP
          </motion.h2>
          <p className="text-[#043E52]/80">Enter the code sent to {email}</p>
        </motion.div>

        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="relative group">
              <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="flex items-center justify-center gap-2 text-[#043E52]/80">
              <FiClock className="text-[#FFAA5D]" />
              <span className="font-medium">
                Code expires in: {formatTime(timer)}
              </span>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] text-white py-3.5 rounded-xl font-medium hover:shadow-lg transition-all relative overflow-hidden group"
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Verifying...
              </div>
            ) : (
              "Verify Now →"
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-[#043E52]/80">
              Didn't receive code?{" "}
              <button
                onClick={handleResendOTP}
                className={`text-[#016A6D] hover:text-[#FFAA5D] font-medium ${
                  timer > 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={timer > 0}
              >
                Resend OTP
              </button>
            </p>
          </motion.div>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mt-4"
          >
            {error}
          </motion.div>
        )}

        {resendMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-center mt-4"
          >
            {resendMessage}
          </motion.div>
        )}
      </motion.div>
      </div>
    </motion.div>
  );
};

export default OtpVerification;