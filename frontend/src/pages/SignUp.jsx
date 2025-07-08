import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { AiFillEye, AiFillEyeInvisible, AiOutlineQuestionCircle } from "react-icons/ai";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import sign from "../assets/signup.jpeg";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Signup = ({ setIsAuthenticated }) => {
  const BASEURL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'buyer'
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // Animation configurations
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

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password)
    };

    const missing = [];
    if (!requirements.length) missing.push("at least 8 characters");
    if (!requirements.uppercase) missing.push("an uppercase letter");
    if (!requirements.lowercase) missing.push("a lowercase letter");
    if (!requirements.number) missing.push("a number");
    if (!requirements.special) missing.push("a special character (@$!%*?&)");

    return {
      isValid: Object.values(requirements).every(Boolean),
      missing
    };
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate email
    if (name === 'email') {
      if (!value) {
        setErrors(prev => ({ ...prev, email: 'Email is required' }));
      } else if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please use a valid Gmail address' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }

    // Validate password
    if (name === 'password') {
      if (!value) {
        setErrors(prev => ({ ...prev, password: 'Password is required' }));
      } else {
        const validation = validatePassword(value);
        if (!validation.isValid) {
          setErrors(prev => ({
            ...prev,
            password: 'Password is missing: ' + validation.missing.join(', ')
          }));
        } else {
          setErrors(prev => ({ ...prev, password: '' }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateEmail(formData.email)) {
      toast.error("Please use a valid Gmail address");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error("Password is missing: " + passwordValidation.missing.join(', '));
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("email", formData.email);
        localStorage.setItem("name", formData.name);
        localStorage.setItem("type", formData.type);
        localStorage.setItem("password", formData.password);

        //navigate("/otp-verification");
        navigate("/otp-verification", {
          state: {
            isSwitchVerification: false, // regular signup verification
            email: formData.email,
            name: formData.name,
            password: formData.password,
            type: formData.type,
          }
        });



      } else {
        if (data.isRegistered) {
          toast.error(data.message);
          // Optionally redirect to login page
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during registration");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const googleLoginHandler = async (googleResponse) => {
    // Show loading toast
    const toastId = toast.loading("Registering...");

    try {
      const response = await fetch(`${BASEURL}/api/auth/register-google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleResponse),
      });

      const data = await response.json();
      console.log(data, "Data");

      if (response.ok) {
        toast.update(toastId, {
          render: "Register successful!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.userId);
        localStorage.setItem("userEmail", data?.user?.email);
        localStorage.setItem("userType", "Buyer");
        localStorage.setItem("userName", data?.user?.name);
        setIsAuthenticated(true);

        if (data.user.type === "seller") {
          navigate("/seller-dashboard");
        } else {
          navigate("/buyer-dashboard");
        }
      } else {
        toast.update(toastId, {
          render: data.message || "Registration failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.update(toastId, {
        render: "An error occurred during registration",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#e6f2f5] via-[#f0f8fa] to-[#faf6e9] font-serif relative overflow-hidden"
    >
      {/* Decorative Gradient Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="h-2 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] absolute top-0 left-0 right-0"
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen p-8">
        {/* Image Section */}
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 flex justify-center mb-12 lg:mb-0 relative"
        >
          <div className="relative max-w-xl">
            <motion.img
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              src={sign}
              alt="Signup Visual"
              className="w-full h-auto rounded-[2rem] shadow-2xl border-4 border-white/30 transform -rotate-2"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#016A6D]/10 to-transparent rounded-[2rem]" />
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 flex justify-center z-10"
        >
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#016A6D]/10 relative overflow-hidden">
            {/* Decorative Elements */}
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
                <FiUser className="text-[#FFAA5D] p-2 bg-[#016A6D]/10 rounded-full" />
                Create Account
              </motion.h2>
              <p className="text-[#043E52]/80">Join our community today</p>
            </motion.div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#016A6D]/20'
                      } focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40`}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Your Password"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#016A6D]/20'
                      } focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40`}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-[#043E52]/50 hover:text-[#FFAA5D] transition-colors"
                    >
                      {showPassword ?
                        <AiFillEyeInvisible size={22} /> :
                        <AiFillEye size={22} />}
                    </button>
                    <AiOutlineQuestionCircle
                      className="text-[#043E52]/50 hover:text-[#FFAA5D] cursor-help"
                      size={22}
                      title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <label className="block text-[#043E52]/80 mb-2 font-medium">Account Type</label>
                  <select
                    className="w-full py-3 px-4 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40 appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                  </select>
                  <FiArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-[#043E52]/50" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-5 h-5 accent-[#FFAA5D] rounded-lg border border-[#016A6D]/20 checked:border-[#FFAA5D]"
                  required
                />
                <label htmlFor="terms" className="text-[#043E52]/80 text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-[#016A6D] hover:text-[#FFAA5D] font-medium">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#016A6D] hover:text-[#FFAA5D] font-medium">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-br from-[#FFAA5D] to-[#E16A3D] text-white py-3.5 rounded-xl font-medium hover:shadow-lg transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                Sign Up →
              </motion.button>

              <motion.div variants={itemVariants} className="my-8">
                <div className="flex items-center">
                  <hr className="flex-grow border-t border-[#016A6D]/20" />
                  <span className="px-4 text-[#043E52]/60 text-sm font-medium">OR CONTINUE WITH</span>
                  <hr className="flex-grow border-t border-[#016A6D]/20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <GoogleOAuthProvider clientId="1001588197500-mmp90e0a3vmftbb3a8h3jbeput110kok.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={(response) => googleLoginHandler(response)}
                    onError={(error) => console.log(error)}
                    theme="filled_blue"
                    shape="pill"
                    size="large"
                    text="continue_with"
                    width="300"
                    logo_alignment="left"
                    className="!rounded-xl !overflow-hidden hover:!shadow-md transition-shadow"
                  />
                </GoogleOAuthProvider>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-center text-[#043E52]/80 mt-8"
              >
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-[#016A6D] hover:text-[#FFAA5D] font-medium transition-colors relative group"
                >
                  Log In
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFAA5D] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

Signup.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Signup;