import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-2xl transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleSidebar}
          className="text-sm text-white bg-gray-300 rounded-full p-1 hover:bg-gray-400 focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex flex-col space-y-4 px-4 py-6 overflow-y-auto max-h-[calc(100vh-64px)]">
        {[
          {
            to: '/home/fruits',
            image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg',
            label: 'Fruits',
          },
          {
            to: '/home/vegetables',
            image: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg',
            label: 'Vegetables',
          },
          {
            to: '/home/grains',
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
            label: 'Grains',
          },
          {
            to: '/home/dryfruits',
            image: 'https://images.pexels.com/photos/4110257/pexels-photo-4110257.jpeg',
            label: 'Dry Fruits',
          },
        
        ].map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.label}
              className="w-16 h-16 object-cover shadow-md rounded-md"
            />
            <span className="font-medium text-gray-700 text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;


