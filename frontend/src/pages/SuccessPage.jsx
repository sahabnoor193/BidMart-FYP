import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from "framer-motion";

const CircularProgress = ({ progress }) => {
  const circleLength = useTransform(progress, [0, 100], [0, 1]);
  const checkmarkPathLength = useTransform(progress, [0, 95, 100], [0, 0, 1]);
  const circleColor = useTransform(progress, [0, 95, 100], ["#FFCC66", "#FFCC66", "#66BB66"]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 258 258"
    >
      {/* Check mark */}
      <motion.path
        transform="translate(60 85)"
        d="M3 50L45 92L134 3"
        fill="transparent"
        stroke="#7BB86F"
        strokeWidth={8}
        style={{ pathLength: checkmarkPathLength }}
      />
      {/* Circle */}
      <motion.path
        d="M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z"
        fill="transparent"
        strokeWidth="8"
        stroke={circleColor}
        style={{ pathLength: circleLength }}
      />
    </motion.svg>
  );
};

const SuccessPage = () => {
  const progress = useMotionValue(90);

  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 100 }}
        style={{ x: progress }}
        transition={{ duration: 1 }}
      />
      <CircularProgress progress={progress} />
      <h1 className="text-3xl font-bold mt-6">Payment Successful!</h1>
      <h2 className="text-xl mt-2 mb-6">
        Your order has been booked & will be delivered to you shortly!
      </h2>
      <button className="bg-green-600 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded">
        <Link to="/" className="no-underline text-white">
          Continue Shopping
        </Link>
      </button>
    </div>
  );
};

export default SuccessPage;
