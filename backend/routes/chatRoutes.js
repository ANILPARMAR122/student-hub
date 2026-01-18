const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/contacts', chatController.getContacts);
router.get('/messages', chatController.getMessages);
router.post('/send', chatController.sendMessage);
router.post('/report', chatController.reportMessage);

module.exports = router;