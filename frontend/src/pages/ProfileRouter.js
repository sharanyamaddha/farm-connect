import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import FarmerProfile from './FarmerProfile';
import CustomerProfile from './CustomerProfile';

function ProfileRouter() {
  const { role } = useContext(AuthContext);

  if (!role) return <Navigate to="/login" />;

  return role === 'farmer' ? <FarmerProfile /> : <CustomerProfile />;
}

export default ProfileRouter;
