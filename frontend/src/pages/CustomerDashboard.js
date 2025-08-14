import React, { useState } from 'react';
import CustomerProfile from './CustomerProfile'; // Your existing CustomerProfile.js
import PaidOrders from './PaidOrders'; // Your existing PaidOrders.js
import { FaUser, FaBox, FaSignOutAlt,FaCog  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">My Account</h2>

        <ul className="space-y-3">
          <li
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-green-100 ${activeTab === 'profile' ? 'bg-green-100' : ''}`}
          >
            <FaUser /> Profile
          </li>

          <li
            onClick={() => setActiveTab('orders')}
            className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-green-100 ${activeTab === 'orders' ? 'bg-green-100' : ''}`}
          >
            <FaBox /> Orders
          </li>

                    <li
            onClick={() => console.log('Go to settings...')} // replace with navigation logic
            className="cursor-pointer flex items-center gap-2 text-gray-700 p-2 rounded hover:bg-gray-100"
            >
            <FaCog /> Settings
            </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        {activeTab === 'profile' && <CustomerProfile />}
        {activeTab === 'orders' && <PaidOrders />}
      </div>
    </div>
  );
};

export default CustomerDashboard;
