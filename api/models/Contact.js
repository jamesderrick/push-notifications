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

    static async getByEmail(email) {
        return new Promise((resolve) => {
            db.get(
                `SELECT c.contact_id,
                        c.first_name,
                        c.last_name,
                        c.email
                FROM contacts c
                WHERE c.email = ?`,
                [ email ], 
                (err, row) => {
                    if (err) {
                        throw err;
                    }
                    resolve(row)
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

    static async create(firstName, lastName, email) {
        return new Promise((resolve) => {
            db.run(
                `INSERT INTO contacts (first_name, last_name, email, type) VALUES (?,?,?,?)`,
                [
                    firstName,
                    lastName,
                    email,
                    'owner'
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
}

module.exports = Contact