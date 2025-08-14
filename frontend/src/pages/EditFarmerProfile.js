import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

function EditFarmerProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('farmerToken');
      const res = await axios.get('http://localhost:5000/api/farmers/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('farmerToken');
    try {
      await axios.put('http://localhost:5000/api/farmers/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Profile updated successfully!');
      navigate('/farmer/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('❌ Failed to update profile');
    }
  };

  if (!formData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <div className="flex items-center justify-center mb-6">
          <FaUserEdit className="text-green-700 text-3xl mr-2" />
          <h2 className="text-3xl font-bold text-green-700 tracking-wide">Edit Farmer Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {[
            'fullName',
            'email',
            'mobile',
            'aadhar',
            'pincode',
            'addressLine1',
            'addressLine2',
            'state',
          ].map((field) => (
            <div key={field} className={field.includes('address') ? 'md:col-span-2' : ''}>
              <label className="block text-gray-700 font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-300"
                required
              />
            </div>
          ))}

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

export default EditFarmerProfile;
