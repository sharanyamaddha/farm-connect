// src/components/ChatBox.js
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';

function ChatBox({ senderId, receiverId, onBack, onNewMessageReceived }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const token = localStorage.getItem('customerToken') || localStorage.getItem('farmerToken');
  const role = token && JSON.parse(atob(token.split('.')[1])).role;

  // Fetch chat history
  useEffect(() => {
    if (!receiverId) return;
    axios.get(`http://localhost:5000/api/messages/${receiverId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [receiverId]);

  // Socket registration and listener
  useEffect(() => {
    if (!socket || !senderId) return;
    socket.emit(role === 'customer' ? 'register_customer' : 'register_farmer', senderId);

    const handleReceive = (msg) => {
      if (msg.senderId === receiverId || msg.receiverId === receiverId) {
        setMessages(prev => [...prev, msg]);
        if (msg.senderId === receiverId && onNewMessageReceived) {
          onNewMessageReceived(msg.senderId);
        }
      }
    };

    socket.on('receive_message', handleReceive);
    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [socket, senderId, receiverId, onNewMessageReceived]);

  // Send new message
  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { senderId, receiverId, message: input };
    socket.emit('send_message', msg);
    setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
    setInput('');

    if (onNewMessageReceived) {
      onNewMessageReceived(receiverId);
    }
  };

  // Scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full max-w-md h-[600px] bg-white shadow-lg rounded-xl flex flex-col">
      {onBack && (
        <div className="px-4 py-2 border-b bg-green-50">
          <button onClick={onBack} className="text-green-600 font-semibold hover:underline">
            ⬅ Back
          </button>
        </div>
      )}
      <div className="flex-1 p-4 overflow-y-auto bg-green-50">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-xl max-w-xs text-white text-sm ${msg.senderId === senderId ? 'bg-green-600' : 'bg-gray-600'}`}>
              {msg.message}
              <div className="text-xs text-gray-200 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="p-4 border-t bg-white flex items-center space-x-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
