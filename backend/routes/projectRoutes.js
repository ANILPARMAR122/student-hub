
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.post('/add', projectController.createProject);

// 🟢 NEW ROUTES
router.post('/join', projectController.joinProject);
router.get('/my/:userId', projectController.getMyProjects);


// ... existing imports ...

// ... existing routes ...
router.put('/update', projectController.updateProject); // 🟢 NEW ROUTE

// ... existing imports ...

// ... existing routes ...
router.delete('/leave', projectController.leaveProject); // 🟢 NEW ROUTE

module.exports = router;