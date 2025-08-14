const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const Razorpay = require('razorpay');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true 
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// ✅ Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Payment Route
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // convert to paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error('❌ Error creating order:', err);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
});

// ✅ Customer Auth Routes
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

// ✅ Farmer Auth Routes
const farmerRoutes = require('./routes/farmerRoutes');
app.use('/api/farmers', farmerRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/farmer/transactions', paymentRoutes);

// ✅ Farmer Inventory Routes (Add/Update)
const farmerInventoryRoutes = require('./routes/farmerInventory');
app.use('/api/farmer/inventory', farmerInventoryRoutes);

// ✅ Catalog Retrieval Routes
const catalogRoutes = require('./routes/catalog');
app.use('/api/catalog', catalogRoutes);


//const chatbotRoutes = require('./routes/chatbot');
//app.use('/api/chatbot', chatbotRoutes);





const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);


const chatCandidateRoutes = require('./routes/chatCandidates');
app.use('/api/chat-candidates', chatCandidateRoutes);
// ✅ SOCKET LOGIC
const farmerSockets = new Map();
const customerSocketMap = {};

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('register_customer', (customerId) => {
    customerSocketMap[customerId] = socket.id;
    console.log(`✅ Registered customer: ${customerId} with socket: ${socket.id}`);
    console.log("📦 Current customerSocketMap:", customerSocketMap);
  });

  socket.on('disconnect', () => {
    for (const [cid, sid] of Object.entries(customerSocketMap)) {
      if (sid === socket.id) {
        delete customerSocketMap[cid];
        console.log(`❌ Disconnected socket for customer: ${cid}`);
        break;
      }
    }
  });
});

// 🔄 Make io and customer map available to routes
app.set('io', io);
app.set('customerSocketMap', customerSocketMap);

// ✅ Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://aishwaryagunda05:Hapa6363@cluster0.vl135.mongodb.net/kisansetu?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

  const farmerSocketMap = {};

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // ✅ Register customer
  socket.on('register_customer', (customerId) => {
    customerSocketMap[customerId] = socket.id;
    console.log(`✅ Registered customer: ${customerId} with socket: ${socket.id}`);
  });

  // ✅ Register farmer
  socket.on('register_farmer', (farmerId) => {
    farmerSocketMap[farmerId] = socket.id;
    console.log(`✅ Registered farmer: ${farmerId} with socket: ${socket.id}`);
  });

  // ✅ Handle messages from any user (farmer or customer)
  socket.on('send_message', ({ senderId, receiverId, message }) => {
    const msg = { senderId, receiverId, message, timestamp: new Date() };

    // 🔄 Save message to MongoDB (if you're using Message model)
    const Message = require('./models/Message');
    const newMsg = new Message(msg);
    newMsg.save();

    // ✅ Send to receiver if online
    const receiverSocketId =
      customerSocketMap[receiverId] || farmerSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', msg);
      console.log(`📤 Message from ${senderId} to ${receiverId}: ${message}`);
    } else {
      console.log(`⚠️ Receiver (${receiverId}) not online`);
    }
  });

  // ✅ Disconnect cleanup
  socket.on('disconnect', () => {
    for (const [cid, sid] of Object.entries(customerSocketMap)) {
      if (sid === socket.id) {
        delete customerSocketMap[cid];
        console.log(`❌ Disconnected customer: ${cid}`);
      }
    }

    for (const [fid, sid] of Object.entries(farmerSocketMap)) {
      if (sid === socket.id) {
        delete farmerSocketMap[fid];
        console.log(`❌ Disconnected farmer: ${fid}`);
      }
    }
  });
});



// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
