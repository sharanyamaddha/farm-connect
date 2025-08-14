import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'customer' or 'farmer'

  useEffect(() => {
  try {
    const savedRole = localStorage.getItem('role');

    // Exit early if role is missing or invalid
    if (!savedRole || savedRole === 'undefined' || savedRole === 'null') {
      return;
    }

    const savedToken = localStorage.getItem(`${savedRole}Token`);
    const savedUserStr = localStorage.getItem(savedRole);

    // If any are missing or invalid, logout
    if (!savedToken || !savedUserStr || savedUserStr === 'undefined') {
      logout();
      return;
    }

    const parsedUser = JSON.parse(savedUserStr); // ✅ safe now

    setUser(parsedUser);
    setIsAuthenticated(true);
    setRole(savedRole);
  } catch (err) {
    console.error('🔴 Failed to load user from localStorage:', err);
    logout(); // clear junk
  }
}, []);


  const login = (userData, token, userRole) => {
    try {
      localStorage.setItem(userRole, JSON.stringify(userData));
      localStorage.setItem(`${userRole}Token`, token);
      localStorage.setItem('role', userRole);
      setUser(userData);
      setIsAuthenticated(true);
      setRole(userRole);
    } catch (err) {
      console.error('🔴 Failed to save user to localStorage:', err);
    }
  };

  const logout = () => {
    try {
      if (role) {
        localStorage.removeItem('customer');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('farmer');
    localStorage.removeItem('farmerToken');
        localStorage.removeItem(role);
        localStorage.removeItem(`${role}Token`);
      }
      localStorage.removeItem('role');
    } catch (err) {
      console.error('🔴 Error while clearing storage:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};