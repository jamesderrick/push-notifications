const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

//need to add real email address
webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

class Notification {

    static async send (subscription, nudge, contacts) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify({
                title: 'New Contacts',//req.body.title,
                body: 'There are new contacts to follow up with...',//req.body.body,
                data: JSON.stringify({
                    id: nudge.nudge_id,
                    contacts: contacts,
                    requestorId: nudge.requestor_id
                })
            }))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    static async acknowledged(subscription) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify({
                title: 'Acknowledged',
                body: 'Your nudge has been acknowledged'
            }))
        } catch(err) {
            return Promise.reject(err)
        }
    }

}

module.exports = Notification