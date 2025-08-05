const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const verifyToken = require('../middlewares/auth');

const { getAllTasks, getTaskById, getTasksByUserId, getTaskByIdAnduserId, createTask, updateTask, deleteTask, uploadEvidence } = require('../controllers/taskController');


router.get('/', getAllTasks);

router.get('/:id', getTaskById);

router.get('/:userId/tasks', getTasksByUserId);

router.get('/:userId/tasks/:taskId', getTaskByIdAnduserId);


router.post('/', createTask);

router.post('/:id/evidence', verifyToken, upload.single('evidence'), uploadEvidence);

router.patch('/:id', updateTask);

router.delete('/:id', deleteTask);


module.exports = router;
