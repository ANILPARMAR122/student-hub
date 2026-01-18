const express = require('express');
const router = express.Router();
const recyclingController = require('../controllers/recyclingController');

router.get('/', recyclingController.getAllItems);
router.post('/donate', recyclingController.donateItem);

module.exports = router;