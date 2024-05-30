// routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();
const CryptoToWatchList = require('../models/cryptoToWatchList');

router.post('/watchlist', async (req, res) => {
    const { code, minPrice, maxPrice } = req.body;
    try {
      const crypto = new CryptoToWatchList();
       crypto.code=code;
       crypto.minPrice=minPrice;
       crypto.maxPrice=maxPrice;
      await crypto.save();
      res.status(201).send('Cryptocurrency added to watchlist');
    } catch (error) {
      console.error('Error adding cryptocurrency to watchlist:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
