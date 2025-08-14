import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <div className="flex items-center justify-center mb-6">
          <FaUser className="text-green-700 text-3xl mr-2" />
          <h2 className="text-3xl font-bold text-green-700 tracking-wide">My Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
          <div className="md:col-span-2 mb-2">
            <h3 className="text-gray-600 font-semibold text-base border-b pb-1">Personal Information</h3>
          </div>

          <div>
            <label className="text-gray-500 font-medium">Full Name</label>
            <p>{user?.name || 'N/A'}</p>
          </div>

          <div>
            <label className="text-gray-500 font-medium">Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>

          <div>
            <label className="text-gray-500 font-medium">Phone</label>
            <p>{user?.phone || 'N/A'}</p>
          </div>

          <div>
            <label className="text-gray-500 font-medium">Pincode</label>
            <p>{user?.pincode || 'N/A'}</p>
          </div>

          <div>
            <label className="text-gray-500 font-medium">Address Line 1</label>
            <p>{user?.addressLine1 || 'N/A'}</p>
          </div>

          <div>
            <label className="text-gray-500 font-medium">Address Line 2</label>
            <p>{user?.addressLine2 || 'N/A'}</p>
          </div>

          <div>
            <label className="text-gray-500 font-medium">District</label>
            <p>{user?.district || 'N/A'}</p>
          </div>

          <div>
            <label className="text-gray-500 font-medium">State</label>
            <p>{user?.state || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/edit-profile')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
