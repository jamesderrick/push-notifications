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
    sub.subscriptionId = crypto.randomBytes(16).toString("hex");
    if(sub.endpoint.search('wns2-ln2p.notify.windows.com') > -1) {
        sub.agent = 'edge'
        sub.contactId = 3
    } else if (sub.endpoint.search('https://fcm.googleapis.com') > -1) {
        sub.agent = 'chrome'
        sub.contactId = 2
    } else {
        sub.agent = 'safari'
        sub.contactId = 2
    }

    console.log(sub)

    try {
        await Subscription.create(sub)
        res.status(201).json('Created successfully!')
    } catch (err) {
        res.status(500),send(err)
    }
}

module.exports = { index, create }
