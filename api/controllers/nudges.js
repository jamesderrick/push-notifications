const Nudge = require('../models/Nudge');

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

module.exports = { received, acknowledge }