
import React, { useState } from 'react';
import axios from 'axios';

function ProductSelector({ products , selectedCategory, selectedSubcategory}) {
  const [selectedProducts, setSelectedProducts] = useState({});

  // Handle quantity change (with minimum = 0)
  const handleQuantityChange = (productId, delta) => {
  setSelectedProducts((prev) => {
    const newQty = Math.max((prev[productId]?.quantity || 0) + delta, 0);
    return {
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: newQty,
        pricePerUnit: prev[productId]?.pricePerUnit || 0,
      },
    };
  });
};


  // Handle price change
  const handlePriceChange = (productId, value) => {
  const parsedValue = parseFloat(value) || 0;
  setSelectedProducts((prev) => ({
    ...prev,
    [productId]: {
      ...prev[productId],
      pricePerUnit: parsedValue,
      quantity: prev[productId]?.quantity || 0, // make sure quantity is not lost
    },
  }));
};


  // Handle submission


const handleSubmit = async () => {
 const inventoryArray = Object.entries(selectedProducts)
  .filter(([_, data]) => data.quantity > 0 && data.pricePerUnit > 0)
  .map(([productId, data]) => {
    const product = products.find((p) => p._id === productId);
    return {
      productId,
      productName: product?.name || 'Unknown',
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      totalPrice: data.quantity * data.pricePerUnit, // Also sent to backend
      category: selectedCategory,
      subcategory: selectedSubcategory,
    };
  });


  try {
    const token = localStorage.getItem('farmerToken');

    await axios.post(
      'http://localhost:5000/api/farmer/inventory/add-bulk',
      { inventory: inventoryArray },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    alert("✅ Inventory saved successfully!");
  } catch (err) {
    console.error("Failed to save inventory", err);
    if (err.response) {
      console.log("📛 Backend error response:", err.response.data);
    }
    alert("❌ Failed to save inventory.");
  }
};



  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-300 p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <h4 className="text-lg font-semibold mb-2 text-green-700">{product.name}</h4>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => handleQuantityChange(product._id, -1)}> - </button>
              <span>{selectedProducts[product._id]?.quantity || 0}</span>
              <button onClick={() => handleQuantityChange(product._id, 1)}> + </button>
            </div>

            {/* Price Per Unit Input */}
            <input
              type="number"
              placeholder="Enter price per unit (₹)"
              value={selectedProducts[product._id]?.pricePerUnit || ''}
              onChange={(e) => handlePriceChange(product._id, e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
            />

            {/* Total Price Display */}
            <p className="text-sm text-gray-700">
              Total Price: ₹
              {(selectedProducts[product._id]?.pricePerUnit || 0) *
              (selectedProducts[product._id]?.quantity || 0)}
            </p>

          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg"
        >
          Save Inventory
        </button>
      </div>
    </div>
  );
}

export default ProductSelector;

