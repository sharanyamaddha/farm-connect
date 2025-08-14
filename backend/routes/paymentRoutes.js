const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Order = require('../models/Order'); // ✅ Add this
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

router.post('/record', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      farmerId,
      productName,
      quantity,
      amount,
      paymentId,
      orderId // ✅ this must be sent from frontend
    } = req.body;

    // ✅ 1. Save Transaction
    const newTxn = new Transaction({
      farmerId,
      customerId: decoded.id,
      productName,
      quantity,
      amount,
      paymentId
    });

    await newTxn.save();

    // ✅ 2. Update Order Status to "Confirmed"
    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      status: 'Received',
      price: amount
    }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found to update" });
    }

    res.status(201).json({
      message: '✅ Payment recorded and order confirmed',
      transaction: newTxn,
      updatedOrder
    });

  } catch (err) {
    console.error("❌ Error recording transaction and updating order:", err);
    res.status(500).json({ error: 'Failed to record transaction and confirm order' });
  }
});

module.exports = router;
