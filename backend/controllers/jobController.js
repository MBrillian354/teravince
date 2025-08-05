const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newJob = new Job({
      title,
      description,
      assignedTo: [],
      status: 'draft'
    });

    await newJob.save();

    res.status(201).json({ msg: 'Job created successfully', job: newJob });
  } catch (error) {
    // Error handling without session
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('assignedTo', 'firstName lastName email')
      .populate('inProgressTaskCount')
      .populate('completedTaskCount');
    
    // Add task counts to each job
    const jobsWithCounts = jobs.map(job => {
      // Handle the case where virtual fields return arrays (one count per assigned user)
      let inProgressCount = 0;
      let completedCount = 0;
      
      if (Array.isArray(job.inProgressTaskCount)) {
        inProgressCount = job.inProgressTaskCount.reduce((sum, count) => sum + count, 0);
      } else {
        inProgressCount = job.inProgressTaskCount || 0;
      }
      
      if (Array.isArray(job.completedTaskCount)) {
        completedCount = job.completedTaskCount.reduce((sum, count) => sum + count, 0);
      } else {
        completedCount = job.completedTaskCount || 0;
      }

      const taskCounts = {
        inProgress: inProgressCount,
        completed: completedCount,
        total: inProgressCount + completedCount
      };

      return {
        ...job.toObject(),
        taskCounts
      };
    });

    res.json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('inProgressTaskCount')
      .populate('completedTaskCount');
    
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    // Handle the case where virtual fields return arrays (one count per assigned user)
    let inProgressCount = 0;
    let completedCount = 0;
    
    if (Array.isArray(job.inProgressTaskCount)) {
      inProgressCount = job.inProgressTaskCount.reduce((sum, count) => sum + count, 0);
    } else {
      inProgressCount = job.inProgressTaskCount || 0;
    }
    
    if (Array.isArray(job.completedTaskCount)) {
      completedCount = job.completedTaskCount.reduce((sum, count) => sum + count, 0);
    } else {
      completedCount = job.completedTaskCount || 0;
    }

    // Calculate total count of inProgress + completed tasks
    const taskCounts = {
      inProgress: inProgressCount,
      completed: completedCount,
      total: inProgressCount + completedCount
    };

    // Add task counts to the response
    const jobResponse = {
      ...job.toObject(),
      taskCounts
    };

    res.json(jobResponse);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { title, description, deadline, assignedTo, status } = req.body;

    const jobData = { title, description, deadline, assignedTo, status };

    const updatedJob = await Job.findByIdAndUpdate(id, jobData, {
      new: true,
      session
    });
    if (!updatedJob) throw new Error('Job not found');

    await User.updateMany({ jobId: id }, { $unset: { jobId: "" } }, { session });

    if (assignedTo) {
      const user = await User.findByIdAndUpdate(assignedTo, { jobId: id }, { session });
      if (!user) throw new Error('Assigned user not found');
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'Job updated successfully', job: updatedJob });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deleted = await Job.findByIdAndDelete(req.params.id, { session });
    if (!deleted) throw new Error('Job not found');

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'Job deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
