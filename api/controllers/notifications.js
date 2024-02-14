const webpush = require('web-push');
const Contact = require('../models/Contact');
const Subscription = require('../models/Subscription');
const Nudge = require('../models/Nudge');
const Notification = require('../models/Notification');

async function send(req, res) {
    try {
        let nudges = [];
        if(req.body.nudgeId) {
            nudges.push(await Nudge.getById(req.body.nudgeId))
        } else {
            nudges = await Nudge.all
        }

        nudges.forEach(async (nudge) => {
            const subscriptions = await Subscription.getByContactId(nudge.recipient_id);
            const contacts = await Contact.getByNudgeId(nudge.nudge_id);

            subscriptions.forEach(async subscription => {
                try {
                    await Notification.send(subscription, nudge, contacts)
                } catch(err) {
                    if(err.statusCode === 410) {
                        //subscription unsubscribed or expired
                        Subscription.remove(subscription.id)
                    }
                }
            })
        })
        res.status(200).json('Notifiction sent successfully!')
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = { send }