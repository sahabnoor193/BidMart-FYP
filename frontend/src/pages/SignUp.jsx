import { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible, AiOutlineQuestionCircle } from "react-icons/ai";
import sign from "../assets/signup.jpeg";
import { useNavigate } from 'react-router-dom';
// import { registerUser } from "../api";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'buyer' // Default value
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

      // ✅ Check if email ends with "@gmail.com"
    if (!formData.email.endsWith("@gmail.com")) {
      alert("Only Google emails (@gmail.com) are allowed.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const data = await registerUser(formData);
//     if (data.token) {
//       localStorage.setItem('token', data.token);
//       navigate('/');
//     } else {
//       alert(data.message || 'Registration failed');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     alert('An error occurred during registration');
//   }
// };

  return (
    <div className="min-h-screen bg-white mt-16 flex flex-col md:flex-row">
      {/* Left Section (Image) */}
      <div className="md:w-1/2 hidden md:flex items-center justify-center"> {/* Key change here */}
            <img
            src={sign}
            alt="Signup Visual"
            className="w-full h-auto object-contain max-h-[80vh]"
            />
      </div>

      {/* Right Section (Form) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-8 px-4 md:px-16"> {/* Added padding */}
        <div className="w-full max-w-md space-y-6"> {/* Added spacing */}
          <h2 className="text-3xl font-bold text-black text-center">
            Create An Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Name:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <span
                  className="absolute inset-y-0 right-8 flex items-center text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </span>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                  <AiOutlineQuestionCircle size={20} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Type:
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})} >
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" required /> {/* Added required */}
              <label htmlFor="terms" className="text-sm text-gray-600 select-none">
                I agree to the{" "}
                <a href="#" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Sign Up
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="flex justify-center space-x-4">
              
              <a href="http://localhost:5000/api/auth/google" >
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                <FaFacebook size={20} className="mr-2" /> Facebook
              </button>
              </a>

              <a href="http://localhost:5000/api/auth/facebook" >
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                <FaGoogle size={20} className="mr-2" /> Google
              </button>
              </a>

            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
