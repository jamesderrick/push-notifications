const crypto = require("crypto");
const Subscription = require('../models/Subscription');
const Contact = require("../models/Contact");

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
    if(sub.endpoint.search('updates.push.services.mozilla.com') > -1) {
        sub.agent = 'firefox'
    } else if(sub.endpoint.search('wns2-ln2p.notify.windows.com') > -1) {
        sub.agent = 'edge'
    } else if (sub.endpoint.search('fcm.googleapis.com') > -1) {
        sub.agent = 'chrome'
    } else {
        sub.agent = 'safari'
    }

    const currentUser = {
        "username": req.session.account?.username,
        "firstName": req.session.account?.name.split(' ')[0],
        "lastName": req.session.account?.name.split(' ')[1]
    }

    if(currentUser){
        let contact = await Contact.getByEmail(currentUser.username) 
        if(!contact) {
            await Contact.create(currentUser.firstName, currentUser.lastName, currentUser.username)
            contact = await Contact.getByEmail(currentUser.username)
        }
        sub.contactId = contact.contact_id

        console.log("New subscriptions for contact with id " + sub.contactId + " using " + sub.agent)

        try {
            await Subscription.create(sub)
            res.status(201).json('Created successfully!')
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(500).send('Cannot create subscription for unknown user')
    }
}

module.exports = { index, create }