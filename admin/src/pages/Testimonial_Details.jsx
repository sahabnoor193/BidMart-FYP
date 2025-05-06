import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {  approveFeedback, declineFeedback, deleteFeedback, fetchAllFeedbacks, } from '../features/FeedBackSlice';
import { FiThumbsUp, FiClock, FiUser } from 'react-icons/fi';

const Testimonial_Details = () => {
  const dispatch = useDispatch();
  const feedback = useSelector((state) => state.feedback.singleFeedback);
  const allfeedback = useSelector((state) => state.feedback.allFeedbacks);
  const loading = useSelector((state) => state.feedback.loading);

  useEffect(() => {
    if (feedback) {
      dispatch(fetchAllFeedbacks());
    }
  }, [dispatch]);

  if (loading) return <div className="text-center py-12">Loading feedback...</div>;
  if (!feedback) return <div className="text-center py-12">Feedback not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Feedback Details</h1>
        </div>
        
        {/* Main Content */}
        <div className="p-6 md:p-8">
          {/* User Info */}
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {/* {feedback.name.charAt(0)} */}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{feedback.name}</h2>
              <div className="flex items-center text-gray-500 mt-1">
                <FiUser className="mr-1" />
                <span className="capitalize">{feedback.role}</span>
              </div>
            </div>
          </div>

          {/* Feedback Content */}
          <div className="mb-8">
            <div className="flex items-center mb-2 text-gray-600">
              <FiClock className="mr-2" />
              <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 whitespace-pre-line">{feedback.comment}</p>
            </div>

            <div className="flex items-center">
              <div className="flex mr-4">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-xl ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                feedback.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {feedback.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex space-x-3 border-t pt-4">
            <button
              onClick={() => dispatch(feedback.isApproved ? declineFeedback(feedback._id) : approveFeedback(feedback._id))}
              className={`flex items-center px-4 py-2 rounded-lg ${
                feedback.isApproved 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <FiThumbsUp className="mr-2" />
              {feedback.isApproved ? 'Disapprove' : 'Approve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial_Details;