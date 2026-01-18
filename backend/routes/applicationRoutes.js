const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/apply', applicationController.applyForJob);
router.get('/my/:userId', applicationController.getMyApplications);
router.delete('/cancel/:id', applicationController.cancelApplication); // 🟢 NEW LINE

module.exports = router;