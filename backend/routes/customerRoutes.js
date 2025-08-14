require('dotenv').config();
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const SECRET_KEY = process.env.JWT_SECRET ;

const Customer = require('../models/Customer');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');



// ---------------- Register Customer ----------------
router.post('/register', async (req, res) => {
  try {
    const {
      fullName, email, password,
      phone, pincode, addressLine1,
      addressLine2, district, state
    } = req.body;

    console.log('📥 Received registration:', req.body);

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      console.log('⚠ User already exists');
      return res.status(409).json({ message: "User already registered. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = new Customer({
      fullName,
      email,
      password: hashedPassword,
      phone,
      pincode,
      addressLine1,
      addressLine2,
      district,
      state
    });

    // Try saving and log result
    const savedCustomer = await customer.save();
    console.log("✅ Saved to MongoDB:", savedCustomer);

    const token = jwt.sign({ id: customer._id, role: 'customer' }, SECRET_KEY, { expiresIn: '7d' });

    return res.status(200).json({
      message: '✅ Registration successful',
      token,
      customer: {
        id: customer._id,
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        pincode: customer.pincode,
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2,
        district: customer.district,
        state: customer.state,
      }
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({ message: '❌ Failed to register customer', error: err.message });
  }
});


// ---------------- Login Customer ----------------
router.post('/login', async (req, res) => {
  console.log("Login route hit");
  const { email, password } = req.body;

  try {
    // 1. Find customer by email
    const customer = await Customer.findOne({ email });

    if (!customer) {
      console.log("❌ No user found with email:", email);
      return res.status(404).json({ message: '❌ User not found' });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      console.log("❌ Invalid password attempt");
      return res.status(401).json({ message: '❌ Invalid password' });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      SECRET_KEY,
      { expiresIn: '7d' } // Token valid for 7 days
    );

      console.log("✅ Fetched customer from DB:", customer);
      
    // 4. Return success response
    return res.status(200).json({
      message: '✅ Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        pincode: customer.pincode,
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2,
        district: customer.district,
        state: customer.state,
      }
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({ message: '❌ Server error' });
  }
});

// ---------------- Get Products by Category Name (Public Route) ----------------
router.get('/products-by-category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;

    const inventories = await Inventory.find({})
      .populate({
        path: 'products.productId',
        populate: {
          path: 'subcategory',
          populate: {
            path: 'categoryId'
          }
        }
      });

    const productMap = new Map();

    inventories.forEach(inv => {
      inv.products.forEach(prod => {
        const product = prod.productId;

        if (
  product?.subcategory?.categoryId?.name?.toLowerCase().replace(/\s+/g, '') === categoryName.toLowerCase()
){
          const key = product._id.toString();
          if (!productMap.has(key)) {
            productMap.set(key, {
              productId: key,
              productName: product.name,
              totalFarmers: 1,
            });
          } else {
            productMap.get(key).totalFarmers += 1;
          }
        }
      });
    });

    return res.json(Array.from(productMap.values()));
  } catch (error) {
    console.error('❌ Error fetching products by category:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/product-details/:productName', async (req, res) => {
  try {
    const { productName } = req.params;

    const inventories = await Inventory.find({ 'products.productName': productName })
      .populate('farmerId');

    const result = [];

    inventories.forEach(inv => {
      inv.products.forEach(prod => {
        if (prod.productName.toLowerCase() === productName.toLowerCase()) {
          result.push({
            farmerName: inv.farmerId.fullName,
            address: `${inv.farmerId.district}, ${inv.farmerId.state}`,
            productName: prod.productName,
            price: prod.pricePerUnit,
            quantity: prod.quantity,
          });
        }
      });
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching product details:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});
// 👇 Add this route under your customer API
router.get('/farmers-for-product/:categoryName/:productName', async (req, res) => {
  try {
    const { productName } = req.params;

    const inventories = await Inventory.find({ 'products.productName': productName })
      .populate('farmerId');

    const result = [];

    inventories.forEach(inv => {
      inv.products.forEach(prod => {
        if (prod.productName.toLowerCase() === productName.toLowerCase()) {
          result.push({
            farmerId: inv.farmerId._id,
            farmerName: inv.farmerId.fullName,
            contact: inv.farmerId.mobile,
            addressLine1: inv.farmerId.addressLine1,
            addressLine2: inv.farmerId.addressLine2,
            pincode: inv.farmerId.pincode,
            state: inv.farmerId.state,
            pricePerUnit: prod.pricePerUnit,
            quantity: prod.quantity,
            distance: Math.floor(Math.random() * 100),
          });

        }
      });
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching farmers for product:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.post('/place-order', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const customerId = decoded.id;

    const { farmerId, productName, categoryName, quantity } = req.body;

    // Log received payload
    console.log("📥 Order received from customer:", customerId);
    console.log("🛒 Payload:", req.body);

    if (!farmerId || !productName || !categoryName || !quantity) {
      console.log("❌ Missing fields", { farmerId, productName, categoryName, quantity });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      customerId,
      farmerId,
      productName,
      categoryName,
      quantity,
      status: 'Pending'
    });

    await newOrder.save();

    return res.status(201).json({
  message: "✅ Order placed successfully",
  orderId: newOrder._id, // 👈 Send back order ID
});


  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    return res.status(500).json({ message: "❌ Failed to place order", error: err.message });
  }
});

const Notification = require('../models/Notification');

router.get('/notifications', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);


    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const notifications = await Notification.find({ userId: decoded.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET /api/customers/profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const customer = await Customer.findById(decoded.id).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error('❌ Error fetching customer profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// ------------------ Update Customer Profile ------------------
router.put('/edit-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const customerId = decoded.id;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        pincode: req.body.pincode,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        district: req.body.district,
        state: req.body.state,
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found to update' });
    }

    res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error('❌ Error updating customer profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ GET Customer's Own Orders
router.get('/my-orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ customerId: decoded.id })
      .populate('farmerId', 'fullName mobile addressLine1 addressLine2 pincode state')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      productName: order.productName,
      quantity: order.quantity,
      status: order.status,
      createdAt: order.createdAt,
      farmerName: order.farmerId.fullName,
      farmerPhone: order.farmerId.mobile,
      farmerAddress: `${order.farmerId.addressLine1}, ${order.farmerId.addressLine2}, ${order.farmerId.state} – ${order.farmerId.pincode}`,
    }));

    return res.status(200).json(formattedOrders);
  } catch (err) {
    console.error('❌ Error fetching customer orders:', err.message);
    return res.status(500).json({ message: "❌ Failed to fetch orders" });
  }
});


// ✅ Record Transaction and Confirm Order
const Transaction = require('../models/Transaction');

router.post('/transactions/record', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      farmerId,
      productName,
      quantity,
      amount,
      paymentId,
      orderId
    } = req.body;

    if (!orderId || !paymentId || !farmerId || !productName || !quantity || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Save transaction
    const txn = new Transaction({
      farmerId,
      customerId: decoded.id,
      productName,
      quantity,
      amount,
      paymentId
    });
    await txn.save();

    // 2. Update order status to Confirmed
    const order = await Order.findById(orderId);
    if (order && order.customerId.toString() === decoded.id) {
      order.status = 'Received'; // Update to Received
       order.price = amount;
      await order.save();
    }

    return res.status(201).json({ message: "✅ Transaction recorded and order confirmed" });

  } catch (err) {
    console.error("❌ Error recording transaction:", err.message);
    return res.status(500).json({ message: "❌ Failed to record transaction" });
  }
});

// ✅ Get all paid (Received) orders for a customer
router.get('/paid-orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const paidOrders = await Order.find({
      customerId: decoded.id,
      status: 'Received'  // ✅ not Confirmed
    }).populate('farmerId', 'fullName');

    res.status(200).json(paidOrders);
  } catch (err) {
    console.error("❌ Error fetching paid orders:", err.message);
    res.status(500).json({ message: 'Failed to fetch paid orders' });
  }
});

module.exports = router;
