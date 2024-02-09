const crypto = require("crypto");
const Subscription = require('../models/Subscription');

async function index(req, res) {
    try {
        const subscriptions = await Subscription.all;
        res.status(200).json(subscriptions)
    } catch (err) {
        res.status(500).send(err);
    }
}

async function create(req, res) {
    const sub = req.body;
    if(sub.endpoint.search('wns2-ln2p.notify.windows.com') > -1) {
        sub.subscriptionId = crypto.randomBytes(16).toString("hex");
        sub.agent = 'edge'
        sub.contactId = 3
    } else {
        sub.subscriptionId = crypto.randomBytes(16).toString("hex");
        sub.agent = 'chrome'
        sub.contactId = 2
    }

    try {
        await Subscription.create(sub)
        res.status(201).json('Created successfully!')
    } catch (err) {
        res.status(500),send(err)
    }
}

module.exports = { index, create }