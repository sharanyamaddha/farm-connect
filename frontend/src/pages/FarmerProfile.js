import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FiClipboard } from 'react-icons/fi';
import axios from 'axios';

function FarmerProfile() {
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const token = localStorage.getItem('farmerToken');
        const res = await axios.get('http://localhost:5000/api/farmers/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmer(res.data);
        console.log("✅ Farmer fetched:", res.data);

      } catch (err) {
        console.error('Error fetching farmer profile:', err);
      }
    };

    fetchFarmer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <FaUser className="text-green-700 text-3xl mr-2" />
          <h2 className="text-3xl font-bold text-green-700 tracking-wide">Farmer Profile</h2>
        </div>

        {!farmer ? (
          <p className="text-center text-gray-500">Loading profile...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
              <div className="md:col-span-2 mb-2">
                <h3 className="text-gray-600 font-semibold text-base border-b pb-1">Personal Information</h3>
              </div>

              <div>
                <label className="text-gray-500 font-medium">Full Name</label>
                <p>{farmer.fullName}</p>
              </div>
              <div>
                <label className="text-gray-500 font-medium">Email</label>
                <p>{farmer.email}</p>
              </div>
              <div>
                <label className="text-gray-500 font-medium">Mobile</label>
                <p>{farmer.mobile}</p>
              </div>
              <div>
                <label className="text-gray-500 font-medium">Aadhar</label>
                <p>{farmer.aadhar}</p>
              </div>
              <div>
                <label className="text-gray-500 font-medium">Pincode</label>
                <p>{farmer.pincode}</p>
              </div>
              <div>
                <label className="text-gray-500 font-medium">Address Line 1</label>
                <p>{farmer.addressLine1}</p>
              </div>
              <div>
                <label className="text-gray-500 font-medium">Address Line 2</label>
                <p>{farmer.addressLine2}</p>
              </div>
              <div>
                <label className="text-gray-500 font-medium">State</label>
                <p>{farmer.state}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/farmers/profile/update')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FarmerProfile;
