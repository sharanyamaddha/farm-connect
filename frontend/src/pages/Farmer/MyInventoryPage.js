import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyInventoryPage() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('farmerToken');
        const response = await axios.get('http://localhost:5000/api/farmer/inventory/my-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen px-8 py-10 bg-green-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
        📦 My Inventory
      </h2>

      {inventory.length === 0 ? (
        <p className="text-center text-gray-500 italic">No inventory items added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-6 border border-green-200 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {item.productName || 'Unknown Product'}
              </h3>
              <p className="text-gray-700">
                <strong>Price/Unit:</strong> ₹{item.pricePerUnit}
              </p>
              <p className="text-gray-700">
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p className="text-gray-700">
                <strong>Total Price:</strong> ₹{item.totalPrice}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInventoryPage;