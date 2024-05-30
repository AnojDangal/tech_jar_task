// index.js
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./src/utils/logger');
const { fork } = require('child_process');
const watchlistRoutes = require('./src/routes/watchListRoutes');
// const checkWatchlist=require('./src/utils/checkWatchList');
const config=require('./src/config/config');
const app = express();

app.use(express.json());

// Routes
app.use('/api', watchlistRoutes);

// Connect to MongoDB
mongoose.connect(config.mongo.host)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('Error connecting to MongoDB:', err));

//create child process 
const child = fork('./src/utils/scraper.js');
child.send('start');
let data = [];
child.on('message', async (message) => {
    if (message.message == 'successful') {
        console.log(message)
        child.send('stop');
    }

})
// Start the server

const PORT = config.port || 3000;
app.listen(PORT, () => logger.info(`Server is running on port ${PORT} on main thread with process id ${process.pid}`));
