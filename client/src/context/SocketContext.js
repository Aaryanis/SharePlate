import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket server when authenticated
    if (isAuthenticated && user) {
      const socketInstance = io(process.env.REACT_APP_API_URL || '', {
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        
        // Send user ID to server
        socketInstance.emit('userConnected', user.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      // Listen for food availability notifications (for NGOs)
      socketInstance.on('foodAvailable', (data) => {
        console.log('Food available notification:', data);
        setNotifications(prev => [data, ...prev]);
      });

      // Listen for donation accepted notifications (for donors)
      socketInstance.on('donationAccepted', (data) => {
        console.log('Donation accepted notification:', data);
        setNotifications(prev => [data, ...prev]);
      });

      // Listen for donation completed notifications (for donors)
      socketInstance.on('donationCompleted', (data) => {
        console.log('Donation completed notification:', data);
        setNotifications(prev => [data, ...prev]);
      });

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
      };
    }

    // Disconnect when logged out
    if (!isAuthenticated && socket) {
      socket.disconnect();
      setSocket(null);
      setNotifications([]);
      setIsConnected(false);
    }
  }, [isAuthenticated, user]);

  // Send food listing notification
  const notifyNewFood = (foodData) => {
    if (socket && isConnected) {
      socket.emit('newFoodListing', foodData);
    }
  };

  // Send donation confirmed notification
  const notifyDonationConfirmed = (donationData) => {
    if (socket && isConnected) {
      socket.emit('donationConfirmed', donationData);
    }
  };

  // Send donation completed notification
  const notifyDonationCompleted = (donationData) => {
    if (socket && isConnected) {
      socket.emit('donationCompleted', donationData);
    }
  };

  // Clear notification by index
  const clearNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        notifyNewFood,
        notifyDonationConfirmed,
        notifyDonationCompleted,
        clearNotification,
        clearAllNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;