// import React, { useState } from "react";
// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import { AiFillEye, AiFillEyeInvisible, AiOutlineQuestionCircle } from "react-icons/ai";
// import signinImage from "../assets/signup.jpeg"; // Replace with your sign-in image path

// const SignIn = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="min-h-screen bg-white mt-16 flex flex-col md:flex-row">
//       {/* Left Section (Image) */}
//       <div className="md:w-1/2 hidden md:flex items-center justify-center">
//         <img
//           src={signinImage}
//           alt="SignIn Visual"
//           className="w-full h-auto object-contain max-h-[80vh]"
//         />
//       </div>

//       {/* Right Section (Form) */}
//       <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-8 px-4 md:px-16">
//         <div className="w-full max-w-md space-y-6">
//           <h2 className="text-3xl font-bold text-black text-center">
//             Welcome Back
//           </h2>

//           <form className="space-y-4">
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

//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-2">
//                 <input type="checkbox" id="remember" />
//                 <label htmlFor="remember" className="text-sm text-gray-600 select-none">
//                   Remember Me
//                 </label>
//               </div>
//               <a
//                 href="#"
//                 className="text-sm text-blue-500 hover:underline"
//               >
//                 Forgot Password?
//               </a>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
//             >
//               Sign In
//             </button>

//             <div className="flex items-center my-4">
//               <hr className="flex-grow border-t border-gray-300" />
//               <span className="px-4 text-sm text-gray-500">OR</span>
//               <hr className="flex-grow border-t border-gray-300" />
//             </div>

//             <div className="flex justify-center space-x-4">
//               <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
//                 <FaFacebook size={20} className="mr-2" /> Facebook
//               </button>
//               <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
//                 <FaGoogle size={20} className="mr-2" /> Google
//               </button>
//             </div>
//           </form>

//           <p className="text-center text-sm text-gray-500 mt-4">
//             Don't have an account?{" "}
//             <a href="/signup" className="text-blue-500 hover:underline">
//               Sign Up
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible, AiOutlineQuestionCircle } from "react-icons/ai";
import signinImage from "../assets/signup.jpeg";
import { jwtDecode } from "jwt-decode"; // ✅ Correct// ✅ Install with: npm install jwt-decode
 
const SignIn = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Function to Handle Email/Password Login
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await fetch("http://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     setLoading(false);

  //     if (response.ok) {
  //       alert("Login successful!");
  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem("userEmail", email);
  //       setIsAuthenticated(true);
  //       navigate("/");
  //     } else {
  //       setError(data.message || "Invalid email or password.");
  //     }
  //   } catch (err) {
  //     console.error("❌ Error logging in:", err);
  //     setError("An error occurred while logging in.");
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert("Login successful!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userType", data.type);
        localStorage.setItem("userName", data.name);
        setIsAuthenticated(true);

        // ✅ Decode the token to get user type
        const decodedToken = jwtDecode(data.token);
        const userType = decodedToken.type || "buyer"; // Default to buyer if type is missing

        localStorage.setItem("userType", userType);
        setIsAuthenticated(true);

        // ✅ Redirect based on user type
        if (userType === "seller") {
          navigate("/seller-dashboard"); // Redirect to Seller Dashboard
        } else {
          navigate("/dashboard"); // Redirect to Buyer Dashboard
        }
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("❌ Error logging in:", err);
      setError("An error occurred while logging in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white mt-16 flex flex-col md:flex-row">
      {/* Left Section (Image) */}
      <div className="md:w-1/2 hidden md:flex items-center justify-center">
        <img
          src={signinImage}
          alt="SignIn Visual"
          className="w-full h-auto object-contain max-h-[80vh]"
        />
      </div>

      {/* Right Section (Form) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-8 px-4 md:px-16">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-black text-center">Welcome Back</h2>

          {error && <p className="text-red-500 text-center">{error}</p>} {/* ✅ Show errors */}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 right-8 flex items-center text-gray-500 cursor-pointer"
                      onClick={togglePasswordVisibility}>
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600 select-none">
                  Remember Me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* ✅ Social Login Buttons */}
          <div className="flex justify-center space-x-4">
            <a href="http://localhost:5000/api/auth/facebook">
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                <FaFacebook size={20} className="mr-2" /> Facebook
              </button>
            </a>
            <a href="http://localhost:5000/api/auth/google">
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                <FaGoogle size={20} className="mr-2" /> Google
              </button>
            </a>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
