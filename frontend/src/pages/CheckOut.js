import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../pages/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { loadRazorpay } from '../utils/loadRazorpay';
import { toast } from 'react-toastify';

function CheckOut() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [finalItems, setFinalItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);

  const fromNotification = location.state?.fromNotification || false;
  const notificationItem = location.state?.item;

  useEffect(() => {
    if (fromNotification && notificationItem) {
      setFinalItems([{ ...notificationItem, quantity: notificationItem.quantity || 1 }]);
    } else {
      setFinalItems(cartItems);
    }
  }, [fromNotification, notificationItem, cartItems]);

  useEffect(() => {
    if (finalItems.length > 1) {
      const farmerIds = finalItems.map(item => item.farmerId);
      const uniqueFarmerIds = new Set(farmerIds);
      if (uniqueFarmerIds.size > 1) {
        alert('You can only place an order from one farmer at a time.');
        navigate('/cart');
      }
    }
  }, [finalItems, navigate]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const token = localStorage.getItem('customerToken');
        const res = await axios.get('http://localhost:5000/api/customers/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomerInfo(res.data);
        
      } catch (err) {
        console.error('❌ Error fetching customer details:', err);
      }
    };
    fetchCustomerDetails();
  }, []);

  const deliveryCharge = 20;
  const totalPrice = finalItems.reduce((acc, item) => {
    const price = parseInt(item.pricePerUnit || item.price?.replace(/[^0-9]/g, '') || '0');
    return acc + price * item.quantity;
  }, 0) + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (finalItems.length === 0) {
      alert('No items to place an order.');
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/create-order', {
        amount: totalPrice
      });

      const options = {
        key: "rzp_test_RY6hTeSlqjmQvd",
        amount: data.order.amount,
        currency: "INR",
        name: "Kisan Setu",
        description: "Product Payment",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const token = localStorage.getItem('customerToken');

            // Place order for each item, record transaction
            const placeAndRecord = finalItems.map(async (item) => {
              const payload = {
                farmerId: item.farmerId,
                productName: item.name || item.productName,
                categoryName: item.categoryName || "Default",
                quantity: item.quantity
              };

              // ✅ Step 1: Place the order
              const orderRes = await axios.post(
                'http://localhost:5000/api/customers/place-order',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const orderId = orderRes.data.orderId || orderRes.data._id;

              // ✅ Step 2: Record the transaction and update order
              await axios.post(
                'http://localhost:5000/api/farmer/transactions/record',
                {
                  farmerId: payload.farmerId,
                  productName: payload.productName,
                  quantity: payload.quantity,
                  amount: totalPrice,
                  paymentId: response.razorpay_payment_id,
                  orderId
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            });

            await Promise.all(placeAndRecord);
            //alert('✅ Payment successful and order placed!');
            navigate('/customer/paid-orders');
            toast.success("🎉 Payment successful! Your order has been placed.");

          } catch (error) {
            console.error("❌ Order placement error:", error);
            alert('Payment was successful but order failed. Please contact support.');
          }
        },
        prefill: {
          name: customerInfo?.fullName || "Test User",
          email: customerInfo?.email || "test@example.com",
          contact: customerInfo?.phone || "9999999999"
        },
        theme: {
          color: "#0B8457"
        }
      };

      const razor = new window.Razorpay(options);

      razor.on('payment.failed', function (response) {
        console.error("❌ Razorpay Payment Failed:", response.error);
        alert("Payment failed: " + response.error.description);
      });

      razor.open();
    } catch (error) {
      console.error("❌ Order placement error:", error);
      alert('Payment was successful but order failed. Please contact support.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">🧾 Checkout</h2>
          <p className="text-gray-600">You must log in to proceed with checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl w-full">
        <h2 className="text-xl font-extrabold text-center pb-3">Order Summary</h2>

        <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
          {customerInfo ? (
            <p>
              {customerInfo.fullName}<br />
              {customerInfo.addressLine1},<br />
              {customerInfo.addressLine2},<br />
              {customerInfo.state} – {customerInfo.pincode}<br />
              Mobile: +91 {customerInfo.phone}
            </p>
          ) : (
            <p className="text-gray-500">Loading address...</p>
          )}
          <button onClick={() => navigate('/edit-profile')} className="mt-2 text-blue-500 underline text-sm">
            Change Address
          </button>
        </div>

        {finalItems.map((item, index) => (
          <div key={index} className="flex gap-5 mb-6 border-b pb-4">
            <div className="w-2/5">
              <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
            </div>
            <div className="w-3/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold">{item.name || item.productName}</h3>
                <p className="text-green-700 text-lg mt-1">{item.pricePerUnit || item.price}</p>
                <p className="text-gray-600 text-sm mt-1">
                  📍 {item.addressLine1}, {item.addressLine2}, {item.state} – {item.pincode}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  👨‍🌾 {item.farmerName} | 📞 {item.farmerPhone}
                </p>
                <p className="text-gray-400 text-xs mt-1">⏰ {item.time || 'Today'}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 border-t pt-4 text-sm">
          {finalItems.map((item, i) => {
            const price = parseInt(item.pricePerUnit || item.price?.replace(/[^0-9]/g, '') || '0');
            return (
              <div key={i} className="flex justify-between">
                <span>{item.name} ({item.quantity} × ₹{price})</span>
                <span>₹{price * item.quantity}</span>
              </div>
            );
          })}
          <div className="flex justify-between mt-2">
            <span>Delivery Charges</span>
            <span>₹{deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-semibold mt-2 text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 text-lg rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
