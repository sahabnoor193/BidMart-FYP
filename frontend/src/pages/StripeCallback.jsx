// src/pages/StripeCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StripeCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code || !state) {
        toast.error('Invalid Stripe callback');
        return navigate('/seller-dashboard');
      }

      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/stripe/oauth/callback`, {
          params: { code, state },
        });

        toast.success('Stripe account connected!');
        navigate('/seller-dashboard?connected=true');
      } catch (err) {
        console.error('Stripe OAuth callback failed:', err);
        toast.error('Stripe connection failed');
        navigate('/seller-dashboard');
      }
    };

    handleCallback();
  }, [navigate]);

  return <p>Finishing Stripe connection...</p>;
};

export default StripeCallback;
