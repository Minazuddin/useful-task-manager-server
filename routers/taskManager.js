const express = require('express');
const router = express.Router();
const TaskManager = require('../controllers/taskManager.js')

router.get('/', TaskManager.renderHomePage)
router.post('/addTask', TaskManager.addTask)

module.exports = router;