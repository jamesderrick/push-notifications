const express = require('express');
const router = express.Router();
const nudgesController = require('../controllers/nudges')

router.get('/', nudgesController.index);
router.get('/contacts', nudgesController.contacts);
router.patch('/received', nudgesController.received);
router.patch('/acknowledged', nudgesController.acknowledge);

module.exports = router;