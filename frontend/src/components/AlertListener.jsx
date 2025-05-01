import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import socket from '../socket';

const GlobalAlertListener = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    console.log(`🟢 Connecting to alert socket for user: ${userId}`);
    socket.emit('joinUserRoom', userId);

    const handleNewAlert = (alert) => {
      console.log('📨 Alert received:', alert);
      toast.info(`🔔 ${alert.action} - ${alert.productName}`);
    };

    socket.on('newAlert', handleNewAlert);

    return () => {
      console.log(`🔴 Disconnecting from alert socket for user: ${userId}`);
      socket.emit('leaveUserRoom', userId);
      socket.off('newAlert', handleNewAlert);
    };
  }, [userId]);

  return null;
};

export default GlobalAlertListener;
