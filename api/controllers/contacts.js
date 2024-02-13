const Contact = require('../models/Contact');

async function index(req, res) {
    try {
        const contacts = await Contact.all;
        res.status(200).json(contacts)
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { index }