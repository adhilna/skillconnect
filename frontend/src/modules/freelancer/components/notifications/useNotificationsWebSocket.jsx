import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';

const useNotificationsWebSocket = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) return;

    const backendHost = 'localhost:8000';
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsScheme}://${backendHost}/ws/notifications/?token=${token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Notification WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const notification = data.notification;  // Extract notification object
        if (notification) {
          setNotifications(prev => [notification, ...prev]); // Prepend
        } else {
          console.warn('Received WS message without notification key:', data);
        }
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    socket.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('Notification WebSocket disconnected', event);
      // Optional: add reconnect logic here
    };

    return () => {
      console.log('Closing Notification WebSocket');
      socket.close();
    };
  }, [token]);

  return notifications;
};

export default useNotificationsWebSocket;
