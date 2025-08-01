const express = require('express');
const router = express.Router();

const { getAllTasks, getTaskById, getTasksByStaffId, getTaskByIdAndStaffId, createTask, updateTask, deleteTask } = require('../controllers/taskController');


router.get('/', getAllTasks);
router.get('/:id', getTaskById);

router.get('/:staffId/tasks', getTasksByStaffId);

router.get('/:staffId/tasks/:taskId', getTaskByIdAndStaffId);


router.post('/', createTask);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);


module.exports = router;
