const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const authProvider = require('./auth/AuthProvider');
const { REDIRECT_URI } = require('./authConfig');
const Nudge = require('./models/Nudge');


const server = express();

server.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // set this to true on production
    }
  }));

server.use(cors());
server.use(express.urlencoded({ extended: true }))
server.use(express.json());
server.use(express.static(path.join(__dirname, '../client')));

const subscriptionRoutes = require('./routes/subscriptions');
const nudgesRoutes = require('./routes/nudges');
const notificationRoutes = require('./routes/notifications');
const contactsRoutes = require('./routes/contacts');
const authRoutes = require('./routes/auth');

server.use('/api/subscriptions', subscriptionRoutes);
server.use('/api/nudges', nudgesRoutes);
server.use('/api/notifications', notificationRoutes);
server.use('/api/contacts', contactsRoutes);
server.use('/auth', authRoutes)

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

server.get('/api/authenticated', (req, res) => {
    if(req.session.isAuthenticated) {
        res.json({ 
            "authenticated" : req.session.isAuthenticated,
            "name": req.session.account?.name,
            "email": req.session.account?.username,
        })
    } else {
        res.json({ "authenticated": false })
    }
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