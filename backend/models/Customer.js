const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true }
});

const Customer = mongoose.model('Customer', customerSchema, 'customerCollection');
module.exports = Customer;
