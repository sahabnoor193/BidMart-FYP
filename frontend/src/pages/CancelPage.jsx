import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  // Uncomment this block to enable redirection after 5 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-red-600 text-center px-4">
      {/* Cross Icon */}
      <div className="inline-block w-14 h-14 border-[3px] border-red-600 rounded-full relative mb-4">
        <div className="absolute w-[70%] h-[3px] bg-red-600 top-1/2 left-1/2 rotate-45 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[70%] h-[3px] bg-red-600 top-1/2 left-1/2 -rotate-45 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <h1 className="text-2xl font-bold">Payment Unsuccessful!</h1>
      <div className="text-4xl mt-2">☹️</div>
    </div>
  );
};

export default CancelPage;
