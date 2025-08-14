import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FarmerRegister from '../pages/FarmerRegister';
import CustomerRegister from '../pages/CustomerRegister';

function RegisterType() {
  const [selectedType, setSelectedType] = useState(''); // 'farmer' or 'customer'
  const location = useLocation();

  // Reset to selection screen when URL is /register
  useEffect(() => {
    if (location.pathname === '/register') {
      setSelectedType('');
    }
  }, [location]);

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center ">
      {selectedType === '' ? (
        // Step 1: Choose Farmer or Customer
        <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
            Choose Your Registration Type
          </h2>

          <div className="flex flex-col space-y-8">
            {/* Farmer Button */}
            <button
              onClick={() => handleSelect('farmer')}
              className="bg-green-600 text-white py-5 rounded-xl text-center text-xl font-semibold transition-transform transform hover:scale-105 hover:bg-green-700 shadow-lg"
            >
              <span className="block mb-2 text-3xl font-bold">🌾</span>
              <span className="block text-xl">Farmer Registration</span>
            </button>

            {/* Customer Button */}
            <button
              onClick={() => handleSelect('customer')}
              className="bg-green-600 text-white py-5 rounded-xl text-center text-xl font-semibold transition-transform transform hover:scale-105 hover:bg-green-700 shadow-lg"
            >
              <span className="block mb-2 text-3xl font-bold">🍽️</span>
              <span className="block text-xl">Customer Registration</span>
            </button>
          </div>
        </div>
      ) : selectedType === 'farmer' ? (
        // Step 2: Farmer Registration Form
        <FarmerRegister />
      ) : (
        // Step 2: Customer Registration Form
        <CustomerRegister />
      )}
    </div>
  );
}

export default RegisterType;
