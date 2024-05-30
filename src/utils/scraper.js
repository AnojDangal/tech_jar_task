// utils/scraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const CryptoCurrency = require('./../models/cryptoCurrency')
const logger = require('./logger')
const cron = require('node-cron');
const mongoose = require('mongoose');
const config = require('./../config/config');
async function scrapeData(pid) {
    const processID = pid;
    mongoose.connect(config.mongo.host)
        .then(() => logger.info('Connected to MongoDB from child'))
        .catch(err => logger.error('Error connecting to MongoDB:', err));
    try {
        const response = await axios.get('https://coinranking.com/');
        const $ = cheerio.load(response.data);

        let cryptocurrencies = [];
        $('tbody tr').each((index, element) => {
            const code = $(element).find('.profile__subtitle-name').text().trim();
            const name = $(element).find('.profile__name a').text().trim();
            const img = $(element).find('.profile__logo').attr('src');
            const valueText = $(element).find('.valuta--light').text().trim();;
            const splitData = valueText.split(/\s+/);

            // Extract the first element (assuming we need dollar sign as well as it's the desired value)
            const price = splitData[0] + splitData[1];
            const marketCap = splitData[2] + splitData[3] + splitData[4];
            const change24h = $(element).find('.change').text().trim();
            cryptocurrencies.push({ code, name, img, price, marketCap, change24h });
        });

        //filter fulty value data first
        const filteredData = cryptocurrencies.filter(item =>
            item.name &&
            item.img &&
            item.price &&
            item.marketCap &&
            item.change24h
        );
        // Save latest scraped data to database
        await CryptoCurrency.deleteMany({});
        CryptoCurrency.insertMany(filteredData)
            .then((data) => { logger.info(`::scraped data insert into database sucessful from child with process id:: ${processID}`) })
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}
// Listen for messages from the parent process
process.on('message', (message) => {
    console.log(message)
    logger.info(`::child process is instantiated with process id::${process.pid}`)
    if (message === 'start') {
        // Schedule the scraping function for every 5 min using node cron job
        const startScrapeData = cron.schedule('*/0.5 * * * *', async () => {
            const result = await scrapeData(process.pid);

            //send seuccessful message to terminate the child process
            // process.send({message:"successful"})
        });
        return startScrapeData;
    }
    if (message == 'stop') {
        console.log('Killing child process', process.pid)
        process.kill(process.pid, 'SIGKILL');
    }
});

module.exports = scrapeData;
