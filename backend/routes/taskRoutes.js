const express = require('express');
const router = express.Router();
const { createTask, getAllTasks } = require('../controllers/taskController');

// Endpoint untuk membuat task
router.post('/', createTask);

// Endpoint untuk melihat semua task
router.get('/', getAllTasks);

module.exports = router;
