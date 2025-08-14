import React, { useContext,useEffect,useState } from 'react';
import { useSocket } from './context/SocketContext';

import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
//import Profile from './pages/Profile';
import RegisterType from './components/RegisterType';
import FarmerRegister from './pages/FarmerRegister';
import CustomerRegister from './pages/CustomerRegister';
import { CartProvider } from './pages/CartContext';
import CheckOut from './pages/CheckOut';
import PaymentOptions from './pages/PaymentOptions';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import CustomerDashboard from './pages/CustomerDashboard';
// import Fruits from './pages/Fruits';
// import Vegetables from './pages/Vegetables';
// import Grains from './pages/Grains';
// import DryFruits from './pages/DryFruits';
import FarmerLogin from './pages/FarmerLogin';
import CustomerLogin from './pages/CustomerLogin';
import AddInventoryPage from './pages/Farmer/AddInventoryPage';
import MyInventoryPage from './pages/Farmer/MyInventoryPage';
import ProductPage from './pages/ProductPage';
import FarmerListPage from './pages/FarmerListpage';
import FarmerOrdersPage from './pages/Farmer/FarmerOrdersPage';
import ProfileRouter from './pages/ProfileRouter';
import PaidOrders from './pages/PaidOrders';
import TransactionsPage from './pages/TransactionsPage';
import FarmerDashboard from './pages/FarmerDashboard';
import EditFarmerProfile from './pages/EditFarmerProfile';
import FarmerProfile from './pages/FarmerProfile';


// ✅ Import Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

function InnerApp() {
  const { user } = useContext(AuthContext); // ⬅️ Access user to pass into SocketProvider
const socket = useSocket(); // ✅ Only call it here once

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (socket && customer?.id) {
      socket.emit('register_customer', customer.id);
    }
  }, [socket]);

  return (
    
    <SocketProvider user={user}>
      <CartProvider>
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/customerlogin" element={<CustomerLogin />} />
          <Route path="/login/farmerlogin" element={<FarmerLogin />} />
          <Route path="/register" element={<RegisterType />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/farmer/profile" element={<FarmerProfile />} />
          <Route path="/farmers/profile/update" element={<EditFarmerProfile />} />

          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/profile" element={<ProfileRouter />} />
          <Route path="/customer/paid-orders" element={<PaidOrders />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />

          {/* Category Routes */}
          {/* <Route path="/home/fruits" element={<Fruits />} /> */}
          {/* ... */}

          {/* Farmer Routes */}
          <Route path="/farmer/inventory" element={<AddInventoryPage />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/my-inventory" element={<MyInventoryPage />} />
          <Route path="/farmer/orders" element={<FarmerOrdersPage />} />
         <Route path="/farmer/transactions" element={<TransactionsPage />} />

          {/* Product Routing */}
          <Route path="/home/:categoryName" element={<ProductPage />} />
          <Route path="/home/:categoryName/:productName" element={<FarmerListPage />} />
          <Route path="/notifications" element={<Notifications />} />
         
        </Routes>
      </CartProvider>
    </SocketProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <InnerApp />
      </Router>
    </AuthProvider>
  );
}

export default App;
