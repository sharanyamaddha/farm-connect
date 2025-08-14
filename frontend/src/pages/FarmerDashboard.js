import React, { useContext,useEffect ,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPackage,
  FiClipboard,
  FiDollarSign,
  FiRepeat,
  FiGlobe,
  FiLogOut,
  FiList,
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

function FarmerDashboard() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
const [pendingOrder, setPendingOrder] = useState(null);
const farmer = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

    useEffect(() => {
    if (!socket) return;

  socket.on('order_placed', (data) => {
      setPendingOrder(data);
    });

    return () => socket.off('order_placed');
  }, [socket]);


 const handleResponse = (status) => {
  socket.emit('order_response', {
    customerId: pendingOrder.customerId,
    product: pendingOrder.product,
    status,
    orderId: pendingOrder.orderId, // Include orderId
  });

  toast.success(`✅ You ${status}ed the order`);
  setPendingOrder(null);
};


  const handleLanguageChange = () => {
    const elem = document.getElementById('google_translate_element');
    if (elem) {
      elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
    }
  };

  const menuItems = [
    {
      title: 'Add / Update Inventory',
      icon: <FiPackage size={32} />,
      path: '/farmer/inventory',
      color: 'bg-green-700',
    },
    {
      title: 'My Inventory',
      icon: <FiList size={32} />,
      path: '/farmer/my-inventory',
      color: 'bg-indigo-600',
    },
    {
      title: 'View Orders',
      icon: <FiClipboard size={32} />,
      path: '/farmer/orders',
      color: 'bg-blue-500',
    },
    {
      title: 'View Earnings',
      icon: <FiDollarSign size={32} />,
      path: '/farmer/earnings',
      color: 'bg-green-500',
    },
    {
      title: 'View Transactions',
      icon: <FiRepeat size={32} />,
      path: '/farmer/transactions',
      color: 'bg-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-green-800">👨‍🌾 Welcome, {farmer?.fullName || "Farmer"}</h1>

        <div className="flex items-center gap-4">
          {/* Change Language */}
         <div className="relative">
              <button
                onClick={() => {
                  const elem = document.getElementById('google_translate_element');
                  if (elem) {
                    elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
                  }
                }}
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full transition duration-200 shadow-sm hover:shadow-md z-20 relative"
                title="Change Language"
              >
                <FiGlobe className="text-xl" />
                <span className="font-medium hidden sm:inline">Language</span>
              </button>

              <div
                id="google_translate_element"
                className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10"
                style={{ display: 'none' }}
              ></div>
            </div>


          {pendingOrder && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto text-center">
          <p className="font-semibold text-lg">New Order Received</p>
          <p className="mt-2 text-gray-700">
            {pendingOrder.quantity} × {pendingOrder.product}
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => handleResponse('accept')}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => handleResponse('reject')}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      )}

          {/* Logout Button (Optional: Uncomment if needed) */}
          {/* <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 flex items-center gap-2"
          >
            <FiLogOut /> Log Out
          </button> */}
        </div>
      </div>

      {/* Dashboard Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`h-60 p-8 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center hover:scale-105 transition transform ${item.color}`}
          >
            {item.icon}
            <span className="mt-4 text-xl font-semibold text-center">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FarmerDashboard;
