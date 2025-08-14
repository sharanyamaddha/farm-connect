import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ import this

function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  const navigate = useNavigate(); // ✅ initialize here

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/customer/register', formData);
      //navigate('/login'); // ✅ go to login after successful register
       toast.success(res.data.message);
    } catch (err) {
      if(err.response?.status===409){
        toast.warn("User already registered. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      }
    else{
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-5 pb-5 px-4">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-12 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">Customer Registration</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-2 bg-green-600 text-white rounded-md text-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;