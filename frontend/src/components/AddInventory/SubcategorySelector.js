import React, { useState } from 'react';

function SubcategorySelector({ subcategories, onSelect }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2 text-green-800">2. Choose Subcategory:</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {subcategories.map((sub) => (
          <button
            key={sub._id}
            onClick={() => onSelect(sub._id)}
            className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold py-3 px-4 rounded-lg shadow"
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
}
export default SubcategorySelector;