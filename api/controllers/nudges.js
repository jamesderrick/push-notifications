const Nudge = require('../models/Nudge');
const Contact = require('../models/Contact');

async function contacts(req, res) {
    const nudgeId = req.query.id;
    try {
        const contacts = await Contact.getByNudgeId(nudgeId)
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).send(err)
    }
}

async function received(req, res) {
    const nudgeId = req.body.nudgeId;
    try {
        await Nudge.received(nudgeId)
        res.status(200).json('Nudge updated successfully!')
    } catch (err) {
        res.status(500).send(err)
    }
}

async function acknowledge(req, res) {
    const nudgeId = req.body.nudgeId;
    try {
        await Nudge.acknowledged(nudgeId)
        res.status(200).json('Nudge updated successfully!')
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = { contacts, received, acknowledge }