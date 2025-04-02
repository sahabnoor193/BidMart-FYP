// // import { useSearchParams, useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";

// // const SelectAccount = () => {
// //   const [searchParams] = useSearchParams();
// //   const [formData, setFormData] = useState({ name: "", email: "" });
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetch("http://localhost:5000/api/auth/session-data", { credentials: "include" })
// //       .then(res => res.json())
// //       .then(data => {
// //         if (data.email) {
// //           setFormData({ name: data.name, email: data.email });
// //         } else {
// //           // Fallback to query parameters
// //           setFormData({
// //             name: searchParams.get("name") || "",
// //             email: searchParams.get("email") || ""
// //           });
// //         }
// //       });
// //   }, [searchParams]);

// //   const handleAccountType = async (type) => {
// //     try {
// //       const response = await fetch("http://localhost:5000/api/auth/register-google", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ ...formData, type }),
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         localStorage.setItem("token", data.token);
// //         navigate("/dashboard");
// //       } else {
// //         alert(data.message || "Signup failed");
// //       }
// //     } catch (error) {
// //       console.error("Error:", error);
// //       alert("An error occurred");
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center h-screen">
// //       <h2 className="text-2xl font-bold mb-4">Sign up as a</h2>
// //       <button onClick={() => handleAccountType("buyer")} className="bg-blue-500 text-white px-6 py-3 rounded mb-2">Buyer</button>
// //       <button onClick={() => handleAccountType("seller")} className="bg-green-500 text-white px-6 py-3 rounded">Seller</button>
// //     </div>
// //   );
// // };

// // export default SelectAccount;