
import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchSubcategories, fetchProducts } from '../../api/catalogApi';
import CategorySelector from '../../components/AddInventory/CategorySelector';
import SubcategorySelector from '../../components/AddInventory/SubcategorySelector';
import ProductSelector from '../../components/AddInventory/ProductSelector';

function AddInventoryPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
  const [products, setProducts] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId)
        .then(res => setSubcategories(res.data))
        .catch(err => console.error('Error loading subcategories:', err));
    }
  }, [selectedCategoryId]);

  // Fetch products when subcategory changes
  useEffect(() => {
    if (selectedSubcategoryId) {
      fetchProducts(selectedSubcategoryId)
        .then(res => setProducts(res.data))
        .catch(err => console.error('Error loading products:', err));
    }
  }, [selectedSubcategoryId]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700">
        🧺 Add / Update Inventory
      </h2>

      <CategorySelector
        categories={categories}
        onSelect={(id, name) => {
          setSelectedCategoryId(id);
          setSelectedCategoryName(name);
          setSelectedSubcategoryId(null);
          setSelectedSubcategoryName('');
          setProducts([]);
        }}
      />

      {selectedCategoryId && (
        <SubcategorySelector
          subcategories={subcategories}
          onSelect={(id, name) => {
            setSelectedSubcategoryId(id);
            setSelectedSubcategoryName(name);
            setProducts([]);
          }}
        />
      )}

      {selectedSubcategoryId && (
        <ProductSelector
          products={products}
          selectedCategory={selectedCategoryName}
          selectedSubcategory={selectedSubcategoryName}
        />
      )}
    </div>
  );
}

export default AddInventoryPage;
