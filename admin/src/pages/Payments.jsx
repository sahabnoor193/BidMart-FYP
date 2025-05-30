import React, { useEffect, useState } from "react";
import axios from "axios";
import { setSinglePayment } from "../features/Payment_Slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const Payments = () => {
  const [payments, setPayments] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/payments/allPayments");
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };
  
  const Navigation = ( payment ) => {
      dispatch(setSinglePayment( payment ))
       navigate("/PaymentsDetails")
    }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-[60px]">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        💳 Payment Records
      </h1>

      {payments.length === 0 ? (
        <p className="text-center text-gray-500">No payments found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {payments.map((payment) => (
            <div
              key={payment.paymentId}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transition hover:shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-700">
                  ${payment.amount}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    payment.status === "completed"
                      ? "bg-green-500"
                      : payment.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                <strong>Created:</strong> {formatDate(payment.createdAt)}
              </p>

              <div className="mb-4 text-sm space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Product:</span>{" "}
                  {payment.product?.name || "No product info"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Description:</span>{" "}
                  {payment.product?.description || "No description"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Price:</span>{" "}
                  {payment.product?.startingPrice
                    ? `$${payment.product.startingPrice}`
                    : "Not provided"}
                </p>
              </div>

              <div className="mb-3 text-sm">
                <p className="font-medium text-gray-700">Seller</p>
                <p className="text-gray-600">
                  {payment.seller
                    ? `${payment.seller.name} (${payment.seller.email})`
                    : "No seller info"}
                </p>
              </div>

              <div className="text-sm">
                <p className="font-medium text-gray-700">Buyer</p>
                <p className="text-gray-600">
                  {payment.buyer
                    ? `${payment.buyer.name} (${payment.buyer.email})`
                    : "No buyer info"}
                </p>
              </div>
              <button
               className="border border-blue-500 rounded-xl py-1 px-4 mt-2"
               onClick={()=>Navigation(payment)}>Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
