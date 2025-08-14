import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, role } = useContext(AuthContext);
  const userId = role === 'customer' && user ? user.id : null;

  const [cartItems, setCartItems] = useState([]);
  const [buyNowProduct, setBuyNowProduct] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    if (userId) {
      const storedCart = localStorage.getItem(`cart_${userId}`);
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    } else {
      setCartItems([]);
    }
  }, [userId]);

  // Save cart to localStorage
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  const isItemInCart = (item) => {
    return cartItems.some((cartItem) => {
      return (
        (item.farmerId && cartItem.farmerId === item.farmerId && cartItem.name === item.name) ||
        (!item.farmerId && cartItem.name === item.name)
      );
    });
  };

  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const index = prevCart.findIndex(
        (i) =>
          (item.farmerId && i.farmerId === item.farmerId && i.name === item.name) ||
          (!item.farmerId && i.name === item.name)
      );

      if (index >= 0) {
        const updated = [...prevCart];
        updated[index].quantity += item.quantity || 1;
        return updated;
      } else {
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const increaseQuantity = (index) => {
    setCartItems((prevCart) => {
      const updated = [...prevCart];
      updated[index].quantity += 1;
      return updated;
    });
  };

  const decreaseQuantity = (index) => {
    setCartItems((prevCart) => {
      const updated = [...prevCart];
      updated[index].quantity -= 1;
      if (updated[index].quantity <= 0) updated.splice(index, 1);
      return updated;
    });
  };

  const removeItem = (index) => {
    setCartItems((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        totalItems,
        setCartItems,
        removeItem,
        isItemInCart,
        buyNowProduct,
        setBuyNowProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}