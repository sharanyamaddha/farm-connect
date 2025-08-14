// src/pages/Cart.js
import React, { useContext, useState } from 'react';
import { CartContext } from '../pages/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash } from 'react-icons/fi';

function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.pricePerUnit || item.price || '0');
      return total + price * item.quantity;
    }, 0);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  const handleRegister = () => {
    setShowAuthModal(false);
    navigate('/register');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">🛒 Your Cart</h2>
          <p className="text-gray-600">You must log in to view your cart.</p>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center animate-fadeIn">
              <h2 className="text-xl font-bold mb-4 text-green-800">Login Required</h2>
              <p className="text-gray-700 mb-6">Please login or register to view your cart and place orders.</p>
              <div className="flex justify-between">
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-40">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col relative">
                <img
                  src={item.image || '/no-image.png'}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{item.name}</h2>

                  {item.farmerName && (
                    <p className="text-sm text-gray-600 mb-1">
                      👨‍🌾 <span className="font-medium text-green-700">Farmer:</span> {item.farmerName}
                    </p>
                  )}

                  <p className="text-green-600 font-medium">{item.price}</p>
                  {item.location && <p className="text-gray-500 text-sm">📍 {item.location}</p>}

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => decreaseQuantity(index)}
                        className="bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-gray-300"
                      >−</button>
                      <span className="text-gray-900 font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(index)}
                        className="bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-gray-300"
                      >+</button>
                    </div>
                    <p className="text-gray-700 font-medium text-sm">
                      ₹{parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity}
                    </p>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => removeItem(index)}
                      className="bg-white text-gray-700 w-9 h-9 rounded-full flex items-center justify-center shadow hover:shadow-md transition"
                      title="Remove item"
                    >
                      <FiTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-10 left-0 right-0 px-4 sm:px-6 z-50">
            <div className="bg-white max-w-lg mx-auto px-6 py-4 rounded-2xl shadow-xl flex justify-between items-center">
              <div className="text-lg font-semibold text-gray-800">
                Total: ₹{getTotalPrice()}
              </div>
              <button
                onClick={() => {
                  navigate('/checkout', {
                    state: {
                      fromCart: true,
                      items: cartItems,
                      total: getTotalPrice(),
                    },
                  });
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition duration-300 shadow"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;