const Task = require('../models/Task');

// Buat Task baru
exports.createTask = async (req, res) => {
  try {
    const { description, submitted_at, deadline, filename } = req.body;

    const task = new Task({
      description,
      submitted_at,
      deadline,
      filename,
    });

    await task.save();

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Lihat semua task
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
