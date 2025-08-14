import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('customerToken');
        const res = await axios.get('http://localhost:5000/api/customers/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error loading saved notifications:', err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
  const newNotification = {
    message: data.message,
    productName: data.productName,
    quantity: data.quantity,
    farmerId: data.farmerId,
    farmerName: data.farmerName,
    farmerPhone: data.farmerPhone,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    state: data.state,
    pincode: data.pincode,
    createdAt: new Date().toISOString(),
  };
  setNotifications(prev => [newNotification, ...prev]);
};


    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, [socket]);

  const handleOrderNow = (notification) => {
    if (!notification.farmerId) {
    console.error("❌ Notification is missing farmerId!", notification);
    alert("Error: Farmer ID is missing in notification. Cannot proceed.");
    return;
    }
  console.log("🔔 Notification clicked:", notification);

  const item = {
    name: notification.productName,
    quantity: notification.quantity,
    price: "₹100",
    image: '/placeholder.jpg',
    addressLine1: notification.addressLine1,
    addressLine2: notification.addressLine2,
    state: notification.state,
    pincode: notification.pincode,
    farmerName: notification.farmerName,
    farmerPhone: notification.farmerPhone,
    farmerId: notification.farmerId,
    time: new Date(notification.createdAt).toLocaleTimeString(),
  };

  console.log("✅ Item passed to checkout:", item);

  navigate('/checkout', {
    state: {
      fromNotification: true,
      item
  }
  });
};


  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications yet</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((noti, idx) => (
            <li key={idx} className="bg-green-100 p-4 rounded shadow">
              <p className="font-medium text-green-800">{noti.message}</p>
              <p className="text-sm text-gray-700 mt-1">
                Product: <strong>{noti.productName}</strong> | 
                Quantity: <strong>{noti.quantity}</strong> | 
                Farmer: <strong>{noti.farmerName}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(noti.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleOrderNow(noti)}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
              >
                Order this item
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
