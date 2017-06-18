const mongoose = require('mongoose');

const Donation = mongoose.Schema({
  amount: Number,
  username: String,
  donateCompany: String,
  message: String,
});

module.exports = Donation;
