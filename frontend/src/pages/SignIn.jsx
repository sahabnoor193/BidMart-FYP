import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import signinImage from "../assets/signup.jpeg";

const SignIn = ({ setIsAuthenticated }) => {
  const BASEURL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
      transition: { type: "spring", stiffness: 120 }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const response = await fetch(`${BASEURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();
      setLoading(false);
      console.log(data, "Data");

      if (response.ok) {
        toast.update(toastId, {
          render: "Login successful!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // localStorage.setItem("token", data.token);
        // localStorage.setItem("id", data.id);
        // localStorage.setItem("userEmail", email);
        // localStorage.setItem("userType", data.type);
        // localStorage.setItem("userName", data.name);
        // setIsAuthenticated(true);

        const userData = { id: data.id, _id: data.id, email, type: data.type, name: data.name };
        // localStorage.setItem("user", JSON.stringify(userData));
        //Added userData for localstorage in signin
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("id", userData.id);
        // localStorage.setItem("token", data.token);
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("sessionToken", data.token); // Add session token
        localStorage.setItem("userName", data.name); // Add this line
        localStorage.setItem("userType", data.type);

        // const decodedToken = jwtDecode(data.token);
        // const userType = decodedToken.type || "buyer";

        setIsAuthenticated(true);

        // Redirect based on user type
        if (data.type === "seller") {
          navigate("/seller-dashboard", { replace: true });
        } else {
          navigate("/buyer-dashboard", { replace: true });
        }
      } else {
        toast.update(toastId, {
          render: data.message || "Invalid email or password.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("❌ Error logging in:", err);
      toast.update(toastId, {
        render: "An error occurred while logging in.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setLoading(false);
    }
  };
  const googleLoginHandler = async (googleResponse) => {
    const toastId = toast.loading("Logging in with Google...");

    try {
      const response = await fetch(`${BASEURL}/api/auth/login-google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleResponse),
      });

      const data = await response.json();
      console.log(data, "Data");

      if (response.ok) {
        toast.update(toastId, {
          render: "Login successful!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });


        //private URL change by Sania
        // localStorage.setItem("token", data.token);
        // localStorage.setItem('token', response.data.token);
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("sessionToken", data.token); // Add session token
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userType", data.type);
        localStorage.setItem("id", data.id);
        localStorage.setItem("userName", data.name);
        setIsAuthenticated(true);

        if (data.type === "seller") {
          navigate("/seller-dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.update(toastId, {
          render: data.message || "Login failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.update(toastId, {
        render: "An error occurred during login",
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
              src={signinImage}
              alt="SignIn Visual"
              className="w-full h-auto rounded-[2rem] shadow-2xl border-4 border-white/30 transform rotate-2"
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
                Welcome Back
              </motion.h2>
              <p className="text-[#043E52]/80">Sign in to continue your journey</p>
            </motion.div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 hover:text-[#FFAA5D] transition-colors"
                  >
                    {showPassword ?
                      <AiFillEyeInvisible size={22} /> :
                      <AiFillEye size={22} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-5 h-5 accent-[#FFAA5D] rounded-lg border border-[#016A6D]/20 checked:border-[#FFAA5D]"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-[#043E52]/80">
                    Remember Me
                  </label>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className="text-[#016A6D] hover:text-[#FFAA5D] transition-colors text-sm font-medium"
                >
                  Forgot Password?
                </motion.button>
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
                    Signing In...
                  </div>
                ) : (
                  <span className="tracking-wide">Sign In →</span>
                )}
              </motion.button>
            </form>

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
              New to our community?{" "}
              <a
                href="/signup"
                className="text-[#016A6D] hover:text-[#FFAA5D] font-medium transition-colors relative group"
              >
                Create Account
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFAA5D] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

SignIn.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default SignIn;