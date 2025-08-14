import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/customers/login', {
        email,
        password,
      });

      const { token, customer } = res.data;

      // ✅ Store token and user
      localStorage.setItem('customerToken', token);
      localStorage.setItem('customer', JSON.stringify(customer));
       localStorage.setItem('customerId', customer.id);


      // ✅ Update auth context
      login(customer, token, 'customer');


      toast.success(res.data.message);

      // ✅ Redirect after short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl px-10 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-700 font-poppins">
          Customer Login
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogin}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 font-poppins text-base"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
