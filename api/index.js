// const express = require('express')
// const webpush = require('web-push')
// const path = require('path')
// const crypto = require("crypto");
// const port = 5000

// const app = express();
// const db = require('./db');

// app.use(express.json());
// //Set static path
// app.use(express.static(path.join(__dirname, '../client')));

// const publicVapidKey = 'BHacMbNlCO3qyTkYw6T84fBFPNYJVTaCiCoZR-37kKC-pX5FzMruAITKwdG0H3ZUV4bYcGukg8PbpzCH2x5JH_o';
// const privateVapidKey = 'o4w6MDyhLrGwUq4z9LKMjxS4jFt0HYeClqI0Hez2_ak';

// //need to add real email address
// webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

// app.get("/api", async (req, res) => {
//     res.send('notification server up and running...')
// })

// //const subDatabase = [];
// app.post("/api/save-subscription", (req, res) => {

//     const sub = req.body;
//     if(sub.endpoint.search('wns2-ln2p.notify.windows.com') > -1) {
//         sub.subscriptionId = crypto.randomBytes(16).toString("hex");
//         sub.agent = 'edge'
//         sub.contactId = 3
//     } else {
//         sub.subscriptionId = crypto.randomBytes(16).toString("hex");
//         sub.agent = 'chrome'
//         sub.contactId = 2
//     }

//     db.run(
//         `INSERT INTO subscriptions (subscription_id, endpoint, expiration_time, key_1, key_2, contact_id, agent) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [
//             sub.subscriptionId,
//             sub.endpoint, 
//             sub.expirationTime, 
//             sub.keys.p256dh,
//             sub.keys.auth,
//             sub.contactId,
//             sub.agent
//         ],
//         (error) => {
//             if (error) {
//                 console.error(error.message);
//                 throw('Failure creating database record')
//             }
//         }
//     );

//     res.status(201).send({ message: 'Subscription saved!' })
// })

// app.post("/api/send-notification", (req, res) => {

//     const nudgeId = req.body.nudgeId;

//     db.each(`SELECT n.nudge_id,
//                     s.subscription_id,
//                     s.endpoint,
//                     s.expiration_time,
//                     s.key_1,
//                     s.key_2,
//                     GROUP_CONCAT(c.first_name || ' ' || c.last_name || ' (' || c.email || ')',';') as contacts
//                 FROM nudges n
//                 INNER JOIN subscriptions s on n.recipient_id = s.contact_id
//                 INNER JOIN nudge_contact nc on n.nudge_id = nc.nudge_id
//                 INNER JOIN contacts c on nc.contact_id = c.contact_id 
//                 WHERE n.nudge_id = 1
//                 GROUP BY subscription_id, endpoint, expiration_time, key_1, key_2`, (error, row) => {
//         if (error) {
//           throw new Error(error.message);
//         } else {
//             console.log(row)
//             //if(row.owner_id === req.body.ownerId) {
//                 const subscription = {
//                     endpoint: row.endpoint,
//                     expirationTime: row.expiration_time,
//                     keys: {
//                         p256dh: row.key_1,
//                         auth: row.key_2
//                     }
//                 }
//                 const contacts = row.contacts.split(';');

//                     webpush.sendNotification(subscription, JSON.stringify({
//                         title: req.body.title,
//                         body: req.body.body,
//                         data: JSON.stringify({
//                             id: row.nudge_id,
//                             contacts: contacts
//                         })
//                     })).catch(err => {
//                         console.log(err)
//                         if(err.statusCode === 410) {
//                             //subscription unsubscribed or expired
//                             console.log(row.subscription_id)
//                             db.run(
//                                 `DELETE FROM subscriptions WHERE subscription_id = ?`,
//                                 [
//                                     row.subscription_id,
//                                 ],
//                                 (error) => {
//                                     if (error) {
//                                         console.error(error.message);
//                                         throw('Failure deleting database record')
//                                     }
//                                 }
//                             )
//                         }
//                     })

//             //}
//         }
//     });

//     // subDatabase
//     //     .filter(sub => sub.browser === req.body.browser || !req.body.browser)
//     //     .forEach((subscription) => {
//     //         webpush.sendNotification(subscription, JSON.stringify({
//     //             title: req.body.title,
//     //             body: req.body.body
//     //         }))
//     // })
//     res.json({ status: 'Success', message: 'Message sent to the push server!'})
// })

// app.post("/api/subscription-change", (req, res) => {
//     console.log(req.body)
//     res.json({ status: 'Success', message: 'Subscription change handled'})
// })

// app.post("/api/nudge-received", (req, res) => {
//     console.log(req.body)

//     db.run(
//         `UPDATE nudges SET received = 1 WHERE nudge_id = ?`,
//         [
//           req.body.nudgeId
//         ],
//         (error) => {
//           if (error) {
//             console.error(error.message);
//           }
//         }
//     );

//     res.json({ status: 'Success', message: 'Nudge received'})
// })

// app.post("/api/nudge-acknowledged", (req, res) => {
//     console.log(req.body)

//     db.run(
//         `UPDATE nudges SET acknowledged = 1 WHERE nudge_id = ?`,
//         [
//           req.body.nudgeId
//         ],
//         (error) => {
//           if (error) {
//             console.error(error.message);
//           }
//         }
//     );

//     res.json({ status: 'Success', message: 'Nudge acknowledged'})
// })

const app = require('./server');

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})