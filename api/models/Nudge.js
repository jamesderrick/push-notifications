const db = require('../db');

class Nudge {

    static get all() {
        return new Promise((resolve) => {
            db.all(
                `SELECT n.nudge_id, 
                        requestor_id, 
                        c.first_name || ' ' || c.last_name as requestor,
                        recipient_id,
                        c1.first_name || ' ' || c1.last_name as recipient,
                        received,
                        received_timestamp, 
                        acknowledged,
                        acknowledged_timestamp,
                        group_concat(c2.first_name || ' ' || c2.last_name,',') as contacts
                FROM nudges n
                INNER JOIN contacts c on n.requestor_id = c.contact_id
                INNER JOIN contacts c1 on n.recipient_id = c1.contact_id
                INNER JOIN nudge_contact nc on n.nudge_id = nc.nudge_id
                INNER JOIN contacts c2 on nc.contact_id = c2.contact_id
                GROUP BY n.nudge_id, requestor_id, requestor, recipient, received, acknowledged`, 
                (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const nudges = []
                    rows.forEach(row => {
                        nudges.push(row)
                    })
                    resolve(nudges)
                }
            )
        })
    }

    static getById(nudgeId) {
        return new Promise((resolve) => {
            db.get(
                `SELECT * FROM nudges WHERE nudge_id = ?`,
                [
                    nudgeId
                ], 
                (err, row) => {
                    if (err) {
                        throw err;
                    }
                    resolve(row)
                }
            )
        }) 
    }
    
    static get latestId() {
        return new Promise((resolve) => {
            db.get(
                `SELECT max(nudge_id) as id FROM nudges`,
                (err, row) => {
                    if (err) {
                        throw err;
                    }
                    resolve(row)
                }
            )
        }) 
    }

    static create(nudge) {
        return new Promise((resolve) => {
            db.run(
                `INSERT INTO nudges (requestor_id, recipient_id) VALUES (?,?)`,
                [
                    Number(nudge.requestor),
                    Number(nudge.recipient)
                ],
                (error) => {
                    if (error) {
                        console.error(error.message);
                    }
                    resolve('Successfully created')
                }
            )
        })
    }

    static addContact(nudgeId, contactId) {
        return new Promise((resolve) => {
            db.run(
                `INSERT INTO nudge_contact (nudge_id, contact_id) VALUES (?,?)`,
                    [
                        nudgeId,
                        contactId
                    ],
                    (error) => {
                        if (error) {
                            console.error(error.message);
                        }
                        resolve('Successfully added')
                    }
                );
        })
    }

    static received(nudgeId) {
        const timestamp = new Date()
        return db.run(
            `UPDATE nudges SET received = 1, received_timestamp = ? WHERE nudge_id = ?`,
                [
                    timestamp,
                    nudgeId
                ],
                (error) => {
                    if (error) {
                    console.error(error.message);
                    }
                }
            );
    }

    static acknowledged(nudgeId) {
        const timestamp = new Date()
        return db.run(
            `UPDATE nudges SET acknowledged = 1, acknowledged_timestamp = ? WHERE nudge_id = ?`,
                [
                    timestamp,
                    nudgeId
                ],
                (error) => {
                    if (error) {
                    console.error(error.message);
                    }
                }
            );
    }
}

module.exports = Nudge