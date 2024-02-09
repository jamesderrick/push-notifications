const webpush = require('web-push');
const Contact = require('../models/Contact');
const Subscription = require('../models/Subscription');
const Nudge = require('../models/Nudge');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

//need to add real email address
webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

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

            subscriptions.forEach(subscription => {       
                webpush.sendNotification(subscription, JSON.stringify({
                    title: req.body.title,
                    body: req.body.body,
                    data: JSON.stringify({
                        id: req.body.nudgeId,
                        contacts: contacts
                    })
                })).catch(err => {
                    console.log(`Error: ${subscription.id} = ${err.body}`)
                    if(err.statusCode === 410) {
                        //subscription unsubscribed or expired
                        Subscription.remove(subscription.id)
                    }
                })
            })

        })




        //const nudge = await Nudge.getById(req.body.nudgeId)
        // let subscriptions;
        // let contacts;
        // if(nudge) {
        //     subscriptions = [await Subscription.getByContactId(nudge.recipient_id)];
        //     contacts = await Contact.getByNudgeId(nudge.nudge_id);
        // } else {
        //     subscriptions = await Subscription.all;
        // }
        //const subscriptions = [await Subscription.getByContactId(nudge.recipient_id)];
        //const contacts = await Contact.getByNudgeId(nudge.nudge_id);

        // subscriptions.forEach(subscription => {       
        //     webpush.sendNotification(subscription, JSON.stringify({
        //         title: req.body.title,
        //         body: req.body.body,
        //         data: JSON.stringify({
        //             id: req.body.nudgeId,
        //             contacts: contacts
        //         })
        //     })).catch(err => {
        //         console.log(`Error: ${subscription.id} = ${err.body}`)
        //         if(err.statusCode === 410) {
        //             //subscription unsubscribed or expired
        //             Subscription.remove(subscription.id)
        //         }
        //     })
        // })
        res.status(200).json('Notifiction sent successfully!')
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = { send }
