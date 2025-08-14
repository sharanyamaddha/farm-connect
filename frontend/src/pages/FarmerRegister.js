import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function FarmerRegister() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Access login()

  const initialState = {
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    aadhar: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    pincode: '',
    landDoc: null,
    landPhoto: null,
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post('http://localhost:5000/api/farmers/register', data);
      toast.success('✅ Farmer registered successfully!');

      // ✅ Extract registered user and token from response
      const { farmer, token } = res.data;

      // ✅ Set Auth Context and Local Storage
      login(farmer, token, 'farmer'); // 🔥 This line ensures navbar updates!

      setFormData({ ...initialState });

      // ✅ Navigate after login state is updated
      setTimeout(() => navigate('/farmer/dashboard'), 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warn('Farmer already registered. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        toast.error('❌ Failed to register farmer.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-5 pb-5 px-4">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-12 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">Farmer Registration</h2>

        <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          {[['Full Name', 'fullName', 'text'],
            ['Email Address', 'email', 'email'],
            ['Password', 'password', 'password'],
            ['Mobile Number (with OTP)', 'mobile', 'tel'],
            ['Aadhar Number', 'aadhar', 'text']
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="block text-md font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Address Line 1', 'addressLine1'],
              ['Address Line 2', 'addressLine2'],
              ['State', 'state'],
              ['Pincode', 'pincode']
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block text-md font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  required
                />
              </div>
            ))}
          </div>

          {[['Land Ownership Document (e.g., 7/12, Patta)', 'landDoc'],
            ['Your Recent Photo with Land', 'landPhoto']
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-md font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="file"
                name={name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:cursor-pointer"
                required
              />
            </div>
          ))}

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

export default FarmerRegister;