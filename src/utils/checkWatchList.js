const fs = require('fs');
const CryptoCurrency = require('../models/cryptoCurrency');
const CryptoWatchList = require('../models/cryptoToWatchList');

const checkWatchlist = async () => {
  try {
    const cryptocurrencies = await CryptoCurrency.find();
    const watchListData = await CryptoWatchList.find();

    watchListData.forEach(crypto => {
      const data = cryptocurrencies.find(item => item.code === crypto.code);
      if (data) {
        const price = parseFloat(data.price.replace(/\$/, '').replace(/,/g, ''));
        if (price < crypto.minPrice || price > crypto.maxPrice) {
          fs.appendFileSync('notifications.log', `${data.code} is on the move. The Price is down ${data.change24h} in 24 hrs to ${data.price}\n`);
        } else {
          fs.appendFileSync('notifications.log', `${data.code} is on the move. The Price is up ${data.change24h} in 24 hrs to ${data.price}\n`);
        }
      }
    });
  } catch (error) {
    console.error('Error checking watchlist:', error);
  }
};

// Run checkWatchlist every 5 minutes using setInterval
setInterval(checkWatchlist, 5 * 60 * 1000);

module.exports = checkWatchlist;
