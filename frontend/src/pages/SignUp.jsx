// import { useState, useEffect } from "react";
// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import { AiFillEye, AiFillEyeInvisible, AiOutlineQuestionCircle } from "react-icons/ai";
// import sign from "../assets/signup.jpeg";
// import { useNavigate } from 'react-router-dom';
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { toast } from "react-toastify";


// const Signup = ({ setIsAuthenticated }) => {
//   // const BASEURL = "https://subhan-project-backend.onrender.com";
//   const BASEURL = "http://localhost:5000";
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     type: 'buyer' // Default value
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const userType = localStorage.getItem("userType");
//       if (userType === "seller") {
//         navigate("/seller-dashboard");
//       } else {
//         navigate("/");
//       }
//     }
//   }, [navigate]);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!formData.email.endsWith("@gmail.com")) {
//       alert("Only Google emails (@gmail.com) are allowed.");
//       return;
//     }
  
//     try {
//       const response = await fetch(`${BASEURL}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         localStorage.setItem("email", formData.email);
//         localStorage.setItem("name", formData.name);
//         localStorage.setItem("type", formData.type);
  
//         navigate("/otp-verification");
//       } else {
//         alert(data.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred during registration");
//     }
//   };


//   const googleLoginHandler = async (googleResponse) => {
//     // Show loading toast
//     const toastId = toast.loading("Registering...");
  
//     try {
//       const response = await fetch(`${BASEURL}/api/auth/register-google`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(googleResponse),
//       });
  
//       const data = await response.json();
//       console.log(data, "Data");
  
//       if (response.ok) {
//         toast.update(toastId, {
//           render: "Register successful!",
//           type: "success",
//           isLoading: false,
//           autoClose: 3000,
//         });
  
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("id", data.userId);
//         localStorage.setItem("userEmail", data?.user?.email);
//         localStorage.setItem("userType", "Buyer");
//         localStorage.setItem("userName", data?.user?.name);
//         setIsAuthenticated(true);
  
//         if (data.user.type === "seller") {
//           navigate("/seller-dashboard");
//         } else {
//           navigate("/buyer-dashboard");
//         }
//       } else {
//         toast.update(toastId, {
//           render: data.message || "Registration failed",
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.update(toastId, {
//         render: "An error occurred during registration",
//         type: "error",
//         isLoading: false,
//         autoClose: 3000,
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col md:flex-row">
//       {/* Left Section (Image) */}
//       <div className="md:w-1/2 hidden md:flex items-center justify-center">
//         <img
//           src={sign}
//           alt="Signup Visual"
//           className="w-full h-auto object-contain max-h-[80vh]"
//         />
//       </div>

//       {/* Right Section (Form) */}
//       <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-8 px-4 md:px-16">
//         <div className="w-full max-w-md space-y-6">
//           <h2 className="text-3xl font-bold text-black text-center">
//             Create An Account
//           </h2>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
//                 Name:
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Your Name"
//                 className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//               />
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
//                 Email:
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="Your Email"
//                 className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Password:
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Your Password"
//                   className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                   onChange={(e) => setFormData({...formData, password: e.target.value})}
//                 />
//                 <span
//                   className="absolute inset-y-0 right-8 flex items-center text-gray-500 cursor-pointer"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
//                 </span>
//                 <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
//                   <AiOutlineQuestionCircle size={20} />
//                 </span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Type:
//               </label>
//               <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={formData.type} 
//               onChange={(e) => setFormData({...formData, type: e.target.value})} >
//                 <option value="seller">Seller</option>
//                 <option value="buyer">Buyer</option>
//               </select>
//             </div>

//             <div className="flex items-center space-x-2">
//               <input type="checkbox" id="terms" required />
//               <label htmlFor="terms" className="text-sm text-gray-600 select-none">
//                 I agree to the{" "}
//                 <a href="#" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
//                   Terms of Use
//                 </a>{" "}
//                 and{" "}
//                 <a href="#" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
//                   Privacy Policy
//                 </a>
//                 .
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
//             >
//               Sign Up
//             </button>

//             <div className="flex items-center my-4">
//               <hr className="flex-grow border-t border-gray-300" />
//               <span className="px-4 text-sm text-gray-500">OR</span>
//               <hr className="flex-grow border-t border-gray-300" />
//             </div>

//             <div className="flex justify-center space-x-4">
//               {/* <a href="http://localhost:5000/api/auth/facebook">
//                 <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
//                   <FaFacebook size={20} className="mr-2" /> Facebook
//                 </button>
//               </a> */}

//               <GoogleOAuthProvider clientId="1001588197500-mmp90e0a3vmftbb3a8h3jbeput110kok.apps.googleusercontent.com">
//                 <GoogleLogin onSuccess={(response) => googleLoginHandler(response)}
//                              onError={(error) => console.log(error)} />
//               </GoogleOAuthProvider>
//             </div>
//           </form>

//           <p className="text-center text-sm text-gray-500 mt-4">
//             Already have an account?{" "}
//             <a href="/signin" className="text-blue-500 hover:underline">
//               Log in
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { AiFillEye, AiFillEyeInvisible, AiOutlineQuestionCircle } from "react-icons/ai";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import sign from "../assets/signup.jpeg";
import { useNavigate } from 'react-router-dom';

const Signup = ({ setIsAuthenticated }) => {
  const BASEURL = "http://localhost:5000";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'buyer'
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

  // Keep all useEffect and handler functions unchanged
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userType = localStorage.getItem("userType");
      if (userType === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.email.endsWith("@gmail.com")) {
      alert("Only Google emails (@gmail.com) are allowed.");
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
  
        navigate("/otp-verification");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration");
    }
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043E52]/50 group-focus-within:text-[#FFAA5D] transition-colors" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40"
                    required
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <label className="block text-[#043E52]/80 mb-2 font-medium">Account Type</label>
                  <select 
                    className="w-full py-3 px-4 rounded-xl border border-[#016A6D]/20 focus:outline-none focus:ring-2 focus:ring-[#FFAA5D] bg-white/50 transition-all duration-300 hover:border-[#016A6D]/40 appearance-none"
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
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

export default Signup;