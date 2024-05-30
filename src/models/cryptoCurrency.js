// models/CryptoCurrency.js
const mongoose = require('mongoose');

const cryptoCurrencySchema = new mongoose.Schema({
    code: String,
    name: String,
    img: String,
    price: String,
    marketCap: String,
    change24h: String,
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoCurrency', cryptoCurrencySchema);
