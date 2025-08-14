import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate hook
import { AuthContext } from '../context/AuthContext';

function FarmerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ hook to navigate

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/farmers/login', {
        email,
        password
      });

      toast.success(res.data.message);

      login(res.data.farmer, res.data.token, 'farmer'); // update auth context
      localStorage.setItem('farmerToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.farmer));

      
      setTimeout(() => {
        navigate('/farmer/dashboard'); // ✅ smoother navigation
      }, 1500);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('❌ Farmer not found. Please register.');
      } else if (err.response?.status === 401) {
        toast.error('❌ Incorrect password.');
      } else {
        toast.error('❌ Login failed. Try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl px-10 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-700 font-poppins">
          Farmer Login
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogin}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default FarmerLogin;
