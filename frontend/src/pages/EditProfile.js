import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // Start as null for loading state

  // 👉 Fetch current customer details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('customerToken');

        const res = await axios.get('http://localhost:5000/api/customers/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData(res.data); // Set the form data
      } catch (err) {
        console.error('❌ Failed to load customer profile:', err);
      }
    };

    fetchProfile();
  }, []);

  // 👉 Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 👉 Handle submit to update backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('customerToken');

      await axios.put('http://localhost:5000/api/customers/edit-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(' Profile updated successfully!');
      navigate('/customer/dashboard');
    } catch (err) {
      console.error('❌ Failed to update customer profile:', err);
      alert('❌ Update failed!');
    }
  };

  if (!formData) {
    return <p className="text-center text-gray-600 mt-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <div className="flex items-center justify-center mb-6">
          <FaUserEdit className="text-green-700 text-3xl mr-2" />
          <h2 className="text-3xl font-bold text-green-700 tracking-wide">
            Edit Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="col-span-full">
            <h3 className="text-gray-600 font-semibold mb-1 border-b pb-1">Personal Information</h3>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">PIN Code</label>
            <input
              type="text"
              name="pincode"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-full mt-4">
            <h3 className="text-gray-600 font-semibold mb-1 border-b pb-1">Address Details</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.addressLine1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.addressLine2}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">District</label>
            <input
              type="text"
              name="district"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-full flex justify-center mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
