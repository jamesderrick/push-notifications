const db = require('../db');

class Subscription {
    constructor(data) {
        this.id = data.subscription_id
        this.endpoint = data.endpoint
        this.expirationTime = data.expiration_time
        this.keys = {
            p256dh: data.key_1,
            auth: data.key_2
        }
    }

    static get all() {
        return new Promise((resolve) => {
            db.all(
                `SELECT subscription_id, endpoint, expiration_time, key_1, key_2 FROM subscriptions`, 
                (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const subscriptions = []
                    rows.forEach(row => {
                        subscriptions.push(new Subscription(row))
                    })
                    resolve(subscriptions)
                }
            )
        })
    }

    static getByContactId(contactId) {
        return new Promise((resolve) => {
            db.all(
                `SELECT * FROM subscriptions WHERE contact_id = ?`,
                [
                    contactId
                ], 
                (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const subscriptions = []
                    rows.forEach(row => {
                        subscriptions.push(new Subscription(row))
                    })
                    resolve(subscriptions)
                }
            )
        }) 
    }

    static create(sub) {
        return db.run(
            `INSERT INTO subscriptions (subscription_id, endpoint, expiration_time, key_1, key_2, contact_id, agent) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                sub.subscriptionId,
                sub.endpoint, 
                sub.expirationTime, 
                sub.keys.p256dh,
                sub.keys.auth,
                sub.contactId,
                sub.agent
            ],
            (error) => {
                if (error) {
                    console.error(error.message);
                    throw('Failure creating database record')
                }
            }
        );
    }

    static remove(subscription_id) {
        db.run(
            `DELETE FROM subscriptions WHERE subscription_id = ?`,
            [
                subscription_id,
            ],
            (error) => {
                if (error) {
                    console.error(error.message);
                    throw('Failure deleting database record')
                }
            }
        )
    }
}

module.exports = Subscription