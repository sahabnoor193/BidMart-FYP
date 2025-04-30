import React from 'react';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ChatIcon = ({ sellerId }) => {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to start a chat');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('User not found');
        return;
      }

      console.log('User from localStorage:', user);
      console.log('Sender ID:', user?._id);

      // Create or get existing conversation
      const response = await axios.post(
        'http://localhost:5000/api/conversations',
        {
          senderId: user._id,
          receiverId: sellerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Redirect to BuyerDashboard with the "chats" tab active and conversation ID
      navigate('/buyer-dashboard', {
        state: { activeTab: 'chats', conversationId: response.data._id },
      });
    } catch (error) {
      console.error('Chat error:', error);
      alert(error.response?.data?.message || 'Failed to start chat');
    }
  };

  return (
    <button
      onClick={handleStartChat}
      className="p-2 border rounded-lg transition-colors duration-200 hover:bg-gray-50"
      aria-label="Contact seller"
    >
      <MessageCircle className="w-6 h-6 stroke-gray-600 hover:stroke-blue-600" />
    </button>
  );
};

ChatIcon.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default ChatIcon;