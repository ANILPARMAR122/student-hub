const express = require('express');
const router = express.Router();
const subController = require('../controllers/subscriptionController');

router.get('/', subController.getAllGroups);
router.post('/create', subController.createGroup);
router.post('/join', subController.joinGroup);

module.exports = router;