import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFeedbacks,
  fetchApprovedFeedbacks,
  approveFeedback,
  declineFeedback,
  deleteFeedback,
  setSingleFeedback,
} from "../features/FeedBackSlice";
import { FiThumbsUp, FiThumbsDown, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Testimonials = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const approvedFeedbacks = useSelector(
    (state) => state.feedback.approvedFeedbacks
  );
  const allFeedbacks = useSelector((state) => state.feedback.allFeedbacks);
  const loading = useSelector((state) => state.feedback.loading);
  const error = useSelector((state) => state.feedback.error);
  const feedback = useSelector((state) => state.feedback.singleFeedback);
 
  console.log(feedback);

  useEffect(() => {
    dispatch(fetchApprovedFeedbacks());
    dispatch(fetchAllFeedbacks());
  }, [dispatch]);

  const handleApprove = (feedbackId) => {
    dispatch(approveFeedback(feedbackId));
  };

  const handleDecline = (feedbackId) => {
    dispatch(declineFeedback(feedbackId));
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(feedbackId));
    }
  };
  
  const Navigation = ( feedback ) => {
    dispatch(setSingleFeedback( feedback ))
     navigate("/Testimonial_Details")
  }
  

  if (loading)
    return <div className="text-center py-8">Loading feedbacks...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  // console.log(allFeedbacks, approvedFeedbacks);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* All Feedbacks Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">All Feedbacks</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Comment</th>
                <th className="py-3 px-4 text-left">Ratings</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
                <th className="py-3 px-4 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {allFeedbacks.map((feedback) => (
                <tr
                  key={feedback._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{feedback.name}</td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    {feedback.comment}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < feedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    {feedback.role.toLowerCase()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        feedback.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {feedback.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          console.log("View feedback:", feedback._id)
                        }
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View"
                      >
                        <FiEye />
                      </button>
                      {feedback.isApproved ? (
                        <button
                          onClick={() => handleDecline(feedback._id)}
                          className="text-green-500 hover:text-green-700 p-1"
                          title="Click to disapprove"
                        >
                          <FiThumbsUp className="fill-current" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(feedback._id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                          title="Click to approve"
                        >
                          <FiThumbsUp />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                  <td>
                    <button 
                    onClick={()=>Navigation(feedback)}
                      className="flex items-center px-3 py-1 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
                    >
                      <FiEye className="inline mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Approved Feedbacks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Approved Testimonials</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {feedback.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">{feedback.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{feedback.comment}</p>
              <div className="flex justify-between items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`${
                        i < feedback.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Approved
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
