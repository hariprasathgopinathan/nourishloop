import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentUser, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.data?.success) {
        setNotifications(response.data.data);
      } else if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (currentUser && role) {
      fetchNotifications();
      
      connectSocket().then((socket) => {
        socket.on('notification:new', (notification) => {
          setNotifications((prev) => [notification, ...prev]);
        });
        
        socket.on('donation:status-updated', () => {
          // Might want to emit an event or rely on other contexts re-fetching,
          // for now we can just log it or dispatch an event
          window.dispatchEvent(new CustomEvent('donation-updated'));
        });
      }).catch(err => console.error('Socket connection error:', err));
    } else {
      disconnectSocket();
      setNotifications([]);
    }

    return () => {
      disconnectSocket();
    };
  }, [currentUser, role]);

  useEffect(() => {
    const count = notifications.filter(n => !n.readAt).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      const response = await markNotificationAsRead(id);
      if (response.data?.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, readAt: response.data.data.readAt } : n))
        );
      } else if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, readAt: response.data.readAt } : n))
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.data?.success || response.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
        );
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
