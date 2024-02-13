const db = require('../db');

class Contact {
    static get all() {
        return new Promise((resolve) => {
            db.all(
                `SELECT *
                FROM contacts c`, 
                (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const contacts = []
                    rows.forEach(row => {
                        contacts.push(row)
                    })
                    resolve(contacts)
                }
            )
        })
    }

    static async getByNudgeId(nudgeId) {
        return new Promise((resolve) => {
            db.all(
                `SELECT c.first_name,
                        c.last_name,
                        c.email
                FROM nudge_contact nc
                INNER JOIN contacts c on nc.contact_id = c.contact_id 
                WHERE nc.nudge_id = ${nudgeId}`, 
                (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    resolve(rows)
                }
            )
        })
    }
}

module.exports = Contact