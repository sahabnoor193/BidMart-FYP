// components/StripeOnboardingButton.jsx
import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StripeOnboardingButton = ({ user }) => {
const handleOnboard = async () => {
  const loadingToast = toast.loading('Redirecting to Stripe...');

  try {
    const userIDData = localStorage.getItem('id');
    const userEmail = localStorage.getItem('userEmail');

    const response = await axios.post('http://localhost:5000/api/stripe/onboard-seller', {
      userId: userIDData,
      email: userEmail,
    });

    toast.dismiss(loadingToast);
    toast.success('Redirecting...');
    window.location.href = response.data.url; // Redirect to Stripe
  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error('Stripe onboarding failed');
    console.error('Stripe onboarding failed:', err);
  }
};

  return (
    <button onClick={handleOnboard} className="bg-blue-600 text-white px-4 py-2 rounded">
      Setup Stripe to Sell
    </button>
  );
};

export default StripeOnboardingButton;
