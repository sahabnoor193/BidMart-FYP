import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const missing = [];
    if (!requirements.length) missing.push("at least 8 characters");
    if (!requirements.uppercase) missing.push("an uppercase letter");
    if (!requirements.lowercase) missing.push("a lowercase letter");
    if (!requirements.number) missing.push("a number");
    if (!requirements.special) missing.push("a special character (@$!%*?&)");

    return {
      isValid: Object.values(requirements).every(Boolean),
      missing,
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setNewPassword(value);
      const validation = validatePassword(value);
      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          newPassword: `Password must contain ${validation.missing.join(", ")}`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, newPassword: "" }));
      }
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      if (value !== newPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      setLoading(false);
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        newPassword: `Password must contain ${validation.missing.join(", ")}`,
      }));
      setLoading(false);
      return;
    }

    try {
      const email = localStorage.getItem("email");
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful! Please login with your new password.");
        localStorage.removeItem("email"); // Clean up
        navigate("/signin");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred while resetting password");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-serif flex items-center justify-center p-6 relative"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="h-2 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] absolute top-0 left-0 right-0"
      />

      <motion.div
        variants={itemVariants}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#016A6D]/10 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFAA5D]/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#016A6D]/10 rounded-full" />

        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h2
            whileHover={{ scale: 1.02 }}
            className="text-4xl font-bold text-[#043E52] mb-2 flex items-center justify-center gap-3"
          >
            <FiLock className="text-[#FFAA5D] p-2 bg-[#016A6D]/10 rounded-full" />
            Reset Password
          </motion.h2>
          <p className="text-[#043E52]/80">Enter your new password below</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
                className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                  errors.newPassword ? "border-red-500" : "border-[#016A6D]/20"
                } focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 hover:text-[#FFAA5D] transition-colors"
              >
                {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm New Password"
                className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                  errors.confirmPassword ? "border-red-500" : "border-[#016A6D]/20"
                } focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 hover:text-[#FFAA5D] transition-colors"
              >
                {showConfirmPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
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
                Resetting Password...
              </div>
            ) : (
              "Reset Password →"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword; 