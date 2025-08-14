const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');

   

const JWT_SECRET = process.env.JWT_SECRET ;

// ---------------- Farmer Registration ----------------
router.post('/register', upload.fields([
  { name: 'landDoc', maxCount: 1 },
  { name: 'landPhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      fullName, email, password, mobile, aadhar,
      addressLine1, addressLine2, state, pincode
    } = req.body;

    const existing = await Farmer.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Farmer already registered. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFarmer = new Farmer({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      aadhar,
      addressLine1,
      addressLine2,
      state,
      pincode,
      landDoc: req.files['landDoc']?.[0]?.path || '',
      photoWithLand: req.files['landPhoto']?.[0]?.path || '',
    });

    await newFarmer.save();

    const token = jwt.sign(
      { id: newFarmer._id, email: newFarmer.email, role: 'farmer' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...farmerData } = newFarmer.toObject();

    res.status(201).json({
      message: '✅ Farmer registered successfully!',
      token,
      role: 'farmer',
      farmer: farmerData,
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ error: '❌ Registration failed' });
  }
});


// ---------------- Farmer Login ----------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: '❌ Farmer not found. Please register.' });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Incorrect password' });
    }

    const token = jwt.sign(
      { id: farmer._id, email: farmer.email, role: 'farmer' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...farmerData } = farmer.toObject();

    res.status(200).json({
      message: ' Login successful',
      token,
      role: 'farmer',
      farmer: farmerData,
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: '❌ Login failed' });
  }
});


// ---------------- Get Farmer Orders ----------------
router.get('/farmer/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'farmer') {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch all orders for this farmer
    const orders = await Order.find({ farmerId: decoded.id }).populate('customerId', 'fullName');

    // Group orders by status
    const orderRequests = orders.filter(order => order.status === 'Pending');
    const confirmedOrders = orders.filter(order => order.status === 'Accepted');
    const receivedOrders = orders.filter(order => order.status === 'Received'); // ✅ NEW

    // Send all groups in the response
    res.json({ orderRequests, confirmedOrders, receivedOrders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



// ---------------- Accept Order ----------------
router.put('/orders/:id/accept', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'farmer') {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'fullName')
      .populate('farmerId');

    if (!order || order.farmerId._id.toString() !== decoded.id) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    // ✅ Update order status
    order.status = 'Accepted';
    await order.save();

    // ✅ Access io and socket map
    const io = req.app.get('io');
    const customerSockets = req.app.get('customerSocketMap'); // ✅ Corrected name
    

    if (!io || !customerSockets) {
      console.warn('❗Socket system not initialized.');
    }

    const customerSocketId = customerSockets[order.customerId._id.toString()];


    // ✅ Prepare notification payload
    const notificationData = {
      userId: order.customerId._id,
      productName: order.productName,
      quantity: order.quantity,
      farmerName: order.farmerId.fullName,
      farmerPhone: order.farmerId.mobile,
      addressLine1: order.farmerId.addressLine1,
      addressLine2: order.farmerId.addressLine2,
      state: order.farmerId.state,
      pincode: order.farmerId.pincode,
      farmerId: order.farmerId._id,
      message: `✅ Farmer ${order.farmerId.fullName} accepted your order for ${order.productName}`,
    };

    // ✅ Emit via socket or fallback to DB
    if (customerSocketId) {
      console.log("🔍 Sending notification with:", notificationData);

      io.to(customerSocketId).emit('notification', {
        type: 'order_accepted',
        ...notificationData,
      });
      console.log(`📩 Real-time notification sent to socket ${customerSocketId}`);
    } else {
      const notification = new Notification(notificationData);
      await notification.save();
      console.log(`💾 Notification saved to DB for later delivery`);
    }

    res.json({ message: '✅ Order accepted successfully' });

  } catch (err) {
    console.error("❌ Error accepting order:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ---------------- Farmer Profile Route ----------------
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'farmer') {
      return res.status(403).json({ message: "Access denied" });
    }

    const farmer = await Farmer.findById(decoded.id).select('-password');
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    res.status(200).json(farmer);
  } catch (err) {
    console.error("❌ Error fetching farmer profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// In farmerRoutes.js
router.put('/profile/update', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET );

    if (decoded.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await Farmer.findByIdAndUpdate(decoded.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating farmer profile:', err.message);
    res.status(500).json({ message: 'Update failed' });
  }
});

// 🧾 Get all transactions for a farmer
router.get('/transactions', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'farmer') {
      return res.status(403).json({ message: "Access denied" });
    }

    const transactions = await Transaction.find({ farmerId: decoded.id }) .populate('customerId', 'fullName') .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
