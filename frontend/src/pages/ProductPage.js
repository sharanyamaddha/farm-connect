import { AuthContext } from '../context/AuthContext'; // adjust path if needed
import { toast } from 'react-toastify';
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated, role } = useContext(AuthContext);

  const handleProductClick = (productName) => {
    if (!isAuthenticated || role !== 'customer') {
      setSelectedProduct(productName); // Store product for context
      setShowAuthModal(true);         // Show modal instead of navigating
    } else {
      navigate(`/home/${categoryName}/${productName}`);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/customers/products-by-category/${categoryName}`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen px-6 py-8 bg-green-50">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
        🛒 Available Products in {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 italic">No products available in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((prod, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(prod.productName)}
              className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-md border border-green-200 transition"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">🍎 {prod.productName}</h3>
              <p className="text-gray-600">Available with {prod.totalFarmers} farmer(s)</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-green-800">Login Required</h2>
            <p className="text-gray-700 mb-6">
              Please login or register to view farmers for <strong>{selectedProduct}</strong>.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/login');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/register');
                }}
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

export default ProductPage;