import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiHome, FiTruck, FiSearch, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PaidOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDays, setFilterDays] = useState('all');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        const token = localStorage.getItem('customerToken');
        const res = await axios.get('http://localhost:5000/api/customers/paid-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch paid orders:', err);
      }
    };

    fetchPaidOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (filterDays !== 'all') {
      const days = filterDays === '7' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((order) => new Date(order.createdAt) > cutoff);
    }

    if (search.trim() !== '') {
      result = result.filter(
        (o) =>
          o.productName.toLowerCase().includes(search.toLowerCase()) ||
          o.farmerId?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredOrders(result);
  }, [filterDays, search, orders]);

  return (
    <div className="p-6 min-h-screen bg-green-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-800 flex items-center gap-3">
          <FiCheckCircle className="text-green-600" /> Paid Orders
        </h2>

        
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <div className="flex items-center w-full sm:w-1/3 border rounded-md bg-white">
          <FiSearch className="ml-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by product or farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-md focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
            className="px-4 py-2 rounded-md border bg-white"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-600 text-lg">💡 No matching paid orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-bold text-green-800 mb-2">{order.productName}</h3>
              <p className="text-gray-700"><strong>Quantity:</strong> {order.quantity}</p>
              <p className="text-gray-700"><strong>Amount:</strong> ₹{order.price}</p>
              <p className="text-gray-700"><strong>Farmer:</strong> {order.farmerId?.fullName || 'N/A'}</p>
              <p className="text-gray-700 mb-3">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                title="Track Order"
              >
                <FiTruck /> Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaidOrders;
