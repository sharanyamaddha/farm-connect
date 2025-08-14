import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { FaBell } from 'react-icons/fa';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { CartContext } from '../pages/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

function Navbar() {
  const { totalItems } = useContext(CartContext);
  const { isAuthenticated, logout, role } = useContext(AuthContext);
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('customerToken');
    localStorage.removeItem('farmerToken');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      toast.info('Please login or register to access your cart');
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated && role === 'customer') {
      navigate('/customer/dashboard');
    } else if (isAuthenticated && role === 'farmer') {
      navigate('/farmer/profile');
    }
  };

  const handleNotificationClick = () => navigate('/notifications');

  const handleChatClick = () => {
    if (!isAuthenticated) {
      toast.info('Please login to use messaging');
      navigate('/login');
    } else {
      navigate(role === 'farmer' ? '/farmer/chat' : '/customer/chat');
    }
  };

  useEffect(() => {
    if (!socket) return;

    const stored = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(stored);

    const handleOrderAccepted = (data) => {
      setNotifications((prev) => {
        const updated = [...prev, data];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
    };

    const handleUnreadMessage = () => {
      setUnreadMessages((prev) => prev + 1);
    };

    socket.on('order_accepted', handleOrderAccepted);
    socket.on('chat_unread', handleUnreadMessage);

    return () => {
      socket.off('order_accepted', handleOrderAccepted);
      socket.off('chat_unread', handleUnreadMessage);
    };
  }, [socket]);

  const activeClass =
    'text-green-900 font-semibold border-b-2 border-green-700 pb-1';
  const defaultClass = 'hover:text-green-900 transition';

  const ChatIconButton = () => (
    <button onClick={handleChatClick} className="relative group" title="Messages">
      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors duration-150">
        <BiMessageRoundedDetail className="w-6 h-6 text-white" />
      </div>
      {unreadMessages > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
          {unreadMessages > 9 ? '9+' : unreadMessages}
        </span>
      )}
    </button>
  );

  return (
    <header className="flex items-center justify-between px-3 shadow-md bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="https://i.pinimg.com/736x/d9/5a/d9/d95ad9f02997a5d753d4019e16c6ee3b.jpg"
          alt="FarmConnect Logo"
          className="w-[80px] h-[80px] object-cover rounded-full"
        />
        <span className="text-2xl font-bold text-green-700">FarmConnect</span>
      </div>

      {/* Search + Navigation */}
      <ul className="hidden sm:flex items-center gap-6 text-sm flex-1 justify-center">
        {/* Search Bar */}
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-4 pr-10 rounded-full border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <MagnifyingGlassIcon className="w-5 h-5 text-green-700" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center space-x-5 text-green-700 font-medium">
          <NavLink
            to={role === 'farmer' ? '/farmer/dashboard' : '/'}
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}
          >
            HOME
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? activeClass : defaultClass)}
              >
                LOGIN
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? activeClass : defaultClass)}
              >
                REGISTER
              </NavLink>
              <button onClick={handleCartClick} className="relative hover:text-green-900">
                <ShoppingCartIcon className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}

          {isAuthenticated && (
            <>
              {role === 'customer' && (
                <button
                  onClick={handleNotificationClick}
                  className="relative hover:text-green-900"
                  title="Notifications"
                >
                  <FaBell className="w-5 h-5 text-green-700" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
              )}

              <ChatIconButton />

              {role === 'customer' && (
                <button
                  onClick={handleCartClick}
                  className="relative hover:text-green-900"
                  title="Cart"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={handleProfileClick}
                className="hover:text-green-900"
                title="Profile"
              >
                <UserIcon className="w-6 h-6" />
              </button>
              <button onClick={handleLogout} className={defaultClass}>
                LOGOUT
              </button>
            </>
          )}
        </nav>
      </ul>
    </header>
  );
}

export default Navbar;
