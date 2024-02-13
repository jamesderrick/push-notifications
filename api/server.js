const express = require('express');
const path = require('path')
const Nudge = require('./models/Nudge');

const server = express();
server.use(express.urlencoded({ extended: true }))
server.use(express.json());
server.use(express.static(path.join(__dirname, '../client')));

const subscriptionRoutes = require('./routes/subscriptions');
const nudgesRoutes = require('./routes/nudges');
const notificationRoutes = require('./routes/notifications');
const contactsRoutes = require('./routes/contacts');

server.use('/api/subscriptions', subscriptionRoutes);
server.use('/api/nudges', nudgesRoutes);
server.use('/api/notifications', notificationRoutes);
server.use('/api/contacts', contactsRoutes);

server.get('/api', (req, res) => {
    res.send('notification server up and running...')
})

server.get('/enable-notifications', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'enable.html'))
})

server.get('/nudge', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'nudge.html'))
})

server.get('/new-nudge', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'new-nudge.html'))
})

server.post('/new-nudge', async (req, res) => {
    const nudge = req.body;
    await Nudge.create(nudge)
    const newNudgeId = (await Nudge.latestId).id
    for (const c of nudge.contact) {
        await Nudge.addContact(newNudgeId, c)
    }
    res.redirect('/')
})

module.exports = server;