import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaPhone,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBoxOpen,
  FaRoad,
  FaBell,
  FaCheckCircle,
  FaSyncAlt
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function FarmerListPage() {
  const { categoryName, productName } = useParams();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null); // 🚀 Track order status
  const [notification, setNotification] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/customers/farmers-for-product/${categoryName}/${productName}`
        );
        setFarmers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching farmers:', err);
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [categoryName, productName]);

  const handleOrderNow = async (farmerId) => {
    if (!isAuthenticated) {
      toast.warning("Please login to place an order");
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/customers/place-order',
        {
          farmerId,
          productName,
          categoryName,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('customerToken')}`,
          },
        }
      );

      toast.success("✅ Order request sent! Check notification for farmer's approval.");
      setOrderStatus({ farmerId, status: 'pending' });
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error("Failed to send order request");
    }
  };

  const checkNotificationStatus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('customerToken')}`,
        },
      });

      const accepted = res.data.find(
        (n) => n.farmerId === orderStatus.farmerId && n.productName === productName
      );

      if (accepted) {
        setNotification(accepted);
        toast.success("✅ Farmer accepted your order. You can now proceed.");
      } else {
        toast.info("⏳ No update yet. Please wait for farmer confirmation.");
      }
    } catch (err) {
      console.error("❌ Error checking notifications:", err);
      toast.error("Failed to fetch notifications");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-6 py-10">
      <h2 className="text-4xl font-extrabold text-center text-green-800 mb-10">
        👨‍🌾 Farmers Selling <span className="capitalize">{productName}</span>
      </h2>
{orderStatus && (
  <div className="bg-yellow-100 border-l-4 border-yellow-600 text-yellow-900 p-5 mb-6 rounded-md shadow-md transition-all">
    <div className="flex items-start justify-between flex-col sm:flex-row gap-3">
      <div className="flex items-start gap-3">
        <FaBell className="text-2xl text-yellow-600 mt-1" />
        <div>
          <p className="font-medium text-base">
            ✅ Order request sent to the farmer!
          </p>
          <p className="text-sm text-yellow-800 mt-1">
            Please check your notifications for updates. Once the farmer accepts your order,
            you will receive a notification and can proceed further.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/notifications')}
        className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm transition"
      >
        <FaSyncAlt className="animate-spin-slow" />
        Go to Notifications
      </button>
    </div>
  </div>
)}


      {notification && (
        <div className="bg-green-100 border-l-4 border-green-600 text-green-800 p-4 mb-6 rounded-md shadow">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-xl" />
            <p>
              Farmer <strong>{notification.farmerName}</strong> accepted your order! 🎉<br />
              Contact: <strong>{notification.farmerPhone}</strong><br />
              Address: <strong>{notification.addressLine1}, {notification.pincode}</strong>
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-lg text-gray-500 italic">
          Loading farmers near you...
        </p>
      ) : farmers.length === 0 ? (
        <div className="text-center text-gray-600 text-lg italic mt-20">
          🚜 Sorry! No farmers are selling <strong>{productName}</strong> in this category right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-green-200 p-4 text-sm"
            >
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                👨‍🌾 {farmer.farmerName}
              </h3>

              <p className="flex items-center text-gray-700 mb-1">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                {`${farmer.addressLine1}, ${farmer.addressLine2}, ${farmer.pincode}, ${farmer.state}`}
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <FaPhone className="mr-2 text-green-600" /> {farmer.contact}
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <FaRupeeSign className="mr-2 text-green-600" /> ₹{farmer.pricePerUnit} / unit
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <FaBoxOpen className="mr-2 text-green-600" /> Qty: {farmer.quantity}
              </p>

              <p className="flex items-center text-gray-700 mb-3">
                <FaRoad className="mr-2 text-green-600" /> {farmer.distance} km away
              </p>

              <button
                disabled={orderStatus !== null && orderStatus.farmerId === farmer.farmerId}
                className={`w-full py-2 rounded-md transition text-sm ${
                  orderStatus !== null && orderStatus.farmerId === farmer.farmerId
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={() => handleOrderNow(farmer.farmerId)}
              >
                {orderStatus !== null && orderStatus.farmerId === farmer.farmerId
                  ? 'Requested'
                  : 'Request Order'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FarmerListPage;
