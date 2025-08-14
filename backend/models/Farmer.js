const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, trim: true },
  aadhar: { type: String, required: true, trim: true },
  addressLine1: { type: String, required: true, trim: true },
  addressLine2: { type: String, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  landDoc: { type: String },
  photoWithLand: { type: String }
}, { collection: 'farmerCollection' });

module.exports = mongoose.model('Farmer', farmerSchema);