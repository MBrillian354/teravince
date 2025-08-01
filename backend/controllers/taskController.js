const mongoose = require('mongoose');
const Task = require('../models/Task');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('userId');
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid task ID' });
    }

    const task = await Task.findById(id).populate('userId');
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get tasks by staff ID
exports.getTasksByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid staff ID' });
    }

    const tasks = await Task.find({ userId }).populate('userId');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get specific task by ID and staff ID
exports.getTaskByIdAnduserId = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ msg: 'Invalid staff ID or task ID' });
    }

    const task = await Task.findOne({ _id: taskId, userId }).populate('userId');
    if (!task) return res.status(404).json({ msg: 'Task not found for this staff member' });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      activity,
      score,
      evidence,
      startDate,
      endDate,
      approvalStatus,
      taskStatus,
      supervisorComment
    } = req.body;

    // Validate required fields
    if (!userId || !title || !description || !score || !evidence || !startDate || !endDate) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid staff ID' });
    }

    // Validate activity array if provided
    if (activity && Array.isArray(activity)) {
      for (let act of activity) {
        if (!act.title || !act.amount || !act.operator) {
          return res.status(400).json({ msg: 'Invalid activity structure. Each activity must have title, amount, and operator' });
        }
        if (!['lowerThan', 'greaterThan'].includes(act.operator)) {
          return res.status(400).json({ msg: 'Invalid operator. Must be either "lowerThan" or "greaterThan"' });
        }
      }
    }

    const newTask = new Task({
      userId,
      title,
      description,
      activity: activity || [],
      score,
      evidence,
      startDate,
      endDate,
      approvalStatus: approvalStatus || 'pending',
      taskStatus: taskStatus || 'inProgress',
      supervisorComment
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate('userId');

    res.status(201).json({
      success: true,
      msg: 'Task created successfully',
      data: populatedTask
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid task ID' });
    }

    // Validate userId if provided in update
    if (updateData.userId && !mongoose.Types.ObjectId.isValid(updateData.userId)) {
      return res.status(400).json({ msg: 'Invalid staff ID' });
    }

    // Validate activity array if provided
    if (updateData.activity && Array.isArray(updateData.activity)) {
      for (let act of updateData.activity) {
        if (!act.title || !act.amount || !act.operator) {
          return res.status(400).json({ msg: 'Invalid activity structure. Each activity must have title, amount, and operator' });
        }
        if (!['lowerThan', 'greaterThan'].includes(act.operator)) {
          return res.status(400).json({ msg: 'Invalid operator. Must be either "lowerThan" or "greaterThan"' });
        }
      }
    }

    // Validate enum fields if provided
    if (updateData.approvalStatus && !['pending', 'approved', 'rejected'].includes(updateData.approvalStatus)) {
      return res.status(400).json({ msg: 'Invalid approval status. Must be "pending", "approved", or "rejected"' });
    }

    if (updateData.taskStatus && !['inProgress', 'submitted', 'rejected', 'completed', 'cancelled'].includes(updateData.taskStatus)) {
      return res.status(400).json({ msg: 'Invalid task status' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId');

    if (!updatedTask) return res.status(404).json({ msg: 'Task not found' });

    res.status(200).json({
      success: true,
      msg: 'Task updated successfully',
      data: updatedTask
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid task ID' });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ msg: 'Task not found' });

    res.status(200).json({
      success: true,
      msg: 'Task deleted successfully',
      data: deletedTask
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};