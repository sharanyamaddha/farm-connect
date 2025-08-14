import React from 'react';
import { Link } from 'react-router-dom';

function CategoryDropdown() {
  const categories = [
    { to: '/home/fruits', label: 'Fruits' },
    { to: '/home/vegetables', label: 'Vegetables' },
    { to: '/home/grains', label: 'Grains' },
    { to: '/home/dryfruits', label: 'Dry Fruits' },
  ];

  return (
    <div className="py-1 px-6 shadow-md flex justify-evenly items-center border-green-200 z-50 relative bg-green-800">
      {categories.map((item, idx) => (
        <Link
          key={idx}
          to={item.to}
          className="text-white text-base font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default CategoryDropdown;
