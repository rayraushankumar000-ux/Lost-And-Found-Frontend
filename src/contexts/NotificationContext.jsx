import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  // Initialize Socket.IO connection
  useEffect(() => {
    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    
    if (isAuthenticated && user) {
      // Connect to Socket.IO server
      socketRef.current = io(socketURL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('✅ Socket.IO connected:', socket.id);
        
        // Join user's personal room for notifications
        socket.emit('joinRoom', `user_${user.id}`);
        
        // Join admin room if user is admin
        if (user.role === 'admin') {
          socket.emit('joinRoom', 'admin');
        }
      });

      // Listen for new item notifications
      socket.on('newItem', (data) => {
        console.log('📦 New item notification:', data);
        addNotification({
          title: 'New Item Reported',
          message: `${data.item?.title || 'An item'} has been reported`,
          type: 'info',
          data: data.item
        });
      });

      // Listen for chat messages
      socket.on('chatMessage', (data) => {
        console.log('💬 Chat message:', data);
        addNotification({
          title: 'New Message',
          message: data.message || 'You have a new message',
          type: 'message',
          data: data
        });
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket.IO disconnected');
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
      });

      // Cleanup on unmount
      return () => {
        if (socket) {
          socket.emit('leaveRoom', `user_${user.id}`);
          if (user.role === 'admin') {
            socket.emit('leaveRoom', 'admin');
          }
          socket.disconnect();
        }
      };
    } else {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [isAuthenticated, user]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      read: false,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const sendChatMessage = (room, message, sender) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('chatMessage', { room, message, sender });
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    sendChatMessage,
    socket: socketRef.current
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
