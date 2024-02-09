const db = require('../db');

class Nudge {

    static get all() {
        return new Promise((resolve) => {
            db.all(
                `SELECT nudge_id, requestor_id, recipient_id, received, acknowledged FROM nudges`, 
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

    static received(nudgeId) {
        return db.run(
            `UPDATE nudges SET received = 1 WHERE nudge_id = ?`,
                [
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
        return db.run(
            `UPDATE nudges SET acknowledged = 1 WHERE nudge_id = ?`,
                [
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