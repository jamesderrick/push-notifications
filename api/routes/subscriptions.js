const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptions')

router.get('/', subscriptionController.index);
router.post('/save', subscriptionController.create);

module.exports = router;