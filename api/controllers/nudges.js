const Nudge = require('../models/Nudge');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');

async function index(req, res) {
    try {
        const nudges = await Nudge.all;
        res.status(200).json(nudges)
    } catch (err) {
        res.status(500).send(err);
    }
}

async function contacts(req, res) {
    const nudgeId = req.query.id;
    try {
        const contacts = await Contact.getByNudgeId(nudgeId)
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).send(err)
    }
}

async function received(req, res) {
    const nudgeId = req.body.nudgeId;
    try {
        await Nudge.received(nudgeId)
        res.status(200).json('Nudge updated successfully!')
    } catch (err) {
        res.status(500).send(err)
    }
}

async function acknowledge(req, res) {
    const nudgeId = req.body.nudgeId;
    const requestorId = req.body.requestorId;
    try {
        await Nudge.acknowledged(nudgeId)
        const subscriptions = await Subscription.getByContactId(requestorId)
        subscriptions.forEach(async subscription => {
            await Notification.acknowledged(subscription)
        })
        res.status(200).json('Nudge acknowledged successfully!')
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = { index, contacts, received, acknowledge }