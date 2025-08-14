import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';

const getInitials = (nameOrEmail) => {
  if (!nameOrEmail) return '?';
  const words = nameOrEmail.split(' ');
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

function ChatPage() {
  const [candidates, setCandidates] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [role, setRole] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [token, setToken] = useState(null);
  const [popupUser, setPopupUser] = useState(null); // 🔔 For popup

  // Load tokens
  useEffect(() => {
    const farmerToken = localStorage.getItem('farmerToken');
    const customerToken = localStorage.getItem('customerToken');
    setToken(farmerToken || customerToken || null);
  }, []);

  // Decode token to get role and senderId
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);
      setSenderId(decoded.id);
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }, [token]);

  // Fetch chat candidates
  useEffect(() => {
    if (!token || !role) return;

    axios
      .get('http://localhost:5000/api/chat-candidates', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCandidates(res.data))
      .catch((err) => {
        console.error('Failed to load chat candidates:', err);
        setCandidates([]);
      });
  }, [token, role]);

  // Handle new unread message (triggered by ChatBox)
  const handleNewMessageReceived = (senderIdFromMsg) => {
    setCandidates((prev) =>
      prev.map((user) =>
        user._id === senderIdFromMsg && user._id !== selectedReceiver
          ? {
              ...user,
              hasUnread: true,
              unreadCount: (user.unreadCount || 0) + 1,
            }
          : user
      )
    );

    // Show popup 🔔
    const sender = candidates.find((c) => c._id === senderIdFromMsg);
    if (sender) {
      setPopupUser(sender);
      setTimeout(() => setPopupUser(null), 4000); // auto-hide
    }
  };

  // Select receiver
  const handleSelectReceiver = (userId) => {
    setSelectedReceiver(userId);
    setCandidates((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, hasUnread: false, unreadCount: 0 }
          : user
      )
    );
  };

  if (!token || !role || !senderId) {
    return (
      <div className="text-center mt-10 text-gray-700 text-lg font-semibold">
        Please log in to access chat.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-green-50 to-white p-8 flex justify-center items-start relative">
      
      {/* 🔔 Unread popup */}
      {popupUser && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded shadow-lg animate-bounce z-50">
          💬 New message from {popupUser.name || popupUser.email}
        </div>
      )}

      {!selectedReceiver ? (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <svg
              className="w-9 h-9 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
            </svg>
            <h2 className="text-3xl font-extrabold text-green-800">
              {role === 'customer' ? 'Available Farmers' : 'Your Customers'}
            </h2>
          </div>

          {/* Chat List */}
          {candidates.length === 0 ? (
            <p className="text-gray-500 italic">No users available to chat.</p>
          ) : (
            <ul className="divide-y divide-green-200">
              {candidates.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleSelectReceiver(user._id)}
                  className={`flex items-center justify-between p-5 rounded-lg cursor-pointer transition
                    ${
                      user._id === selectedReceiver
                        ? 'bg-green-100 shadow-inner'
                        : 'hover:bg-green-50'
                    }
                  `}
                >
                  {/* Avatar */}
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                      {getInitials(user.name || user.email)}
                    </div>
                    <div>
                      <p className="font-semibold text-green-900 text-md">
                        {user.name || user.email}
                      </p>
                      {user.name && (
                        <p className="text-green-700 text-sm">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Unread bubble */}
                  {user.hasUnread && (
                    <span
                      title={`${user.unreadCount} new message${
                        user.unreadCount > 1 ? 's' : ''
                      }`}
                      className="relative inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-600 rounded-full shadow border-2 border-white animate-pulse"
                    >
                      {user.unreadCount > 9 ? '9+' : user.unreadCount}
                      <span className="absolute w-full h-full rounded-full bg-green-400 opacity-50 animate-ping"></span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <ChatBox
          senderId={senderId}
          receiverId={selectedReceiver}
          onBack={() => setSelectedReceiver(null)}
          onNewMessageReceived={handleNewMessageReceived}
        />
      )}
    </div>
  );
}

export default ChatPage;
