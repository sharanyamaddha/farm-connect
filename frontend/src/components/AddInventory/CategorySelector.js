import React, { useState } from 'react';

function CategorySelector({ categories, onSelect }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2 text-green-800">1. Choose Category:</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelect(cat._id)}
            className="bg-green-200 hover:bg-green-300 text-green-900 font-semibold py-3 px-4 rounded-lg shadow"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
export default CategorySelector;
