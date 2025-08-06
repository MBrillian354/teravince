const mongoose = require('mongoose');
const Task = require('../models/Task');
const path = require('path');
const fs = require('fs');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { jobId } = req.query;
    
    let tasks;
    if (jobId) {
      // If jobId is provided, get the job and find tasks for users assigned to that job
      const Job = require('../models/Job');
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }
      
      // Find tasks for users assigned to this job
      tasks = await Task.find({ userId: { $in: job.assignedTo } }).populate('userId');
    } else {
      tasks = await Task.find().populate('userId');
    }
    
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
      kpis,
      score,
      evidence,
      startDate,
      endDate,
      taskStatus,
      supervisorComment
    } = req.body;

    // Validate required fields - make some fields optional for draft creation
    if (!userId || !title || !description) {
      return res.status(400).json({ msg: 'Missing required fields: userId, title, description' });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid staff ID' });
    }

    // Validate kpis array if provided
    if (kpis && Array.isArray(kpis)) {
      for (let kpi of kpis) {
        if (!kpi.kpiTitle || !kpi.targetAmount || !kpi.operator) {
          return res.status(400).json({ msg: 'Invalid KPI structure. Each KPI must have kpiTitle, targetAmount, and operator' });
        }
        if (!['lessThan', 'greaterThan'].includes(kpi.operator)) {
          return res.status(400).json({ msg: 'Invalid operator. Must be either "lessThan" or "greaterThan"' });
        }
      }
    }

    const newTask = new Task({
      userId,
      title,
      description,
      kpis: kpis || [],
      score: score || 0,
      evidence: evidence || '',
      startDate,
      endDate,
      taskStatus: taskStatus || 'draft',
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

    // Validate kpis array if provided
    if (updateData.kpis && Array.isArray(updateData.kpis)) {
      for (let kpi of updateData.kpis) {
        if (!kpi.kpiTitle || !kpi.targetAmount || !kpi.operator) {
          return res.status(400).json({ msg: 'Invalid KPI structure. Each KPI must have kpiTitle, targetAmount, and operator' });
        }
        if (!['lessThan', 'greaterThan'].includes(kpi.operator)) {
          return res.status(400).json({ msg: 'Invalid operator. Must be either "lessThan" or "greaterThan"' });
        }
      }
    }

    // Validate enum fields if provided
    if (updateData.taskStatus && !['inProgress', 'submissionRejected', 'approvalRejected', 'submittedAndAwaitingReview', 'submittedAndAwaitingApproval', 'revisionInProgress', 'completed', 'draft'].includes(updateData.taskStatus)) {
      return res.status(400).json({ msg: 'Invalid task status. Must be one of: inProgress, submissionRejected, approvalRejected, submittedAndAwaitingReview, submittedAndAwaitingApproval, revisionInProgress, completed, draft' });
    }

    console.log('Update Data:', updateData);
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

// Upload evidence file for task
exports.uploadEvidence = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid task ID' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No evidence file uploaded' });
    }

    // Get the current task to remove old evidence file if exists
    const currentTask = await Task.findById(id);
    if (!currentTask) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Remove old evidence file if exists
    if (currentTask.evidence && currentTask.evidence.startsWith('uploads/')) {
      const oldEvidencePath = path.join(__dirname, '..', currentTask.evidence);
      if (fs.existsSync(oldEvidencePath)) {
        fs.unlinkSync(oldEvidencePath);
      }
    }

    // Update task with new evidence file path
    const evidencePath = `uploads/${req.file.filename}`;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { evidence: evidencePath },
      { new: true }
    ).populate('userId');

    res.status(200).json({
      success: true,
      msg: 'Evidence uploaded successfully',
      data: updatedTask,
      evidenceUrl: `/${evidencePath}`
    });
  } catch (err) {
    console.error('Error uploading evidence:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};