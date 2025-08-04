const express = require('express');
const router = express.Router();

const { getAllTasks, getTaskById, getTasksByUserId, getTaskByIdAnduserId, createTask, updateTask, deleteTask } = require('../controllers/taskController');


router.get('/', getAllTasks);
router.get('/:id', getTaskById);

router.get('/:userId/tasks', getTasksByUserId);

router.get('/:userId/tasks/:taskId', getTaskByIdAnduserId);


router.post('/', createTask);

router.patch('/:id', updateTask);

router.delete('/:id', deleteTask);


module.exports = router;
