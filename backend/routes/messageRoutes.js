const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');



router.get('/:otherUserId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: decoded.id, receiverId: req.params.otherUserId },
        { senderId: req.params.otherUserId, receiverId: decoded.id },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Message fetch error:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});


module.exports = router;