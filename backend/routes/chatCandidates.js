// routes/chatCandidates.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Farmer = require('../models/Farmer');
const Customer = require('../models/Customer');
const Message = require('../models/Message'); // Ensure this model has senderId, receiverId, read
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let users = [];

    if (role === 'customer') {
      const orders = await Order.find({ customerId: userId });
      const ids = [...new Set(orders.map(o => o.farmerId.toString()))];
      users = await Farmer.find({ _id: { $in: ids } });
    } else if (role === 'farmer') {
      const orders = await Order.find({ farmerId: userId });
      const ids = [...new Set(orders.map(o => o.customerId.toString()))];
      users = await Customer.find({ _id: { $in: ids } });
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }

    const enriched = await Promise.all(users.map(async u => {
      const unreadCount = await Message.countDocuments({
        senderId: u._id,
        receiverId: userId,
        read: false,
      });
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        hasUnread: unreadCount > 0,
        unreadCount,
      };
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Chat candidate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
