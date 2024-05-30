const mongoose = require('mongoose');
const CryptoSchema = new mongoose.Schema({
    code: String,
    minPrice: Number,
    maxPrice: Number,
  });
  module.exports = mongoose.model('CryptoToWatchList', CryptoSchema);
  