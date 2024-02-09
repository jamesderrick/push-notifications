const express = require('express');
const path = require('path')

const server = express();
server.use(express.json());
server.use(express.static(path.join(__dirname, '../client')));

const subscriptionRoutes = require('./routes/subscriptions');
const nudgesRoutes = require('./routes/nudges');
const notificationRoutes = require('./routes/notifications');

server.use('/api/subscriptions', subscriptionRoutes);
server.use('/api/nudges', nudgesRoutes);
server.use('/api/notifications', notificationRoutes);

server.get('/api', (req, res) => {
    res.send('notification server up and running...')
})

module.exports = server;