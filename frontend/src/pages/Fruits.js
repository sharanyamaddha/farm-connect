import React, { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../pages/CartContext';  // Import CartContext

function Fruits() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  const { addToCart, isItemInCart,setBuyNowProduct  } = useContext(CartContext); // updated to include isItemInCart

  const fruits = [
    {
      name: 'Apple',
      price: '₹138/Per kg',
      location: 'Warangal, Telangana',
      time: '1 month ago',
      image: 'https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg',
    },
    {
      name: 'Mango',
      price: '₹250/Per kg',
      location: 'Nizamabad, Telangana',
      time: '2 weeks ago',
      image: 'https://images.pexels.com/photos/5875696/pexels-photo-5875696.jpeg',
    },
    {
      name: 'Watermelon',
      price: '₹30/Per kg',
      location: 'Khammam, Telangana',
      time: '5 days ago',
      image: 'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg',
    },
    {
      name: 'Banana',
      price: '₹45/Per kg',
      location: 'Hyderabad, Telangana',
      time: '1 week ago',
      image: 'https://images.pexels.com/photos/532478/pexels-photo-532478.jpeg',
    },
  ];

  // ✅ Buy Now logic copied from Vegetables.js
  const handleBuyNow = (fruit) => {
    setBuyNowProduct({ ...fruit, quantity: 1 }); 
    if (!isItemInCart(fruit)) {
      addToCart(fruit);
    }
    navigate('/checkout', { state: {  fromBuyNow: true } });
  };

  const filteredFruits = fruits.filter((fruit) =>
    fruit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAddToCart = (fruit) => {
    addToCart(fruit);
    toast.success(`${fruit.name} added to cart`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "colored",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-8 relative">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="absolute top-4 left-4 z-10">
        <button onClick={toggleSidebar} className="text-3xl text-gray-600 focus:outline-none">
          <FaBars />
        </button>
      </div>

      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search for fruits..."
          className="w-full max-w-md p-4 rounded-2xl shadow-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
        {filteredFruits.map((fruit, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 ease-in-out p-5 
              ${selectedIndex === index ? 'scale-105 shadow-2xl' : 'hover:scale-105 hover:shadow-2xl'}`}
          >
            <div className="w-full h-40 overflow-hidden rounded-xl">
              <img
                src={fruit.image}
                alt={fruit.name}
                className="w-full h-40 object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 truncate">{fruit.name}</h3>
              <p className="text-green-600 font-semibold mt-2">{fruit.price}</p>
              <p className="text-gray-600 text-sm flex items-center mt-1">📍 {fruit.location}</p>
              <p className="text-gray-400 text-xs flex items-center mt-1">⏰ {fruit.time}</p>
              <div className="mt-4 flex gap-10">
                <button
                  onClick={() => handleAddToCart(fruit)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 shadow-md transition-all duration-300 text-sm font-medium"
                >
                  Add To Cart
                </button>
                <button
                  onClick={() => handleBuyNow(fruit)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 shadow-md transition-all duration-300 text-sm font-medium"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 text-lg font-semibold">
          View More Fruits
        </button>
      </div>
    </div>
  );
}

export default Fruits;