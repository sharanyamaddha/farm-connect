// ✅ FIXED CODE FOR SERVER SIDE AND CLIENT SIDE FLOW

// === SERVER FILE (Unchanged from previous submission) ===
// ...your server code remains as in canvas above...

// === FARMER ORDERS PAGE (CLIENT SIDE) ===
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FarmerOrdersPage() {
  const [orderRequests, setOrderRequests] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('farmerToken');
      const res = await axios.get('http://localhost:5000/api/farmers/farmer/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderRequests(res.data.orderRequests || []);
      setConfirmedOrders(res.data.confirmedOrders || []);
      setReceivedOrders(res.data.receivedOrders || []);
    } catch (err) {
      console.error('Error loading orders:', err.response?.data || err.message);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const token = localStorage.getItem('farmerToken');
      const acceptedOrder = orderRequests.find(order => order._id === orderId);

      await axios.put(`http://localhost:5000/api/farmers/orders/${orderId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Instant UI feedback without waiting for fetchOrders()
      setOrderRequests(prev => prev.filter(order => order._id !== orderId));
      setConfirmedOrders(prev => [...prev, { ...acceptedOrder, status: 'Accepted' }]);
    } catch (err) {
      console.error('Error accepting order:', err.response?.data || err.message);
    }
  };

  const handleReject = async (orderId) => {
    try {
      const token = localStorage.getItem('farmerToken');
      await axios.put(`http://localhost:5000/api/farmers/orders/${orderId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchOrders();
    } catch (err) {
      console.error('Error rejecting order:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 mb-6">📦 Farmer Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🛎️ Order Requests */}
        <div>
          <h2 className="text-xl font-semibold text-yellow-700 mb-4">🛎️ Order Requests</h2>
          {orderRequests.length === 0 ? (
            <p className="text-gray-500">No pending order requests.</p>
          ) : (
            <div className="space-y-4">
              {orderRequests.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow">
                  <p><strong>Product:</strong> {order.productName}</p>
                  <p><strong>Customer:</strong> {order.customerId?.fullName || "Unknown"}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Address:</strong> {order.customerId?.addressLine1}, {order.customerId?.district}</p>
                  <p><strong>Price:</strong> ₹{order.price || 'N/A'}</p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleAccept(order._id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      ✅ Accept
                    </button>
                    <button
                      onClick={() => handleReject(order._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Confirmed Orders */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-4">✅ Confirmed Orders</h2>
          {confirmedOrders.length === 0 ? (
            <p className="text-gray-500">No confirmed orders.</p>
          ) : (
            <div className="space-y-4">
              {confirmedOrders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow">
                  <p><strong>Product:</strong> {order.productName}</p>
                  <p><strong>Customer:</strong> {order.customerId?.fullName || "Unknown"}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p className="text-blue-700 font-medium">Status: {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 💰 Received Orders */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-4">💰 Received Orders</h2>
          {receivedOrders.length === 0 ? (
            <p className="text-gray-500">No paid orders yet.</p>
          ) : (
            <div className="space-y-4">
              {receivedOrders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow">
                  <p><strong>Product:</strong> {order.productName}</p>
                  <p><strong>Customer:</strong> {order.customerId?.fullName || "Unknown"}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p className="text-green-700 font-medium">Status: {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmerOrdersPage;
