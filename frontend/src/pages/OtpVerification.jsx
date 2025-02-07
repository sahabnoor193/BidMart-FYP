import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes countdown (300 seconds)
  const navigate = useNavigate();

  // ✅ Countdown Timer Effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [timer]);

  // ✅ Function to Format Time (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, name, password, type }),
      });
  
      const data = await response.json();
      console.log("🔹 Response from backend: ", data); // ✅ Log backend response
  
      setLoading(false);
  
      if (response.ok) {
        alert(data.message);
        navigate("/signin"); // ✅ Redirect to Sign-in Page
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
      const response = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Verify Your OTP</h2>
        <p className="text-gray-500 text-center mb-4">Enter the OTP sent to your email.</p>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {resendMessage && <p className="text-green-500 text-center">{resendMessage}</p>}

        {/* ✅ Countdown Timer */}
        <p className="text-gray-600 text-center mb-2">
          OTP expires in: <span className="font-semibold">{formatTime(timer)}</span>
        </p>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-gray-700 font-medium mb-1">OTP Code:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* ✅ Resend OTP Button (Disabled Until Timer Ends) */}
        <p className="text-gray-500 text-center mt-4">
          Didnt receive an OTP?{" "}
          <button
            onClick={handleResendOTP}
            className={`text-blue-500 hover:underline ${timer > 0 ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={timer > 0}
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
